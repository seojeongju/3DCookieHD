
import { hrdSidebar } from './components/hrd_sidebar';

export const adminHrdItemsTransactionsHtml = () => `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>물품 입/출고 관리 - 와우쓰리디홍대센터</title>
    <link rel="stylesheet" href="/static/tailwind-app.css">
<link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Noto Sans KR', sans-serif; }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f1f1f1; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 3px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
        .glass-effect { background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(10px); }
    </style>
</head>
<body class="bg-slate-50 text-slate-800">
    <div class="flex h-screen overflow-hidden">
        ${hrdSidebar('items-transactions')}
        
        <main class="flex-1 flex flex-col h-full overflow-hidden relative">
            <!-- Header -->
            <header class="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 z-10 flex-shrink-0">
                <div class="flex items-center gap-4">
                    <h1 class="text-xl font-bold text-gray-800">입/출고 관리</h1>
                    <span class="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-md">자산/비품</span>
                </div>
                <div class="flex items-center gap-3">
                    <span class="text-sm text-gray-500">전체 입출고 이력을 관리합니다.</span>
                </div>
            </header>

            <!-- Content -->
            <div class="flex-1 overflow-y-auto p-6 custom-scrollbar bg-slate-50">
                <div class="max-w-7xl mx-auto space-y-6">
                    
                    <!-- Stats & Actions -->
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <!-- Search & Filter -->
                        <div class="md:col-span-2 bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                            <h3 class="text-sm font-bold text-gray-800 mb-4 flex items-center">
                                <i class="fas fa-search mr-2 text-blue-500"></i> 이력 검색
                            </h3>
                            <div class="flex flex-col md:flex-row gap-3">
                                <div class="relative flex-1">
                                    <i class="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                                    <input type="text" id="searchInput" placeholder="물품명, 모델명 검색..." 
                                        class="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all">
                                </div>
                                <select id="typeFilter" onchange="loadTransactions(1)" class="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none min-w-[120px]">
                                    <option value="all">전체 구분</option>
                                    <option value="IN">입고 (IN)</option>
                                    <option value="OUT">출고 (OUT)</option>
                                </select>
                                <select id="categoryFilter" onchange="loadTransactions(1)" class="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none min-w-[120px]">
                                    <option value="all">전체 분류</option>
                                    <option value="textbook">교재</option>
                                    <option value="equipment">장비/기자재</option>
                                    <option value="consumable">소모품/재료</option>
                                    <option value="furniture">가구/비품</option>
                                    <option value="software">S/W</option>
                                    <option value="etc">기타</option>
                                </select>
                                <button onclick="loadTransactions(1)" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium text-sm shadow-sm">
                                    검색
                                </button>
                            </div>
                        </div>

                        <!-- Quick Action -->
                        <div class="bg-gradient-to-br from-blue-600 to-indigo-700 p-5 rounded-xl text-white shadow-lg flex flex-col justify-between relative overflow-hidden group">
                           <div class="absolute right-0 top-0 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl -mr-10 -mt-10 transition-transform group-hover:scale-150 duration-700"></div>
                           
                           <div>
                               <h3 class="font-bold text-lg mb-1">빠른 입/출고 등록</h3>
                               <p class="text-blue-100 text-xs opacity-80">물품을 검색하여 <br>즉시 입/출고 처리하세요.</p>
                           </div>
                           
                           <button onclick="openTransactionModal()" class="mt-4 w-full py-2.5 bg-white text-blue-700 rounded-lg font-bold text-sm hover:bg-blue-50 transition shadow-md flex items-center justify-center">
                               <i class="fas fa-plus-circle mr-2"></i> 입/출고 등록하기
                           </button>
                        </div>
                    </div>

                    <!-- Transactions Table -->
                    <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                        <div class="px-6 py-4 border-b border-gray-200 flex flex-wrap justify-between items-center gap-3 bg-gray-50/50">
                            <h2 class="font-bold text-gray-800 flex items-center">
                                <i class="fas fa-history mr-2 text-gray-500"></i> 전체 입/출고 내역
                            </h2>
                            <div class="flex items-center gap-3">
                                <span id="totalCount" class="text-xs font-medium text-gray-500 bg-white px-2 py-1 rounded border border-gray-200 shadow-sm">총 0건</span>
                                <label class="flex items-center gap-1.5 text-sm text-gray-500">
                                    <span>페이지당</span>
                                    <select id="rowsPerPageTx" onchange="window.setRowsPerPageTx(parseInt(this.value,10))" class="border border-gray-300 rounded-lg px-2 py-1.5 text-sm focus:ring-2 focus:ring-blue-500">
                                        <option value="10">10</option>
                                        <option value="20" selected>20</option>
                                        <option value="30">30</option>
                                        <option value="50">50</option>
                                    </select>
                                    <span>건</span>
                                </label>
                            </div>
                        </div>
                        <div class="overflow-x-auto">
                            <table class="w-full text-sm text-left">
                                <thead class="bg-gray-50/80 text-gray-500 font-medium uppercase text-xs border-b border-gray-200">
                                    <tr>
                                        <th class="px-6 py-3 w-16 text-center">No</th>
                                        <th class="px-6 py-3 w-24 text-center">분류</th>
                                        <th class="px-6 py-3 w-24 text-center">구분</th>
                                        <th class="px-6 py-3">물품 정보</th>
                                        <th class="px-6 py-3 text-right">수량 변동</th>
                                        <th class="px-6 py-3 text-right">변동 후 재고</th>
                                        <th class="px-6 py-3">사유</th>
                                        <th class="px-6 py-3 w-36">처리일시</th>
                                    </tr>
                                </thead>
                                <tbody id="transactionTableBody" class="divide-y divide-gray-100">
                                    <tr><td colspan="7" class="px-6 py-10 text-center text-gray-400">데이터를 불러오는 중...</td></tr>
                                </tbody>
                            </table>
                        </div>
                        <!-- Pagination -->
                        <div class="px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4 bg-gray-50/30">
                            <div id="paginationRangeTx" class="text-sm text-gray-600"></div>
                            <nav id="paginationContainer" class="flex flex-wrap items-center justify-center gap-1"></nav>
                        </div>
                    </div>

                </div>
            </div>
        </main>
    </div>

    <!-- 입/출고 등록 모달 (검색 후 등록) -->
    <div id="transactionModal" class="fixed inset-0 bg-black bg-opacity-50 hidden z-50 flex items-center justify-center backdrop-blur-sm">
        <div class="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden transform transition-all scale-100">
            <div class="bg-gradient-to-r from-gray-800 to-gray-900 px-6 py-4 flex justify-between items-center text-white">
                <h3 class="text-lg font-bold flex items-center">
                    <i class="fas fa-exchange-alt mr-2 opacity-80"></i> 입/출고 등록
                </h3>
                <button onclick="closeModal('transactionModal')" class="text-gray-400 hover:text-white transition">
                    <i class="fas fa-times text-xl"></i>
                </button>
            </div>
            
            <div class="p-6">
                <!-- 1. 물품 검색 단계 -->
                <div id="stepSearch" class="space-y-4">
                    <div class="text-center mb-4">
                        <div class="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-2 text-xl">
                            <i class="fas fa-search"></i>
                        </div>
                        <h4 class="font-bold text-gray-800">대상 물품 검색</h4>
                        <p class="text-xs text-gray-500 mt-1">입/출고할 물품을 먼저 검색하여 선택해주세요.</p>
                    </div>
                    
                    <div class="relative">
                        <input type="text" id="itemSearchInput" placeholder="물품명 입력 후 엔터..." 
                            class="w-full pl-4 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
                            onkeyup="handleItemSearch(event)">
                        <button onclick="handleItemSearch({key:'Enter'})" class="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 p-2">
                            <i class="fas fa-search"></i>
                        </button>
                    </div>

                    <!-- 검색 결과 리스트 -->
                    <div id="itemSearchResults" class="max-h-48 overflow-y-auto border border-gray-200 rounded-lg hidden custom-scrollbar">
                        <!-- 검색 결과 아이템들이 여기 동적으로 들어감 -->
                    </div>
                </div>

                <!-- 2. 입력 폼 단계 (물품 선택 후 표시) -->
                <form id="transactionForm" onsubmit="submitTransaction(event)" class="space-y-4 hidden">
                    <div class="bg-blue-50 p-4 rounded-lg flex items-center gap-4 mb-4 border border-blue-100">
                        <div id="selectedItemImage" class="w-12 h-12 bg-white rounded flex-shrink-0 flex items-center justify-center border border-blue-100 overflow-hidden">
                            <i class="fas fa-box text-gray-300"></i>
                        </div>
                        <div class="flex-1 min-w-0">
                            <h5 id="selectedItemName" class="font-bold text-gray-800 truncate">상품명</h5>
                            <p class="text-xs text-gray-500">현재 재고: <strong id="selectedItemQty" class="text-blue-600">0</strong>개</p>
                            <input type="hidden" id="selectedItemId" name="itemId">
                        </div>
                        <button type="button" onclick="resetStep()" class="text-xs text-blue-600 underline hover:text-blue-800">변경</button>
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-xs font-semibold text-gray-600 mb-1">구분</label>
                            <div class="flex rounded-md shadow-sm" role="group">
                                <button type="button" onclick="setFormType('IN')" id="btnFormIn" class="flex-1 px-3 py-2 text-sm font-medium border border-gray-300 rounded-l-lg hover:bg-gray-50 focus:z-10 text-gray-600 transition-colors">
                                    입고
                                </button>
                                <button type="button" onclick="setFormType('OUT')" id="btnFormOut" class="flex-1 px-3 py-2 text-sm font-medium border border-gray-300 rounded-r-lg hover:bg-gray-50 focus:z-10 text-gray-600 transition-colors">
                                    출고
                                </button>
                            </div>
                            <input type="hidden" id="formType" name="type" required>
                        </div>
                        <div>
                            <label class="block text-xs font-semibold text-gray-600 mb-1">수량</label>
                            <input type="number" id="formQty" name="quantity" min="1" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-right font-mono" placeholder="0">
                        </div>
                    </div>

                    <div>
                        <label class="block text-xs font-semibold text-gray-600 mb-1">사유</label>
                        <input type="text" id="formReason" name="reason" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none placeholder-gray-300 text-sm" placeholder="예: 정기 구매, 파손 폐기 등">
                    </div>

                    <div class="pt-2">
                        <button type="submit" class="w-full py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition shadow-lg flex items-center justify-center gap-2">
                             <i class="fas fa-check"></i> 처리 완료
                        </button>
                    </div>
                </form>

            </div>
        </div>
    </div>

    <script type="module">
        let currentPage = 1;
        let limit = 20;

        function setRowsPerPageTx(n) {
            limit = n;
            const sel = document.getElementById('rowsPerPageTx');
            if (sel) sel.value = String(n);
            loadTransactions(1);
        }

        async function loadTransactions(page = 1) {
            currentPage = page;
            document.getElementById('paginationRangeTx').textContent = '';
            const search = document.getElementById('searchInput').value;
            const type = document.getElementById('typeFilter').value;
            const category = document.getElementById('categoryFilter').value;
            const tbody = document.getElementById('transactionTableBody');
            
            // 로딩 표시
            if(page === 1) tbody.innerHTML = '<tr><td colspan="7" class="px-6 py-10 text-center text-gray-400"><i class="fas fa-spinner fa-spin mr-2"></i>로딩중...</td></tr>';

            try {
                const queryParams = new URLSearchParams({
                    page: page,
                    limit: limit,
                    search: search,
                    type: type,
                    category: category
                });

                const res = await fetch(\`/api/hrd/items/transactions/all?\${queryParams}\`);
                const result = await res.json();

                if (!result.success) throw new Error(result.error);
                
                document.getElementById('totalCount').textContent = \`총 \${result.total}건\`;

                if (result.data.length === 0) {
                    tbody.innerHTML = '<tr><td colspan="7" class="px-6 py-10 text-center text-gray-400">조회된 이력이 없습니다.</td></tr>';
                    document.getElementById('paginationRangeTx').textContent = '';
                    document.getElementById('paginationContainer').innerHTML = '';
                    return;
                }
                const total = result.total;
                const pageNum = page;
                const start = total === 0 ? 0 : (pageNum - 1) * limit + 1;
                const end = Math.min(pageNum * limit, total);
                document.getElementById('paginationRangeTx').textContent = total > 0 ? start + '-' + end + ' / ' + total + '건' : '';

                tbody.innerHTML = result.data.map((item, index) => {
                    const idx = result.total - ((page - 1) * limit) - index;
                    const isIn = item.type === 'IN';
                    const typeBadge = isIn 
                        ? '<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"><i class="fas fa-arrow-down mr-1"></i>입고</span>'
                        : '<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"><i class="fas fa-arrow-up mr-1"></i>출고</span>';
                    
                    const qtyClass = isIn ? 'text-blue-600' : 'text-red-600';
                    const sign = isIn ? '+' : '-';

                    const categoryLabels = {
                        'textbook': { label: '교재', class: 'bg-yellow-100 text-yellow-800' },
                        'equipment': { label: '장비', class: 'bg-indigo-100 text-indigo-800' },
                        'consumable': { label: '소모품', class: 'bg-green-100 text-green-800' },
                        'furniture': { label: '비품', class: 'bg-purple-100 text-purple-800' },
                        'software': { label: 'S/W', class: 'bg-pink-100 text-pink-800' },
                        'etc': { label: '기타', class: 'bg-gray-100 text-gray-800' }
                    };
                    const catInfo = categoryLabels[item.category] || categoryLabels['etc'];

                    return \`
                        <tr class="hover:bg-gray-50 transition-colors border-b border-gray-50">
                            <td class="px-6 py-4 text-center text-gray-400 text-xs">\${idx}</td>
                            <td class="px-6 py-4 text-center">
                                <span class="px-2 py-1 text-xs font-semibold rounded-full \${catInfo.class}">\${catInfo.label}</span>
                            </td>
                            <td class="px-6 py-4 text-center">\${typeBadge}</td>
                            <td class="px-6 py-4">
                                <div class="flex items-center">
                                    <div class="h-8 w-8 rounded bg-gray-100 border border-gray-200 flex items-center justify-center overflow-hidden flex-shrink-0 mr-3">
                                        \${item.image_url ? \`<img src="\${item.image_url}" class="h-full w-full object-cover">\` : '<i class="fas fa-box text-gray-300 text-xs"></i>'}
                                    </div>
                                    <div>
                                        <div class="font-medium text-gray-900">\${item.item_name}</div>
                                        <div class="text-xs text-gray-500">\${item.item_model || '-'}</div>
                                    </div>
                                </div>
                            </td>
                            <td class="px-6 py-4 text-right font-mono font-bold \${qtyClass}">
                                \${sign}\${item.quantity}
                            </td>
                            <td class="px-6 py-4 text-right font-mono text-gray-600 text-xs">
                                \${item.prev_quantity} <i class="fas fa-arrow-right mx-1 text-gray-300"></i> \${item.new_quantity}
                            </td>
                            <td class="px-6 py-4 text-gray-600 truncate max-w-xs">\${item.reason || '-'}</td>
                            <td class="px-6 py-4 text-gray-400 text-xs">\${item.created_at.replace('T', ' ').substring(0, 16)}</td>
                        </tr>
                    \`;
                }).join('');

                renderPagination(result.total, page, limit);

            } catch (e) {
                console.error(e);
                tbody.innerHTML = '<tr><td colspan="7" class="px-6 py-10 text-center text-red-500"><i class="fas fa-exclamation-circle mr-2"></i>오류가 발생했습니다.</td></tr>';
            }
        }

        function renderPagination(total, page, limit) {
            const totalPages = Math.ceil(total / limit);
            const container = document.getElementById('paginationContainer');
            if(totalPages <= 1) { container.innerHTML = ''; return; }

            const radius = 2;
            const pages = [];
            for (let i = 1; i <= totalPages; i++) {
                if (i === 1 || i === totalPages || (i >= page - radius && i <= page + radius)) pages.push(i);
                else if (pages[pages.length - 1] !== '...') pages.push('...');
            }
            let html = '';
            html += \`<button type="button" onclick="loadTransactions(\${page - 1})" \${page <= 1 ? 'disabled' : ''} class="px-3 py-2 rounded-lg border border-gray-300 text-sm font-medium \${page <= 1 ? 'opacity-50 cursor-not-allowed bg-gray-50 text-gray-400' : 'bg-white text-gray-700 hover:bg-gray-50'}"><i class="fas fa-chevron-left mr-1"></i> 이전</button>\`;
            pages.forEach(function(n) {
                if (n === '...') html += '<span class="px-2 py-2 text-gray-400">…</span>';
                else {
                    const active = n === page;
                    html += \`<button type="button" onclick="loadTransactions(\${n})" class="min-w-[2.25rem] px-3 py-2 rounded-lg text-sm font-medium \${active ? 'bg-blue-600 text-white' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'}">\${n}</button>\`;
                }
            });
            html += \`<button type="button" onclick="loadTransactions(\${page + 1})" \${page >= totalPages ? 'disabled' : ''} class="px-3 py-2 rounded-lg border border-gray-300 text-sm font-medium \${page >= totalPages ? 'opacity-50 cursor-not-allowed bg-gray-50 text-gray-400' : 'bg-white text-gray-700 hover:bg-gray-50'}">다음 <i class="fas fa-chevron-right ml-1"></i></button>\`;
            container.innerHTML = html;
        }

        // --- Global Functions ---
        window.loadTransactions = loadTransactions;
        window.setRowsPerPageTx = setRowsPerPageTx;

        // Modal Logic
        window.openTransactionModal = () => {
            const modal = document.getElementById('transactionModal');
            modal.classList.remove('hidden');
            resetStep();
            document.getElementById('itemSearchInput').value = '';
            document.getElementById('itemSearchResults').innerHTML = '';
            document.getElementById('itemSearchResults').classList.add('hidden');
            setTimeout(() => document.getElementById('itemSearchInput').focus(), 100);
        };

        window.closeModal = (id) => {
             document.getElementById(id).classList.add('hidden');
        };

        // Step Control
        window.resetStep = () => {
             document.getElementById('stepSearch').classList.remove('hidden');
             document.getElementById('transactionForm').classList.add('hidden');
             document.getElementById('selectedItemId').value = '';
        };

        // Item Search Handler
        window.handleItemSearch = async (e) => {
            if (e.key !== 'Enter') return;
            const query = document.getElementById('itemSearchInput').value.trim();
            if (!query) return;

            const resultsDiv = document.getElementById('itemSearchResults');
            resultsDiv.classList.remove('hidden');
            resultsDiv.innerHTML = '<div class="p-4 text-center text-gray-400"><i class="fas fa-spinner fa-spin"></i> 검색중...</div>';

            try {
                // 기존 items 조회 API 재사용
                const res = await fetch(\`/api/hrd/items?search=\${encodeURIComponent(query)}&limit=10\`);
                const result = await res.json();
                
                if (result.success && result.data.length > 0) {
                     resultsDiv.innerHTML = result.data.map(item => \`
                        <div class="px-4 py-3 border-b border-gray-100 last:border-0 hover:bg-blue-50 cursor-pointer flex items-center gap-3 transition-colors" onclick="selectItem(\${item.id}, '\${item.name.replace(/'/g, "\\'")}', \${item.quantity}, '\${item.image_url || ''}')">
                            <div class="w-10 h-10 bg-gray-100 rounded border border-gray-200 flex items-center justify-center overflow-hidden">
                                \${item.image_url ? \`<img src="\${item.image_url}" class="w-full h-full object-cover">\` : '<i class="fas fa-box text-gray-300"></i>'}
                            </div>
                            <div class="flex-1">
                                <div class="font-medium text-gray-800 text-sm">\${item.name}</div>
                                <div class="text-xs text-gray-500">\${item.model || ''}</div>
                            </div>
                            <div class="text-xs font-bold text-blue-600">\${item.quantity}개</div>
                        </div>
                     \`).join('');
                } else {
                     resultsDiv.innerHTML = '<div class="p-4 text-center text-gray-500 text-sm">검색 결과가 없습니다.</div>';
                }
            } catch(e) {
                console.error(e);
                resultsDiv.innerHTML = '<div class="p-4 text-center text-red-500 text-sm">오류가 발생했습니다.</div>';
            }
        };

        window.selectItem = (id, name, qty, imgUrl) => {
            document.getElementById('selectedItemId').value = id;
            document.getElementById('selectedItemName').textContent = name;
            document.getElementById('selectedItemQty').textContent = qty;
            
            const imgContainer = document.getElementById('selectedItemImage');
            if (imgUrl && imgUrl !== 'null' && imgUrl !== 'undefined') {
                imgContainer.innerHTML = \`<img src="\${imgUrl}" class="w-full h-full object-cover">\`;
            } else {
                imgContainer.innerHTML = '<i class="fas fa-box text-gray-300"></i>';
            }

            // Switch view
            document.getElementById('stepSearch').classList.add('hidden');
            document.getElementById('transactionForm').classList.remove('hidden');
            
            // Default to IN
            window.setFormType('IN');
            document.getElementById('formQty').value = '';
            document.getElementById('formReason').value = '';
            document.getElementById('formQty').focus();
        };

        window.setFormType = (type) => {
            document.getElementById('formType').value = type;
            const btnIn = document.getElementById('btnFormIn');
            const btnOut = document.getElementById('btnFormOut');
            
            // Reset
            btnIn.className = 'flex-1 px-3 py-2 text-sm font-medium border border-gray-300 rounded-l-lg hover:bg-gray-50 focus:z-10 text-gray-600 transition-colors';
            btnOut.className = 'flex-1 px-3 py-2 text-sm font-medium border border-gray-300 rounded-r-lg hover:bg-gray-50 focus:z-10 text-gray-600 transition-colors';

            if(type === 'IN') {
                btnIn.className = 'flex-1 px-3 py-2 text-sm font-bold border border-blue-500 bg-blue-50 text-blue-700 rounded-l-lg z-10 shadow-inner';
            } else {
                btnOut.className = 'flex-1 px-3 py-2 text-sm font-bold border border-red-500 bg-red-50 text-red-700 rounded-r-lg z-10 shadow-inner';
            }
        };

        window.submitTransaction = async (e) => {
            e.preventDefault();
            const form = document.getElementById('transactionForm');
            const data = Object.fromEntries(new FormData(form).entries());
            const itemId = data.itemId;

            if(!itemId) return;
            if(!data.type) { alert('구분을 선택해주세요.'); return; }
            if(!data.quantity || data.quantity < 1) { alert('수량을 입력해주세요.'); return; }

            if(!confirm(\`\${data.type === 'IN' ? '입고' : '출고'} 처리하시겠습니까?\`)) return;

            try {
                const res = await fetch(\`/api/hrd/items/\${itemId}/transaction\`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
                const result = await res.json();
                
                if (result.success) {
                    alert('처리가 완료되었습니다.');
                    closeModal('transactionModal');
                    loadTransactions(1);
                } else {
                    alert('실패: ' + result.error);
                }
            } catch(e) {
                console.error(e);
                alert('처리 중 오류 발생');
            }
        };

        // Init
        document.getElementById('searchInput').addEventListener('keyup', (e) => {
             if(e.key === 'Enter') loadTransactions(1);
        });

        loadTransactions();
    </script>
</body>
</html>
`;
