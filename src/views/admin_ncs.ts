import { hrdSidebar } from './components/hrd_sidebar';

export const adminNcsHtml = `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>NCS 능력단위 관리 - 통합 교육행정 시스템</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Noto Sans KR', sans-serif; }
    </style>
</head>
<body class="bg-slate-50">
    <div class="flex min-h-screen">
        <!-- Sidebar -->
        ${hrdSidebar('ncs')}

        <!-- Main Content -->
        <main class="flex-1 overflow-x-hidden overflow-y-auto w-full">
            <header class="bg-white shadow-sm sticky top-0 z-10">
                <div class="px-8 py-4 flex justify-between items-center">
                    <h2 class="text-xl font-bold text-slate-800 flex items-center">
                        <i class="fas fa-tasks text-blue-600 mr-3"></i> NCS 능력단위 관리
                    </h2>
                    <div class="flex items-center space-x-4">
                        <button onclick="openNcsSearchModal()" class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition shadow-sm font-medium flex items-center">
                            <i class="fas fa-search mr-2"></i> NCS 검색
                        </button>
                        <button onclick="openModal()" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-sm font-medium flex items-center">
                            <i class="fas fa-plus mr-2"></i> 직접 등록
                        </button>
                    </div>
                </div>
            </header>

            <div class="p-8">
                <!-- 검색 및 필터 -->
                <div class="bg-white rounded-xl shadow-sm p-6 mb-6">
                    <div class="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
                        <div class="flex-1">
                            <label class="block text-sm font-medium text-gray-700 mb-1">검색 (코드/명칭)</label>
                            <input type="text" id="searchInput" placeholder="NCS 코드 또는 명칭 입력" 
                                onkeyup="if(event.key === 'Enter') loadNcsUnits()"
                                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                        </div>
                        <div class="w-full md:w-auto self-end">
                            <button onclick="loadNcsUnits()" class="w-full md:w-auto px-6 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition font-medium">
                                검색 적용
                            </button>
                        </div>
                    </div>
                </div>

                <!-- NCS 목록 -->
                <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div class="overflow-x-auto">
                        <table class="w-full text-left border-collapse">
                            <thead class="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th class="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">코드</th>
                                    <th class="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">능력단위명</th>
                                    <th class="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">분류</th>
                                    <th class="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">수준</th>
                                    <th class="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">관리</th>
                                </tr>
                            </thead>
                            <tbody id="ncsTableBody" class="divide-y divide-gray-100">
                                <tr>
                                    <td colspan="5" class="px-6 py-12 text-center text-gray-500">
                                        <i class="fas fa-spinner fa-spin text-2xl mb-2"></i><br>데이터를 불러오는 중...
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <!-- 페이지네이션 (추후 구현) -->
                    <div class="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end">
                        <span class="text-xs text-gray-500" id="totalCount">총 0건</span>
                    </div>
                </div>
            </div>
        </main>
    </div>

    <!-- 등록/수정 모달 -->
    <div id="ncsModal" class="fixed inset-0 bg-black bg-opacity-50 hidden z-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-xl shadow-2xl w-full max-w-lg transform transition-all scale-100">
            <div class="flex justify-between items-center p-6 border-b border-gray-100">
                <h3 class="text-xl font-bold text-gray-800" id="modalTitle">능력단위 등록</h3>
                <button onclick="closeModal()" class="text-gray-400 hover:text-gray-600 transition">
                    <i class="fas fa-times text-xl"></i>
                </button>
            </div>
            <div class="p-6 space-y-4">
                <input type="hidden" id="ncsId">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">NCS 코드 <span class="text-red-500">*</span></label>
                    <input type="text" id="ncsCode" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="예: 1503050101_19v3">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">능력단위 명칭 <span class="text-red-500">*</span></label>
                    <input type="text" id="ncsName" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="예: 3D형상모델링">
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">분류</label>
                        <input type="text" id="ncsCategory" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="예: 3D프린터개발">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">수준</label>
                        <select id="ncsLevel" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                            <option value="1">1수준</option>
                            <option value="2">2수준</option>
                            <option value="3">3수준</option>
                            <option value="4">4수준</option>
                            <option value="5">5수준</option>
                            <option value="6">6수준</option>
                            <option value="7">7수준</option>
                            <option value="8">8수준</option>
                        </select>
                    </div>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">설명</label>
                    <textarea id="ncsDescription" rows="3" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="능력단위 설명 등"></textarea>
                </div>
            </div>
            <div class="p-6 border-t border-gray-100 bg-gray-50 flex justify-end space-x-3 rounded-b-xl">
                <button onclick="closeModal()" class="px-5 py-2.5 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition">취소</button>
                <button onclick="saveNcsUnit()" class="px-5 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition shadow-sm">저장하기</button>
            </div>
        </div>
    </div>

    <script>
        document.addEventListener('DOMContentLoaded', () => {
            loadNcsUnits();
        });

        async function loadNcsUnits() {
            const search = document.getElementById('searchInput').value;
            const tbody = document.getElementById('ncsTableBody');
            
            try {
                let url = '/api/ncs?';
                if (search) url += 'search=' + encodeURIComponent(search);

                const response = await fetch(url);
                const result = await response.json();

                if (!result.success) throw new Error(result.error);
                
                const units = result.data;
                document.getElementById('totalCount').textContent = '총 ' + units.length + '건';

                if (units.length === 0) {
                    tbody.innerHTML = \`
                        <tr>
                            <td colspan="5" class="px-6 py-12 text-center text-gray-500">
                                <i class="far fa-folder-open text-3xl mb-3 text-gray-300"></i><br>
                                등록된 능력단위가 없습니다.
                            </td>
                        </tr>
                    \`;
                    return;
                }

                tbody.innerHTML = units.map(unit => \`
                    <tr class="hover:bg-gray-50 group transition-colors">
                        <td class="px-6 py-4 text-sm font-medium text-gray-900">\${unit.code}</td>
                        <td class="px-6 py-4">
                            <div class="text-sm font-bold text-gray-800">\${unit.name}</div>
                            <div class="text-xs text-gray-500 truncate max-w-xs">\${unit.description || '-'}</div>
                        </td>
                        <td class="px-6 py-4 text-sm text-gray-600">\${unit.category || '-'}</td>
                        <td class="px-6 py-4 text-sm text-center">
                            <span class="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-bold">\${unit.level}수준</span>
                        </td>
                        <td class="px-6 py-4 text-right space-x-2">
                            <button onclick='manageElements(\${unit.id}, "\${unit.name}")' class="text-blue-600 hover:bg-blue-50 px-2 py-1 rounded text-xs transition">
                                <i class="fas fa-list-ul mr-1"></i>수행준거
                            </button>
                            <button onclick='editUnit(\${JSON.stringify(unit).replace(/'/g, "&#39;")})' class="text-gray-400 hover:text-blue-600 transition p-1">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button onclick="deleteUnit(\${unit.id})" class="text-gray-400 hover:text-red-600 transition p-1">
                                <i class="fas fa-trash-alt"></i>
                            </button>
                        </td>
                    </tr>
                \`).join('');

            } catch (error) {
                console.error('Error:', error);
                tbody.innerHTML = '<tr><td colspan="5" class="px-6 py-4 text-center text-red-500">데이터 로드 실패</td></tr>';
            }
        }

        // --- Elements Management ---
        let currentUnitId = null;

        async function manageElements(unitId, unitName) {
            currentUnitId = unitId;
            document.getElementById('elementModalTitle').textContent = unitName + ' - 수행준거 관리';
            document.getElementById('elementModal').classList.remove('hidden');
            loadElements();
        }

        async function loadElements() {
            const tbody = document.getElementById('elementTableBody');
            tbody.innerHTML = '<tr><td colspan="3" class="p-4 text-center">불러오는 중...</td></tr>';
            
            try {
                const res = await fetch(\`/api/ncs/units/\${currentUnitId}/elements\`);
                const result = await res.json();
                if (result.success) {
                    if (result.data.length === 0) {
                        tbody.innerHTML = '<tr><td colspan="3" class="p-8 text-center text-gray-400">등록된 수행준거가 없습니다.</td></tr>';
                    } else {
                        tbody.innerHTML = result.data.map(el => \`
                            <tr class="border-b border-gray-50">
                                <td class="p-3 text-sm font-bold text-blue-600 text-center">\${el.code}</td>
                                <td class="p-3 text-sm">
                                    <div class="font-bold">\${el.name}</div>
                                    <div class="text-xs text-gray-500 mt-0.5">\${el.criteria || ''}</div>
                                </td>
                                <td class="p-3 text-right">
                                    <button class="text-red-400 hover:text-red-600"><i class="fas fa-times"></i></button>
                                </td>
                            </tr>
                        \`).join('');
                    }
                }
            } catch (e) { console.error(e); }
        }

        async function addElement() {
            const code = document.getElementById('elCode').value;
            const name = document.getElementById('elName').value;
            const criteria = document.getElementById('elCriteria').value;

            if (!code || !name) return alert('번호와 명칭을 입력하세요.');

            try {
                const res = await fetch('/api/ncs/elements', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ncs_unit_id: currentUnitId, code, name, criteria })
                });
                if ((await res.json()).success) {
                    document.getElementById('elCode').value = '';
                    document.getElementById('elName').value = '';
                    document.getElementById('elCriteria').value = '';
                    loadElements();
                }
            } catch (e) { console.error(e); }
        }

        function closeElementModal() {
            document.getElementById('elementModal').classList.add('hidden');
        }

        function openModal() {
            document.getElementById('ncsId').value = '';
            document.getElementById('ncsCode').value = '';
            document.getElementById('ncsName').value = '';
            document.getElementById('ncsCategory').value = '';
            document.getElementById('ncsLevel').value = '3';
            document.getElementById('ncsDescription').value = '';
            
            document.getElementById('modalTitle').textContent = '능력단위 등록';
            document.getElementById('ncsModal').classList.remove('hidden');
        }

        function editUnit(unit) {
            document.getElementById('ncsId').value = unit.id;
            document.getElementById('ncsCode').value = unit.code;
            document.getElementById('ncsName').value = unit.name;
            document.getElementById('ncsCategory').value = unit.category;
            document.getElementById('ncsLevel').value = unit.level;
            document.getElementById('ncsDescription').value = unit.description || '';
            
            document.getElementById('modalTitle').textContent = '능력단위 수정';
            document.getElementById('ncsModal').classList.remove('hidden');
        }

        function closeModal() {
            document.getElementById('ncsModal').classList.add('hidden');
        }

        async function saveNcsUnit() {
            const id = document.getElementById('ncsId').value;
            const data = {
                code: document.getElementById('ncsCode').value,
                name: document.getElementById('ncsName').value,
                category: document.getElementById('ncsCategory').value,
                level: parseInt(document.getElementById('ncsLevel').value),
                description: document.getElementById('ncsDescription').value
            };

            if (!data.code || !data.name) {
                alert('코드와 명칭은 필수입니다.');
                return;
            }

            try {
                const url = id ? '/api/ncs/' + id : '/api/ncs';
                const method = id ? 'PUT' : 'POST';

                const response = await fetch(url, {
                    method: method,
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });

                const result = await response.json();
                if (result.success) {
                    closeModal();
                    loadNcsUnits();
                } else {
                    alert('저장 실패: ' + result.error);
                }
            } catch (error) {
                console.error(error);
                alert('오류가 발생했습니다.');
            }
        }

        async function deleteUnit(id) {
            if (!confirm('정말 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) return;

            try {
                const response = await fetch('/api/ncs/' + id, { method: 'DELETE' });
                const result = await response.json();
                
                if (result.success) {
                    loadNcsUnits();
                } else {
                    alert('삭제 실패: ' + result.error);
                }
            } catch (error) {
                console.error(error);
                alert('삭제 중 오류가 발생했습니다.');
            }
        }
        
        // NCS API 검색 기능
        function openNcsSearchModal() {
            document.getElementById('ncsSearchModal').classList.remove('hidden');
            document.getElementById('ncsApiSearch').value = '';
            document.getElementById('ncsSearchResults').innerHTML = \`
                <div class="text-center text-gray-400 py-12">
                    <i class="fas fa-search text-4xl mb-3"></i><br>
                    검색어를 입력하고 검색 버튼을 클릭하세요.
                </div>
            \`;
        }

        function closeNcsSearchModal() {
            document.getElementById('ncsSearchModal').classList.add('hidden');
        }

        async function searchNcsApi() {
            const searchKeyword = document.getElementById('ncsApiSearch').value.trim();
            if (!searchKeyword) {
                alert('검색어를 입력하세요.');
                return;
            }

            const resultsDiv = document.getElementById('ncsSearchResults');
            resultsDiv.innerHTML = \`
                <div class="text-center py-12">
                    <i class="fas fa-spinner fa-spin text-3xl text-green-600 mb-3"></i><br>
                    <span class="text-gray-600">NCS 능력단위를 검색하는 중...</span>
                </div>
            \`;

            try {
                // 백엔드 API를 통해 공공데이터 NCS API 호출
                const response = await fetch('/api/ncs/search?keyword=' + encodeURIComponent(searchKeyword));
                const result = await response.json();

                if (!result.success || !result.data || result.data.length === 0) {
                    resultsDiv.innerHTML = \`
                        <div class="text-center text-gray-400 py-12">
                            <i class="fas fa-exclamation-circle text-4xl mb-3"></i><br>
                            검색 결과가 없습니다.
                        </div>
                    \`;
                    return;
                }

                resultsDiv.innerHTML = result.data.map(item => \`
                    <div class="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition cursor-pointer"
                         onclick='selectNcsFromApi(\${JSON.stringify(item).replace(/'/g, "&#39;")})'>
                        <div class="flex justify-between items-start">
                            <div class="flex-1">
                                <div class="flex items-center gap-2 mb-1">
                                    <span class="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-bold">\${item.code}</span>
                                    <span class="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">\${item.level}수준</span>
                                </div>
                                <h4 class="font-bold text-gray-800 mb-1">\${item.name}</h4>
                                <p class="text-sm text-gray-500 mb-2">\${item.category || '-'}</p>
                                <p class="text-xs text-gray-400 line-clamp-2">\${item.description || '설명 없음'}</p>
                            </div>
                            <button class="ml-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm font-medium">
                                <i class="fas fa-plus mr-1"></i>등록
                            </button>
                        </div>
                    </div>
                \`).join('');

            } catch (err) {
                console.error('NCS API search error:', err);
                resultsDiv.innerHTML = \`
                    <div class="text-center text-red-500 py-12">
                        <i class="fas fa-times-circle text-4xl mb-3"></i><br>
                        검색 중 오류가 발생했습니다.
                    </div>
                \`;
            }
        }

        async function selectNcsFromApi(item) {
            // 선택한 NCS 능력단위를 DB에 저장
            try {
                const response = await fetch('/api/ncs', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        code: item.code,
                        name: item.name,
                        category: item.category,
                        level: item.level,
                        description: item.description
                    })
                });

                const result = await response.json();
                if (result.success) {
                    alert('능력단위가 추가되었습니다.');
                    closeNcsSearchModal();
                    loadNcsUnits();
                } else {
                    alert('추가 실패: ' + result.error);
                }
            } catch (err) {
                console.error('Save error:', err);
                alert('저장 중 오류가 발생했습니다.');
            }
        }
        
        // Modal Outside Click Close
        document.getElementById('ncsModal').addEventListener('click', (e) => {
            if (e.target === document.getElementById('ncsModal')) closeModal();
        });
        document.getElementById('ncsSearchModal')?.addEventListener('click', (e) => {
            if (e.target === document.getElementById('ncsSearchModal')) closeNcsSearchModal();
        });
    </script>

    <!-- 수행준거 관리 모달 -->
    <div id="elementModal" class="fixed inset-0 bg-black/60 hidden z-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-xl shadow-2xl w-full max-w-2xl transform transition-all overflow-hidden flex flex-col max-h-[90vh]">
            <div class="flex justify-between items-center p-5 border-b bg-slate-50">
                <h3 class="font-bold text-slate-800" id="elementModalTitle">수행준거 관리</h3>
                <button onclick="closeElementModal()" class="text-gray-400 hover:text-gray-600"><i class="fas fa-times text-xl"></i></button>
            </div>
            
            <div class="p-6 overflow-y-auto flex-1">
                <!-- 등록 폼 -->
                <div class="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100 flex gap-2">
                    <input type="text" id="elCode" placeholder="번호 (01)" class="w-20 px-3 py-2 border rounded-lg text-sm">
                    <input type="text" id="elName" placeholder="준거 명칭" class="flex-1 px-3 py-2 border rounded-lg text-sm">
                    <input type="text" id="elCriteria" placeholder="상세 기준" class="flex-1 px-3 py-2 border rounded-lg text-sm">
                    <button onclick="addElement()" class="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold">추가</button>
                </div>

                <table class="w-full text-left">
                    <thead class="bg-gray-50 border-b">
                        <tr>
                            <th class="p-3 text-xs text-gray-500 w-16 text-center">번호</th>
                            <th class="p-3 text-xs text-gray-500">수행준거 명칭 및 세부기준</th>
                            <th class="p-3 text-xs text-gray-500 w-16"></th>
                        </tr>
                    </thead>
                    <tbody id="elementTableBody">
                        <!-- JS Load -->
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <!-- NCS API 검색 모달 -->
    <div id="ncsSearchModal" class="fixed inset-0 bg-black bg-opacity-50 hidden z-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-xl shadow-2xl w-full max-w-4xl transform transition-all scale-100 flex flex-col max-h-[90vh]">
            <div class="flex justify-between items-center p-6 border-b border-gray-100">
                <h3 class="text-xl font-bold text-gray-800">NCS 능력단위 검색</h3>
                <button onclick="closeNcsSearchModal()" class="text-gray-400 hover:text-gray-600 transition">
                    <i class="fas fa-times text-xl"></i>
                </button>
            </div>
            
            <div class="p-6 border-b border-gray-100">
                <div class="flex gap-3">
                    <input type="text" id="ncsApiSearch" placeholder="능력단위명 또는 키워드 입력" 
                        onkeyup="if(event.key === 'Enter') searchNcsApi()"
                        class="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500">
                    <button onclick="searchNcsApi()" class="px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium">
                        <i class="fas fa-search mr-2"></i>검색
                    </button>
                </div>
                <p class="text-xs text-gray-500 mt-2">
                    <i class="fas fa-info-circle mr-1"></i>
                    한국산업인력공단 NCS 능력단위 정보를 검색할 수 있습니다.
                </p>
            </div>
            
            <div class="flex-1 overflow-y-auto p-6">
                <div id="ncsSearchResults" class="space-y-3">
                    <div class="text-center text-gray-400 py-12">
                        <i class="fas fa-search text-4xl mb-3"></i><br>
                        검색어를 입력하고 검색 버튼을 클릭하세요.
                    </div>
                </div>
            </div>
        </div>
    </div>

</body>
</html>
`;
