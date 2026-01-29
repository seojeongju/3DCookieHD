import { hrdSidebar } from './components/hrd_sidebar';

export const adminInquiriesHtml = (sidebar: string | null = null) => `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>온라인 상담 관리 - 와우쓰리디홍대센터</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Pretendard:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Pretendard', sans-serif; }
    </style>
</head>
<body class="bg-gray-50">
    <div class="flex h-screen overflow-hidden">
        ${sidebar || hrdSidebar('inquiries')}
        
        <main class="flex-1 flex flex-col overflow-hidden bg-gray-50">
            <!-- Header -->
            <header class="bg-white border-b border-gray-200">
                <div class="px-8 py-6">
                    <div class="flex justify-between items-center">
                        <div>
                            <h1 class="text-2xl font-bold text-gray-800">온라인 문의 관리</h1>
                            <p class="text-gray-500 mt-1">홈페이지를 통해 접수된 1:1 상담 및 문의 내역을 관리합니다.</p>
                        </div>
                    </div>
                </div>
            </header>

            <!-- Content -->
            <div class="flex-1 overflow-y-auto p-8">
                <div class="max-w-7xl mx-auto">
                    <!-- Filters -->
                    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6 flex flex-wrap gap-4 items-center justify-between">
                        <div class="flex items-center gap-2">
                            <button onclick="filterStatus('all')" id="btn-all" class="px-4 py-2 rounded-lg text-sm font-medium transition bg-gray-100 text-gray-600">전체</button>
                            <button onclick="filterStatus('pending')" id="btn-pending" class="px-4 py-2 rounded-lg text-sm font-medium transition text-gray-500 hover:bg-gray-50">대기중</button>
                            <button onclick="filterStatus('completed')" id="btn-completed" class="px-4 py-2 rounded-lg text-sm font-medium transition text-gray-500 hover:bg-gray-50">답변완료</button>
                            <input type="hidden" id="currentStatus" value="pending"> <!-- Default pending as usually admins prioritize new ones -->
                        </div>
                        <div class="relative">
                            <i class="fas fa-search absolute left-3 top-3 text-gray-400 text-sm"></i>
                            <input type="text" id="searchInput" placeholder="이름, 연락처 검색..." onkeyup="if(event.key === 'Enter') loadInquiries()" class="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none w-64">
                        </div>
                    </div>

                    <!-- List -->
                    <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <table class="min-w-full divide-y divide-gray-200">
                            <thead class="bg-gray-50">
                                <tr>
                                    <th class="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">상태</th>
                                    <th class="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">신청자</th>
                                    <th class="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">문의 내용 (요약)</th>
                                    <th class="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">접수일시</th>
                                    <th class="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">관리</th>
                                </tr>
                            </thead>
                            <tbody id="inquiriesList" class="bg-white divide-y divide-gray-200">
                                <!-- Data -->
                            </tbody>
                        </table>
                        <div id="pagination" class="p-4 flex justify-center border-t border-gray-100"></div>
                    </div>
                </div>
            </div>
        </main>
    </div>

    <!-- Detail Modal -->
    <div id="inquiryModal" class="fixed inset-0 bg-black/50 hidden z-50 flex items-center justify-center backdrop-blur-sm p-4">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-fade-in">
            <div class="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <h3 class="text-lg font-bold text-gray-800">문의 상세 내역</h3>
                <button onclick="closeModal()" class="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 transition">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            
            <div class="p-8 space-y-6">
                <input type="hidden" id="modalId">
                
                <!-- Info Grid -->
                <div class="grid grid-cols-2 gap-6 p-6 bg-blue-50/50 rounded-xl border border-blue-100">
                    <div>
                        <span class="text-xs font-bold text-blue-400 uppercase tracking-wider mb-1 block">신청자</span>
                        <p class="text-gray-900 font-bold text-lg" id="modalName">-</p>
                    </div>
                    <div>
                        <span class="text-xs font-bold text-blue-400 uppercase tracking-wider mb-1 block">연락처</span>
                        <p class="text-gray-900 text-lg" id="modalPhone">-</p>
                    </div>
                     <div class="col-span-2">
                        <span class="text-xs font-bold text-blue-400 uppercase tracking-wider mb-1 block">접수 일시</span>
                        <p class="text-gray-600 text-sm" id="modalDate">-</p>
                    </div>
                </div>

                <div>
                    <span class="text-sm font-bold text-gray-700 block mb-2">문의 내용</span>
                    <div class="p-4 bg-gray-50 rounded-xl border border-gray-200 text-gray-700 text-sm whitespace-pre-wrap leading-relaxed" id="modalMessage"></div>
                </div>

                <div class="border-t border-gray-100 pt-6">
                    <div class="flex items-center justify-between mb-2">
                        <label class="text-sm font-bold text-gray-700 block">관리자 답변 / 메모</label>
                        <select id="modalStatus" class="text-sm border-gray-300 rounded-lg focus:ring-blue-500">
                            <option value="pending">대기중 (Pending)</option>
                            <option value="completed">답변완료 (Completed)</option>
                            <option value="cancelled">취소/보류</option>
                        </select>
                    </div>
                    <textarea id="modalMemo" rows="3" class="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none resize-none" placeholder="문의에 대한 답변이나 처리 내용을 기록하세요. (이 내용은 사용자에게 직접 전송되지 않으며 관리자 확인용입니다. 사용자에게는 별도 연락 필요)"></textarea>
                    <p class="text-xs text-gray-400 mt-2">* 답변 완료 처리 시 상태를 '답변완료'로 변경해주세요.</p>
                </div>

                <!-- 입학 상담기록 섹션 (신규 추가) -->
                <div class="border-t border-gray-100 pt-6">
                    <div class="flex items-center justify-between mb-4">
                        <label class="text-sm font-bold text-gray-700 flex items-center">
                            <i class="fas fa-clipboard-list mr-2 text-blue-500"></i>입학 상담 기록 (Admissions Log)
                        </label>
                        <button onclick="showQuickCounseling()" class="text-xs font-bold text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-200 transition">
                            <i class="fas fa-plus mr-1"></i>상담 추가
                        </button>
                    </div>
                    
                    <!-- 상담 기록 리스트 -->
                    <div id="counselingHistory" class="space-y-3 max-h-60 overflow-y-auto pr-2">
                        <div class="text-center py-6 border border-dashed border-gray-200 rounded-xl">
                            <p class="text-gray-400 text-xs">상담 기록이 없습니다.</p>
                        </div>
                    </div>

                    <!-- 퀵 상담 입력 폼 (숨겨짐) -->
                    <div id="quickCounselingForm" class="hidden mt-4 p-4 bg-gray-50 rounded-xl border border-blue-100 space-y-3 animate-fade-in">
                        <div class="flex gap-3">
                            <select id="quickMethod" class="text-xs border-gray-200 rounded-lg p-1.5">
                                <option value="phone">유선상담</option>
                                <option value="online">온라인상담</option>
                                <option value="face_to_face">대면상담</option>
                            </select>
                            <select id="quickCategory" class="text-xs border-gray-200 rounded-lg p-1.5">
                                <option value="academic">입학가공</option>
                                <option value="other">기타</option>
                            </select>
                        </div>
                        <textarea id="quickContent" rows="3" class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-blue-500/20 outline-none resize-none" placeholder="상담 내용을 입력하세요..."></textarea>
                        <div class="flex justify-end gap-2">
                            <button onclick="hideQuickCounseling()" class="px-3 py-1.5 text-xs text-gray-500 hover:text-gray-700 font-medium">취소</button>
                            <button onclick="submitQuickCounseling()" class="px-4 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-lg shadow-sm">저장하기</button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="px-8 py-6 bg-gray-50/50 border-t border-gray-100 flex justify-end gap-3">
                <button onclick="closeModal()" class="px-5 py-2.5 text-gray-500 font-medium hover:bg-gray-100 rounded-lg transition">닫기</button>
                <button onclick="saveInquiry()" class="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-lg shadow-lg shadow-blue-500/30 hover:bg-blue-700 transition transform active:scale-95">
                    <i class="fas fa-check mr-2"></i>처리 내용 저장
                </button>
            </div>
        </div>
    </div>

    <script>
        let currentPage = 1;
        const itemsPerPage = 10;
        let currentStatus = 'pending';

        document.addEventListener('DOMContentLoaded', () => {
            const urlParams = new URLSearchParams(window.location.search);
            const statusParam = urlParams.get('status');
            if(statusParam) {
                filterStatus(statusParam);
            } else {
                filterStatus('pending'); // Default
            }
        });

        function filterStatus(status) {
            currentStatus = status;
            document.querySelectorAll('button[id^="btn-"]').forEach(btn => {
                const isActive = (status === 'all' && btn.id === 'btn-all') || btn.id === 'btn-' + status;
                if(isActive) {
                    btn.className = 'px-4 py-2 rounded-lg text-sm font-bold transition bg-blue-50 text-blue-600 border border-blue-100';
                } else {
                    btn.className = 'px-4 py-2 rounded-lg text-sm font-medium transition text-gray-500 hover:bg-gray-50';
                }
            });
            loadInquiries(1);
        }

        async function loadInquiries(page = 1) {
            const search = document.getElementById('searchInput').value;
            let url = \`/api/consultations?page=\${page}&limit=\${itemsPerPage}\`;
            if (currentStatus !== 'all') url += \`&status=\${currentStatus}\`;
            if (search) url += \`&search=\${encodeURIComponent(search)}\`;

            try {
                const res = await fetch(url);
                const result = await res.json();
                
                const tbody = document.getElementById('inquiriesList');
                if (result.success && result.data.length > 0) {
                    tbody.innerHTML = result.data.map(item => \`
                        <tr class="hover:bg-gray-50 transition cursor-pointer" onclick="openModal(\${item.id})">
                            <td class="px-6 py-4 whitespace-nowrap">
                                <span class="px-2.5 py-1 rounded-full text-xs font-bold \${getStatusClass(item.status)}">
                                    \${getStatusLabel(item.status)}
                                </span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="text-sm font-bold text-gray-900">\${item.name}</div>
                                <div class="text-xs text-gray-400">\${item.phone}</div>
                            </td>
                            <td class="px-6 py-4">
                                <div class="text-sm text-gray-600 line-clamp-1 max-w-md">\${(item.message || '').replace(/\\n/g, ' ')}</div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                \${new Date(item.created_at).toLocaleDateString()}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-right text-sm">
                                <button class="text-blue-600 hover:text-blue-800 font-medium px-3 py-1 rounded hover:bg-blue-50 transition">
                                    상세보기
                                </button>
                            </td>
                        </tr>
                    \`).join('');
                    renderPagination(result.pagination);
                } else {
                    tbody.innerHTML = \`<tr><td colspan="5" class="px-6 py-12 text-center text-gray-400">문의 내역이 없습니다.</td></tr>\`;
                    document.getElementById('pagination').innerHTML = '';
                }
            } catch (e) {
                console.error(e);
            }
        }

        function getStatusClass(status) {
            if (status === 'pending') return 'bg-yellow-100 text-yellow-700';
            if (status === 'completed') return 'bg-green-100 text-green-700';
            return 'bg-gray-100 text-gray-600';
        }

        function getStatusLabel(status) {
            if (status === 'pending') return '대기중';
            if (status === 'completed') return '답변완료';
            if (status === 'cancelled') return '취소';
            return status;
        }

        function renderPagination(pagination) {
            const { page, totalPages } = pagination;
            const container = document.getElementById('pagination');
            let html = '';
            
            if (totalPages > 1) {
                html += \`<div class="flex space-x-1">\`;
                for(let i=1; i<=totalPages; i++) {
                     html += \`<button onclick="loadInquiries(\${i})" class="px-3 py-1 rounded \${i === page ? 'bg-blue-600 text-white font-bold' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'}">\${i}</button>\`;
                }
                html += \`</div>\`;
            }
            container.innerHTML = html;
        }

        let currentItem = null;

        async function openModal(id) {
            try {
                const res = await fetch(\`/api/consultations/\${id}\`);
                const result = await res.json();
                if (result.success) {
                    currentItem = result.data;
                    document.getElementById('modalId').value = currentItem.id;
                    document.getElementById('modalName').textContent = currentItem.name;
                    document.getElementById('modalPhone').textContent = currentItem.phone;
                    document.getElementById('modalDate').textContent = new Date(currentItem.created_at).toLocaleString();
                    document.getElementById('modalMessage').textContent = currentItem.message || '';
                    document.getElementById('modalStatus').value = currentItem.status || 'pending';
                    document.getElementById('modalMemo').value = currentItem.memo || '';
                    
                    // 상담 기록 로드
                    loadCounselingHistory(id);
                    document.getElementById('quickCounselingForm').classList.add('hidden');
                    
                    document.getElementById('inquiryModal').classList.remove('hidden');
                }
            } catch (e) {
                alert('상세 정보를 불러올 수 없습니다.');
            }
        }

        async function loadCounselingHistory(consultationId) {
            const container = document.getElementById('counselingHistory');
            try {
                const res = await fetch(\`/api/hrd/counseling?type=admission&consultation_id=\${consultationId}\`);
                const result = await res.json();
                
                if (result.success && result.data && result.data.length > 0) {
                    container.innerHTML = result.data.map(log => \`
                        <div class="p-3 bg-white border border-gray-100 rounded-xl shadow-sm">
                            <div class="flex justify-between items-center mb-1">
                                <span class="text-[10px] font-bold text-blue-600">\${new Date(log.counseling_date).toLocaleDateString()}</span>
                                <span class="text-[10px] text-gray-400">\${log.counselor_name || '관리자'} (\${getMethodLabel(log.method)})</span>
                            </div>
                            <p class="text-xs text-gray-600 whitespace-pre-line">\${log.content}</p>
                            \${log.result ? \`<div class="mt-1.5 pt-1.5 border-t border-gray-50 text-[10px] text-blue-500 italic">결과: \${log.result}</div>\` : ''}
                        </div>
                    \`).join('');
                } else {
                    container.innerHTML = \`<div class="text-center py-6 border border-dashed border-gray-200 rounded-xl"><p class="text-gray-400 text-xs">상담 기록이 없습니다.</p></div>\`;
                }
            } catch (e) {
                console.error(e);
            }
        }

        function getMethodLabel(method) {
            const map = { face_to_face: '대면', phone: '유선', online: '온라인', other: '기타' };
            return map[method] || method;
        }

        function showQuickCounseling() {
            document.getElementById('quickCounselingForm').classList.remove('hidden');
            document.getElementById('quickContent').focus();
        }

        function hideQuickCounseling() {
            document.getElementById('quickCounselingForm').classList.add('hidden');
            document.getElementById('quickContent').value = '';
        }

        async function submitQuickCounseling() {
            const consultationId = document.getElementById('modalId').value;
            const content = document.getElementById('quickContent').value.trim();
            const method = document.getElementById('quickMethod').value;
            const category = document.getElementById('quickCategory').value;
            
            if (!content) {
                alert('내용을 입력해주세요.');
                return;
            }

            const user = JSON.parse(localStorage.getItem('user') || '{"id": 1}');
            const token = localStorage.getItem('token');

            try {
                const res = await fetch('/api/hrd/counseling', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
                    body: JSON.stringify({
                        student_id: 0, // 입학상담 시 유저가 없을 수 있으므로 0 또는 API에서 처리
                        consultation_id: parseInt(consultationId),
                        content,
                        method,
                        category,
                        counseling_type: 'admission',
                        counseling_date: new Date().toISOString()
                    })
                });
                
                if (res.ok) {
                    hideQuickCounseling();
                    loadCounselingHistory(consultationId);
                } else {
                    alert('저장 실패');
                }
            } catch (e) {
                alert('네트워크 오류');
            }
        }

        function closeModal() {
            document.getElementById('inquiryModal').classList.add('hidden');
            currentItem = null;
        }

        async function saveInquiry() {
            if (!currentItem) return;
            const id = document.getElementById('modalId').value;
            const status = document.getElementById('modalStatus').value;
            const memo = document.getElementById('modalMemo').value;

            try {
                const res = await fetch(\`/api/consultations/\${id}\`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ status, memo })
                });
                const result = await res.json();
                if (result.success) {
                    alert('저장되었습니다.');
                    closeModal();
                    loadInquiries(currentPage);
                } else {
                    alert('저장 실패: ' + result.error);
                }
            } catch (e) {
                alert('오류가 발생했습니다.');
            }
        }
    </script>
</body>
</html>
`;
