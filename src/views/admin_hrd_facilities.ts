import { hrdSidebar } from './components/hrd_sidebar';

export const adminHrdFacilitiesHtml = () => `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>훈련시설 관리 - HRD 행정시스템</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        primary: {
                            50: '#f0f7ff',
                            100: '#e0effe',
                            200: '#baddfd',
                            300: '#7dbcfb',
                            400: '#3a9bf7',
                            500: '#5b9bd5',
                            600: '#4a90e2',
                            700: '#2d5fa3',
                            800: '#1e4278',
                            900: '#132d54'
                        }
                    }
                }
            }
        }
    </script>
    <style>
        .form-label {
            @apply block text-sm font-bold text-gray-700 mb-1;
        }
        .form-input {
            @apply w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm transition-colors;
        }
        .section-header {
            @apply text-sm font-bold text-gray-800 mb-3 flex items-center justify-between border-b pb-2;
        }
        /* 스크롤바 커스텀 */
        ::-webkit-scrollbar {
            width: 6px;
            height: 6px;
        }
        ::-webkit-scrollbar-track {
            background: #f1f1f1; 
        }
        ::-webkit-scrollbar-thumb {
            background: #cbd5e1; 
            border-radius: 3px;
        }
        ::-webkit-scrollbar-thumb:hover {
            background: #94a3b8; 
        }
    </style>
</head>
<body class="bg-gray-100 font-sans h-screen flex overflow-hidden">
    <!-- 사이드바 -->
    ${hrdSidebar('facilities')}

    <!-- 메인 콘텐츠 -->
    <div class="flex-1 flex flex-col min-w-0">
        <!-- 헤더 -->
        <header class="bg-white border-b border-gray-200 h-14 flex items-center justify-between px-6 shadow-sm z-10 flex-shrink-0">
            <div class="flex items-center gap-4">
                <h2 class="text-lg font-bold text-gray-800">훈련시설 관리</h2>
                <div class="flex items-center gap-2">
                    <input type="text" placeholder="시설명 검색" class="border border-gray-300 rounded px-3 py-1 text-sm w-48 focus:outline-none focus:border-blue-500">
                    <button class="bg-teal-500 text-white px-3 py-1 rounded text-sm hover:bg-teal-600 font-medium">검색</button>
                    <div class="flex items-center gap-3 ml-4 text-sm text-gray-600">
                        <label class="flex items-center gap-1"><input type="radio" name="filter_status" value="all" checked> 전체</label>
                        <label class="flex items-center gap-1"><input type="radio" name="filter_status" value="check"> 점검</label>
                        <label class="flex items-center gap-1"><input type="radio" name="filter_status" value="repair"> 수리</label>
                    </div>
                </div>
            </div>
        </header>

        <!-- 알림 바 -->
        <div class="bg-blue-50 px-6 py-2 text-xs text-blue-700 border-b border-blue-100 flex-shrink-0">
            <p>1. 훈련시설 내용 등록시 NCS기준에 따라 사용 하실 수 있습니다.</p>
            <p>2. 훈련시설별 등록시 비품/장비기능과 연계하여 사용 하실 수 있습니다.</p>
        </div>

        <!-- 메인 영역 (2단 레이아웃) -->
        <main class="flex-1 flex p-4 gap-4 overflow-hidden">
            
            <!-- 좌측 패널 (목록 및 관리대장) -->
            <div class="w-5/12 flex flex-col gap-4 min-w-[400px]">
                
                <!-- 훈련시설 목록 -->
                <div class="bg-white rounded border border-gray-200 shadow-sm flex flex-col flex-1 overflow-hidden">
                    <div class="p-3 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                        <h3 class="font-bold text-gray-700 text-sm">훈련시설 목록</h3>
                        <button onclick="initCreateFacility()" class="bg-blue-600 text-white px-2 py-1 rounded text-xs hover:bg-blue-700 font-bold">
                            <i class="fas fa-plus mr-1"></i> 신규 등록
                        </button>
                    </div>
                    <div class="flex-1 overflow-y-auto">
                        <table class="w-full text-sm text-left">
                            <thead class="bg-gray-50 text-gray-600 font-medium sticky top-0 z-10 border-b border-gray-200">
                                <tr>
                                    <th class="px-4 py-2 w-10 text-center"><input type="checkbox"></th>
                                    <th class="px-4 py-2">시설명</th>
                                    <th class="px-4 py-2 w-24 text-center">최종상태</th>
                                    <th class="px-4 py-2 w-28 text-center">최종점검일</th>
                                </tr>
                            </thead>
                            <tbody id="facilityListBody" class="divide-y divide-gray-100">
                                <!-- 데이터 로드 -->
                            </tbody>
                        </table>
                    </div>
                    <div class="p-3 border-t border-gray-200 bg-gray-50">
                        <div class="flex gap-2 mb-2">
                            <input type="date" class="border border-gray-300 rounded px-2 py-1 text-sm w-32">
                            <input type="text" placeholder="비고" class="border border-gray-300 rounded px-2 py-1 text-sm flex-1">
                        </div>
                        <button class="w-full bg-teal-500 text-white py-2 rounded text-sm font-bold hover:bg-teal-600 transition-colors">
                            선택대상 점검 일괄등록
                        </button>
                    </div>
                </div>

                <!-- 시설관리 대장 -->
                <div class="bg-white rounded border border-gray-200 shadow-sm flex flex-col h-1/2 min-h-[300px]">
                    <div class="p-3 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                        <h3 class="font-bold text-gray-700 text-sm">시설관리 대장</h3>
                        <button class="bg-blue-600 text-white px-2 py-1 rounded text-xs hover:bg-blue-700">시설관리대장 세부 등록하기</button>
                    </div>
                    
                    <div class="flex-1 overflow-y-auto p-3 border-b border-gray-200 bg-gray-50/50">
                        <div id="maintenanceHistoryList" class="text-gray-500 text-sm text-center py-4">
                            시설을 먼저 등록해주세요.
                        </div>
                    </div>

                    <div class="p-4 bg-white">
                        <div class="grid grid-cols-1 gap-3 text-sm">
                            <div class="flex items-center gap-4">
                                <label class="font-bold w-16 text-right">상태 <span class="text-red-500">*</span></label>
                                <div class="flex gap-4">
                                    <label class="flex items-center gap-1 cursor-pointer"><input type="radio" name="m_status" value="check" checked> 점검</label>
                                    <label class="flex items-center gap-1 cursor-pointer"><input type="radio" name="m_status" value="repair"> 수리</label>
                                </div>
                            </div>
                            <div class="flex items-center gap-4">
                                <label class="font-bold w-16 text-right">관리명 <span class="text-red-500">*</span></label>
                                <input type="text" id="m_title" class="form-input bg-yellow-50" placeholder="관리명 입력">
                            </div>
                            <div class="flex items-center gap-4">
                                <label class="font-bold w-16 text-right">가격</label>
                                <input type="number" id="m_price" class="form-input" value="0">
                            </div>
                            <div class="flex items-center gap-4">
                                <label class="font-bold w-16 text-right">거래처</label>
                                <div class="flex flex-1 gap-2">
                                    <input type="text" id="m_vendor" class="form-input" placeholder="거래처명">
                                    <button class="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-xs whitespace-nowrap">거래처 검색</button>
                                </div>
                            </div>
                            <div class="flex items-center gap-4">
                                <label class="font-bold w-16 text-right">등록자</label>
                                <span class="text-gray-700">관리자</span>
                            </div>
                            <div class="flex items-start gap-4">
                                <label class="font-bold w-16 text-right mt-1">비고</label>
                                <textarea id="m_memo" rows="2" class="form-input resize-none"></textarea>
                            </div>
                        </div>
                        <div class="mt-3 flex justify-end">
                            <button id="m_save_btn" onclick="saveMaintenanceLog()" class="bg-teal-500 text-white px-4 py-1.5 rounded text-sm font-bold hover:bg-teal-600">등록</button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 우측 패널 (상세 정보) -->
            <div class="w-7/12 flex flex-col gap-4 bg-white rounded border border-gray-200 shadow-sm overflow-hidden">
                <div class="p-3 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                    <h3 class="font-bold text-gray-700 text-sm">훈련시설 상세정보</h3>
                    <span class="text-xs text-red-500 font-bold"><i class="fas fa-exclamation-circle mr-1"></i> 필수항목</span>
                </div>

                <div class="flex-1 overflow-y-auto p-6">
                    <form id="facilityForm" class="space-y-6">
                        <!-- 기본 정보 -->
                        <div class="grid grid-cols-1 gap-4 text-sm">
                            <div class="flex items-center">
                                <label class="w-24 font-bold text-gray-700 text-right mr-4">시설명 <span class="text-red-500">*</span></label>
                                <input type="text" id="facName" class="form-input flex-1" placeholder="예: 제1강의실">
                            </div>
                            <div class="flex items-center">
                                <label class="w-24 font-bold text-gray-700 text-right mr-4">면적 <span class="text-red-500">*</span></label>
                                <div class="flex items-center flex-1">
                                    <input type="text" id="facArea" class="form-input w-32 mr-2" placeholder="40.1">
                                    <span class="text-gray-600">m²</span>
                                </div>
                            </div>
                            <div class="flex items-center">
                                <label class="w-24 font-bold text-gray-700 text-right mr-4">관리자</label>
                                <div class="flex items-center gap-4 flex-1">
                                    <div class="flex items-center gap-2 flex-1 bg-yellow-50 p-1 rounded border border-yellow-100">
                                        <span class="text-xs font-bold text-gray-500 px-2">정-검색</span>
                                        <input type="text" id="facManagerMain" class="bg-transparent outline-none text-sm w-full" placeholder="이름">
                                    </div>
                                    <div class="flex items-center gap-2 flex-1 bg-yellow-50 p-1 rounded border border-yellow-100">
                                        <span class="text-xs font-bold text-gray-500 px-2">부-검색</span>
                                        <input type="text" id="facManagerSub" class="bg-transparent outline-none text-sm w-full" placeholder="이름">
                                    </div>
                                </div>
                            </div>
                            <div class="flex items-center">
                                <label class="w-24 font-bold text-gray-700 text-right mr-4">비품/장비 목록</label>
                                <div class="flex-1 flex items-center gap-2">
                                    <button type="button" onclick="viewFacilityItems()" class="bg-teal-500 text-white px-3 py-1 rounded text-xs hover:bg-teal-600">비품/장비 목록 보기</button>
                                    <span class="text-xs text-red-400">* 해당 시설과 연계된 능력단위 비품/장비의 목록을 확인하실 수 있습니다.</span>
                                </div>
                            </div>
                        </div>

                        <!-- 에디터 영역 (Textarea로 대체) -->
                        <div class="border border-gray-300 rounded mt-4">
                            <div class="bg-gray-50 border-b border-gray-300 p-2 flex gap-2">
                                <button type="button" class="p-1 hover:bg-gray-200 rounded"><i class="fas fa-bold text-gray-600"></i></button>
                                <button type="button" class="p-1 hover:bg-gray-200 rounded"><i class="fas fa-italic text-gray-600"></i></button>
                                <button type="button" class="p-1 hover:bg-gray-200 rounded"><i class="fas fa-underline text-gray-600"></i></button>
                                <div class="w-px h-6 bg-gray-300 mx-1"></div>
                                <button type="button" class="p-1 hover:bg-gray-200 rounded"><i class="fas fa-align-left text-gray-600"></i></button>
                                <button type="button" class="p-1 hover:bg-gray-200 rounded"><i class="fas fa-align-center text-gray-600"></i></button>
                                <button type="button" class="p-1 hover:bg-gray-200 rounded"><i class="fas fa-align-right text-gray-600"></i></button>
                                <div class="w-px h-6 bg-gray-300 mx-1"></div>
                                <button type="button" class="p-1 hover:bg-gray-200 rounded"><i class="fas fa-image text-gray-600"></i></button>
                            </div>
                            <div class="relative">
                                <img src="https://placehold.co/800x300/e2e8f0/64748b?text=Facility+Preview" class="w-full h-48 object-cover border-b border-gray-100" alt="Preview">
                                <textarea id="facDescription" class="w-full p-4 h-32 outline-none resize-none text-sm" placeholder="시설에 대한 상세 설명을 입력하세요..."></textarea>
                            </div>
                        </div>

                        <!-- 첨부된 이미지 -->
                        <div>
                            <div class="flex justify-between items-end mb-2">
                                <label class="font-bold text-gray-700 text-sm">첨부된 이미지</label>
                                <span class="text-xs text-gray-400">이미지는 최대 5장까지 등록 가능합니다.</span>
                            </div>
                            <div id="imageList" class="border border-gray-300 rounded h-32 p-2 overflow-y-auto bg-gray-50">
                                <!-- 이미지 목록 로드 -->
                            </div>
                            <div class="flex justify-end gap-2 mt-2">
                                <label class="bg-teal-500 text-white px-3 py-1.5 rounded text-xs font-bold hover:bg-teal-600 cursor-pointer">
                                    <i class="fas fa-upload mr-1"></i> 이미지 추가
                                    <input type="file" class="hidden" accept="image/*" onchange="addFacilityImage(this)">
                                </label>
                            </div>
                        </div>
                    </form>
                </div>

                <!-- 하단 액션 버튼 -->
                <div class="p-4 border-t border-gray-200 bg-gray-50 flex justify-between items-center">
                    <button onclick="saveFacility()" class="bg-blue-600 text-white px-4 py-2 rounded text-sm font-bold hover:bg-blue-700">
                        <i class="fas fa-save mr-1"></i> <span id="saveBtnText">훈련시설 세부 등록하기</span>
                    </button>
                    <div class="flex gap-2" id="editButtons" style="display: none;">
                        <button onclick="deleteFacility()" class="bg-red-500 text-white px-4 py-2 rounded text-sm font-bold hover:bg-red-600">삭제</button>
                    </div>
                </div>
            </div>

        </main>
    </div>

    <!-- 비품/장비 목록 모달 -->
    <div id="facilityItemsModal" class="hidden fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
        <div class="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4">
            <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                <h3 class="text-lg font-bold text-gray-800">시설 내 비품/장비 목록</h3>
                <button onclick="closeModal('facilityItemsModal')" class="text-gray-400 hover:text-gray-600">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="p-6 max-h-[60vh] overflow-y-auto">
                <table class="w-full text-sm text-left">
                    <thead class="bg-gray-50 text-gray-600 border-b">
                        <tr>
                            <th class="px-4 py-2">구분</th>
                            <th class="px-4 py-2">물품명</th>
                            <th class="px-4 py-2">규격</th>
                            <th class="px-4 py-2">수량</th>
                            <th class="px-4 py-2">상태</th>
                        </tr>
                    </thead>
                    <tbody id="facilityItemsList" class="divide-y divide-gray-100">
                        <!-- Items rendered here -->
                    </tbody>
                </table>
            </div>
            <div class="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end">
                <button onclick="closeModal('facilityItemsModal')" class="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 font-bold">확인</button>
            </div>
        </div>
    </div>

    <script>
        let facilitiesList = [];
        let currentFacilityId = null;

        document.addEventListener('DOMContentLoaded', () => {
            loadFacilities();
        });

        async function loadFacilities() {
            try {
                const response = await fetch('/api/hrd/facilities');
                const result = await response.json();
                if (result.success) {
                    facilitiesList = result.data;
                    renderFacilityList();
                }
            } catch (e) {
                console.error('Failed to load facilities:', e);
            }
        }

        function renderFacilityList() {
            const tbody = document.getElementById('facilityListBody');
            if (facilitiesList.length === 0) {
                tbody.innerHTML = '<tr><td colspan="4" class="px-4 py-8 text-center text-gray-400">등록된 시설이 없습니다.</td></tr>';
                return;
            }

            tbody.innerHTML = facilitiesList.map(f => 
                '<tr onclick="viewFacilityDetail(' + f.id + ')" class="hover:bg-blue-50 cursor-pointer transition-colors ' + (currentFacilityId === f.id ? 'bg-blue-50' : '') + '">' +
                    '<td class="px-4 py-2 text-center" onclick="event.stopPropagation()"><input type="checkbox" value="' + f.id + '"></td>' +
                    '<td class="px-4 py-2 font-medium text-gray-700">' + f.name + '</td>' +
                    '<td class="px-4 py-2 text-center">' +
                        '<span class="px-2 py-0.5 rounded-full text-xs font-bold ' + (f.status === '양호' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700') + '">' +
                            f.status +
                        '</span>' +
                    '</td>' +
                    '<td class="px-4 py-2 text-center text-gray-500 text-xs">' + (f.last_check ? f.last_check.split(' ')[0] : '-') + '</td>' +
                '</tr>'
            ).join('');
        }

        async function viewFacilityDetail(id) {
            currentFacilityId = id;
            renderFacilityList();
            
            const facility = facilitiesList.find(f => f.id === id);
            if (!facility) return;

            document.getElementById('facName').value = facility.name;
            document.getElementById('facArea').value = facility.area || '';
            document.getElementById('facManagerMain').value = facility.manager_main || '';
            document.getElementById('facManagerSub').value = facility.manager_sub || '';
            document.getElementById('facDescription').value = facility.description || '';
            
            document.getElementById('saveBtnText').textContent = '훈련시설 정보 수정하기';
            document.getElementById('editButtons').style.display = 'flex';

            loadMaintenanceLogs(id);
            loadFacilityImages(id);
        }

        function initCreateFacility() {
            currentFacilityId = null;
            renderFacilityList();
            document.getElementById('facilityForm').reset();
            document.getElementById('saveBtnText').textContent = '훈련시설 세부 등록하기';
            document.getElementById('editButtons').style.display = 'none';
            document.getElementById('maintenanceHistoryList').innerHTML = '<div class="text-gray-500 text-sm text-center py-4">시설을 먼저 등록해주세요.</div>';
            document.getElementById('imageList').innerHTML = '';
        }

        async function saveFacility() {
            const data = {
                id: currentFacilityId,
                name: document.getElementById('facName').value,
                area: document.getElementById('facArea').value,
                managerMain: document.getElementById('facManagerMain').value,
                managerSub: document.getElementById('facManagerSub').value,
                description: document.getElementById('facDescription').value
            };

            if (!data.name) { alert('시설명을 입력하세요.'); return; }

            try {
                const response = await fetch('/api/hrd/facilities', {
                    method: currentFacilityId ? 'PUT' : 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
                const result = await response.json();
                if (result.success) {
                    alert('저장되었습니다.');
                    loadFacilities();
                    if (!currentFacilityId && result.data?.id) {
                        viewFacilityDetail(result.data.id);
                    }
                }
            } catch (e) {
                console.error(e);
                alert('저장 중 오류가 발생했습니다.');
            }
        }

        async function deleteFacility() {
            if (!currentFacilityId) return;
            if (!confirm('정말 삭제하시겠습니까?')) return;

            try {
                const response = await fetch('/api/hrd/facilities/' + currentFacilityId, { method: 'DELETE' });
                const result = await response.json();
                if (result.success) {
                    alert('삭제되었습니다.');
                    initCreateFacility();
                    loadFacilities();
                }
            } catch (e) {
                console.error(e);
            }
        }

        async function loadMaintenanceLogs(id) {
            try {
                const response = await fetch('/api/hrd/facilities/' + id + '/maintenance');
                const result = await response.json();
                const list = document.getElementById('maintenanceHistoryList');

                if (result.success) {
                    const logs = result.data;
                    if (logs.length === 0) {
                        list.innerHTML = '<div class="text-gray-400 text-xs text-center py-4">등록된 관리 이력이 없습니다.</div>';
                        return;
                    }

                    list.innerHTML = logs.map(log => 
                        '<div class="bg-white border border-gray-100 rounded p-2 mb-2 shadow-sm text-xs">' +
                            '<div class="flex justify-between items-center mb-1">' +
                                '<span class="font-bold text-gray-700">' + (log.date ? log.date.split(' ')[0] : '-') + '</span>' +
                                '<span class="px-1.5 py-0.5 rounded text-[10px] ' + (log.status === 'repair' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700') + '">' +
                                    (log.status === 'repair' ? '수리' : '점검') +
                                '</span>' +
                            '</div>' +
                            '<div class="text-gray-800 font-medium mb-1">' + log.title + '</div>' +
                            (log.price ? '<div class="text-teal-600 font-bold">비용: ' + log.price.toLocaleString() + '원</div>' : '') +
                            (log.memo ? '<div class="text-gray-500 mt-1 italic">' + log.memo + '</div>' : '') +
                        '</div>'
                    ).join('');
                }
            } catch (e) {
                console.error(e);
            }
        }

        async function saveMaintenanceLog() {
            if (!currentFacilityId) { alert('먼저 시설을 선택하거나 등록하세요.'); return; }
            
            const status = document.querySelector('input[name="m_status"]:checked').value;
            const title = document.getElementById('m_title').value;
            const price = document.getElementById('m_price').value;
            const vendor = document.getElementById('m_vendor').value;
            const memo = document.getElementById('m_memo').value;

            if (!title) { alert('관리명을 입력하세요.'); return; }

            try {
                const response = await fetch('/api/hrd/facilities/' + currentFacilityId + '/maintenance', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ status, title, price, vendor, memo, date: new Date().toISOString() })
                });
                const result = await response.json();
                if (result.success) {
                    document.getElementById('m_title').value = '';
                    document.getElementById('m_price').value = '0';
                    document.getElementById('m_vendor').value = '';
                    document.getElementById('m_memo').value = '';
                    loadMaintenanceLogs(currentFacilityId);
                    loadFacilities(); // 최종점검일 업데이트를 위해 재로드
                }
            } catch (e) {
                console.error(e);
            }
        }

        async function loadFacilityImages(id) {
            try {
                const response = await fetch('/api/hrd/facilities/' + id + '/images');
                const result = await response.json();
                const list = document.getElementById('imageList');

                if (result.success) {
                    const images = result.data;
                    if (images.length === 0) {
                        list.innerHTML = '<div class="h-full flex items-center justify-center text-gray-400 text-xs italic">등록된 이미지가 없습니다.</div>';
                        return;
                    }

                    list.innerHTML = '<div class="grid grid-cols-2 gap-2">' +
                        images.map(img => 
                            '<div class="relative group border rounded overflow-hidden bg-white">' +
                                '<img src="' + img.url + '" class="w-full h-20 object-cover">' +
                                '<div class="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">' +
                                    '<button onclick="deleteFacilityImage(' + img.id + ')" class="text-white hover:text-red-400"><i class="fas fa-trash"></i></button>' +
                                '</div>' +
                                '<div class="absolute bottom-0 left-0 right-0 bg-white bg-opacity-90 px-1 py-0.5 text-[10px] truncate text-gray-600">' +
                                    img.name +
                                '</div>' +
                            '</div>'
                        ).join('') +
                    '</div>';
                }
            } catch (e) {
                console.error(e);
            }
        }

        async function addFacilityImage(input) {
            if (!currentFacilityId) { alert('시설을 먼저 등록하세요.'); input.value = ''; return; }
            if (input.files && input.files[0]) {
                const file = input.files[0];
                const reader = new FileReader();
                reader.onload = async (e) => {
                    const data = {
                        name: file.name,
                        size: (file.size / 1024).toFixed(1) + 'KB',
                        url: e.target.result
                    };

                    try {
                        const response = await fetch('/api/hrd/facilities/' + currentFacilityId + '/images', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(data)
                        });
                        if ((await response.json()).success) {
                            loadFacilityImages(currentFacilityId);
                        }
                    } catch (err) {
                        console.error(err);
                    }
                };
                reader.readAsDataURL(file);
                input.value = '';
            }
        }

        async function deleteFacilityImage(imgId) {
            if (!confirm('이미지를 삭제하시겠습니까?')) return;
            try {
                const response = await fetch('/api/hrd/facilities/images/' + imgId, { method: 'DELETE' });
                if ((await response.json()).success) {
                    loadFacilityImages(currentFacilityId);
                }
            } catch (e) {
                console.error(e);
            }
        }

        async function viewFacilityItems() {
            if (!currentFacilityId) {
                alert('시설을 먼저 선택하세요.');
                return;
            }

            try {
                const response = await fetch('/api/hrd/facilities/' + currentFacilityId + '/items');
                const result = await response.json();
                
                const tbody = document.getElementById('facilityItemsList');
                if (result.success && result.data.length > 0) {
                    tbody.innerHTML = result.data.map(item => 
                        '<tr>' +
                            '<td class="px-4 py-2"><span class="px-2 py-0.5 rounded text-xs bg-gray-100">' + (item.category === 'textbook' ? '교재' : item.category === 'equipment' ? '비품' : '소모품') + '</span></td>' +
                            '<td class="px-4 py-2 font-medium">' + item.name + '</td>' +
                            '<td class="px-4 py-2 text-gray-500">' + (item.model || '-') + '</td>' +
                            '<td class="px-4 py-2">' + item.quantity + '</td>' +
                            '<td class="px-4 py-2">' + item.status + '</td>' +
                        '</tr>'
                    ).join('');
                } else {
                    tbody.innerHTML = '<tr><td colspan="5" class="px-4 py-8 text-center text-gray-400">등록된 비품/장비가 없습니다.</td></tr>';
                }

                document.getElementById('facilityItemsModal').classList.remove('hidden');
            } catch (e) {
                console.error(e);
                alert('목록을 불러오는데 실패했습니다.');
            }
        }

        function closeModal(id) {
            document.getElementById(id).classList.add('hidden');
        }
</body>
</html>
`;
