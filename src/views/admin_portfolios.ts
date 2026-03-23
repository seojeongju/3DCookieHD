import { hrdSidebar } from './components/hrd_sidebar';

export const adminPortfoliosHtml = `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>포트폴리오 갤러리 관리 - 와우쓰리디홍대센터</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
</head>
<body class="bg-gray-50 font-sans">
    <div class="flex h-screen overflow-hidden">
        ${hrdSidebar('portfolios')}
        <div class="flex-1 flex flex-col overflow-hidden bg-gray-50">
            <header class="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 shadow-sm z-10">
                <div class="flex items-center">
                    <h2 class="text-xl font-bold text-gray-800">포트폴리오 갤러리</h2>
                    <span class="ml-4 text-sm text-gray-500">수강생들의 우수한 작품을 관리하고 추천합니다.</span>
                </div>
                <div class="flex items-center gap-3">
                    <select id="categoryFilter" onchange="loadPortfolios()" class="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium shadow-sm focus:ring-2 focus:ring-blue-500">
                        <option value="">모든 카테고리</option>
                        <option value="3d_modeling">3D 모델링</option>
                        <option value="design">디자인</option>
                        <option value="coding">코딩/개발</option>
                        <option value="other">기타</option>
                    </select>
                    <button onclick="openUploadModal()" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center shadow-sm font-medium">
                        <i class="fas fa-plus mr-2"></i> 포트폴리오 등록
                    </button>
                </div>
            </header>

            <main class="flex-1 overflow-y-auto p-8">
        <div id="portfolioGrid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <div class="col-span-full py-20 text-center text-gray-400">
                <i class="fas fa-spinner fa-spin text-3xl mb-4 text-blue-300"></i>
                <p>포트폴리오를 불러오는 중입니다...</p>
            </div>
        </div>
            </main>
        </div>
    </div>

    <!-- 업로드 모달 -->
    <div id="uploadModal" class="fixed inset-0 bg-black/80 hidden z-[70] flex items-center justify-center p-4 backdrop-blur-sm">
        <div class="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div class="p-6 border-b border-gray-200 flex justify-between items-center">
                <h3 class="text-xl font-bold text-gray-800">포트폴리오 등록</h3>
                <button onclick="closeUploadModal()" class="text-gray-500 hover:text-gray-700">
                    <i class="fas fa-times text-xl"></i>
                </button>
            </div>
            <form id="uploadForm" onsubmit="handleUpload(event)" class="p-6">
                <div class="space-y-4">
                    <div>
                        <label class="block text-gray-700 font-medium mb-2">학생 선택 <span class="text-red-500">*</span></label>
                        <select name="student_id" id="studentSelect" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                            <option value="">학생을 선택하세요</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-gray-700 font-medium mb-2">과정 선택</label>
                        <select name="course_id" id="courseSelect" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                            <option value="">과정을 선택하세요</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-gray-700 font-medium mb-2">제목 <span class="text-red-500">*</span></label>
                        <input type="text" name="title" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    </div>
                    <div>
                        <label class="block text-gray-700 font-medium mb-2">카테고리</label>
                        <select name="category" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                            <option value="3d_modeling">3D 모델링</option>
                            <option value="design">디자인</option>
                            <option value="coding">코딩/개발</option>
                            <option value="other">기타</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-gray-700 font-medium mb-2">설명</label>
                        <textarea name="description" rows="4" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"></textarea>
                    </div>
                    <div>
                        <label class="block text-gray-700 font-medium mb-2">썸네일 URL</label>
                        <input type="url" name="thumbnail_url" placeholder="https://..." class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                        <p class="text-xs text-gray-500 mt-1">이미지 URL을 입력하세요 (예: 구글 드라이브, Imgur 등)</p>
                    </div>
                    <div>
                        <label class="block text-gray-700 font-medium mb-2">작품 URL</label>
                        <input type="url" name="content_url" placeholder="https://..." class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                        <p class="text-xs text-gray-500 mt-1">포트폴리오 상세보기 링크 (GitHub, Behance 등)</p>
                    </div>
                </div>
                <div class="mt-6 flex justify-end space-x-3">
                    <button type="button" onclick="closeUploadModal()" class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">취소</button>
                    <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">등록하기</button>
                </div>
            </form>
        </div>
    </div>

    <!-- 상세 모달 -->
    <div id="detailModal" class="fixed inset-0 bg-black/80 hidden z-[70] flex items-center justify-center p-4 backdrop-blur-sm">
        <div class="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto transform transition-all">
            <div class="relative">
                <img id="modalThumbnail" src="" class="w-full h-80 object-cover rounded-t-3xl">
                <button onclick="closeModal()" class="absolute top-6 right-6 w-10 h-10 bg-black/30 hover:bg-black/50 text-white rounded-full flex items-center justify-center transition backdrop-blur-md">
                    <i class="fas fa-times"></i>
                </button>
                <div class="absolute bottom-6 left-8">
                    <span id="modalCategory" class="px-3 py-1 bg-white/90 text-blue-600 text-[10px] font-black rounded-full shadow-sm uppercase tracking-widest mb-2 inline-block">CATEGORY</span>
                    <h3 id="modalTitle" class="text-3xl font-black text-white drop-shadow-lg">제목</h3>
                </div>
            </div>
            <div class="p-10">
                <div class="flex flex-col md:flex-row gap-10">
                    <div class="flex-1">
                        <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-3">Project Description</label>
                        <p id="modalDescription" class="text-gray-600 leading-relaxed text-lg font-medium"></p>
                    </div>
                    <div class="w-full md:w-64 space-y-6">
                        <div class="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                            <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-4">Metadata</label>
                            <div class="space-y-4">
                                <div class="flex items-center gap-3">
                                    <div class="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center text-xs"><i class="fas fa-user-graduate"></i></div>
                                    <div class="text-sm font-bold text-gray-700" id="modalStudent">학생명</div>
                                </div>
                                <div class="flex items-center gap-3">
                                    <div class="w-8 h-8 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center text-xs"><i class="fas fa-graduation-cap"></i></div>
                                    <div class="text-sm font-bold text-gray-500" id="modalCourse">교육과정명</div>
                                </div>
                            </div>
                        </div>
                        <div class="flex flex-col gap-3">
                            <a id="modalContentLink" href="#" target="_blank" class="w-full py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition text-center shadow-lg flex items-center justify-center gap-2">
                                <i class="fas fa-external-link-alt"></i> 작품 상세보기
                            </a>
                            <button id="modalFeaturedBtn" class="w-full py-3 border-2 border-blue-100 text-blue-600 font-bold rounded-2xl hover:bg-blue-50 transition flex items-center justify-center gap-2">
                                <i class="fas fa-star"></i> 추천 설정/해제
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script>
        let currentPortfolios = [];
        let selectedId = null;

        document.addEventListener('DOMContentLoaded', () => {
            loadStudents();
            loadCourses();
            loadPortfolios();
        });

        async function loadStudents() {
            try {
                const res = await fetch('/api/users?role=student', {
                    headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
                });
                const result = await res.json();
                if (result.success) {
                    const select = document.getElementById('studentSelect');
                    result.data.forEach(s => {
                        const option = document.createElement('option');
                        option.value = s.id;
                        option.textContent = s.name + ' (' + (s.email || s.phone) + ')';
                        select.appendChild(option);
                    });
                }
            } catch (e) { console.error(e); }
        }

        async function loadCourses() {
            try {
                const res = await fetch('/api/courses', {
                    headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
                });
                const result = await res.json();
                if (result.success) {
                    const select = document.getElementById('courseSelect');
                    result.data.forEach(c => {
                        const option = document.createElement('option');
                        option.value = c.id;
                        option.textContent = c.title;
                        select.appendChild(option);
                    });
                }
            } catch (e) { console.error(e); }
        }

        async function loadPortfolios() {
            const category = document.getElementById('categoryFilter').value;
            const grid = document.getElementById('portfolioGrid');
            
            try {
                const url = new URL('/api/portfolios', window.location.origin);
                if (category) url.searchParams.append('category', category);
                
                const res = await fetch(url.toString(), {
                    headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
                });
                const result = await res.json();
                
                if (result.success) {
                    currentPortfolios = result.data;
                    renderPortfolios();
                }
            } catch (e) { console.error(e); }
        }

        function renderPortfolios() {
            const grid = document.getElementById('portfolioGrid');
            if (currentPortfolios.length === 0) {
                grid.innerHTML = '<div class="col-span-full py-32 text-center text-gray-300 font-bold text-xl">등록된 포트폴리오가 없습니다.</div>';
                return;
            }

            grid.innerHTML = currentPortfolios.map(p => \`
                <div class="group bg-white rounded-lg shadow-sm hover:shadow-xl border border-gray-100 overflow-hidden transition-all duration-300 cursor-pointer flex flex-col h-full" onclick="openModal(\${p.id})">
                    <div class="relative overflow-hidden h-48">
                        <img src="\${p.thumbnail_url || 'https://images.unsplash.com/photo-1587586062323-836091e6006e?auto=format&fit=crop&q=80&w=800'}" 
                             class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110">
                        <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                            <span class="text-white text-sm font-bold flex items-center gap-2">
                                <i class="fas fa-eye"></i> 상세보기
                            </span>
                        </div>
                        \${p.is_featured ? '<div class="absolute top-3 left-3 px-2 py-1 bg-yellow-400 text-white text-[10px] font-bold rounded-full shadow-lg flex items-center gap-1"><i class="fas fa-star"></i> FEATURED</div>' : ''}
                        <div class="absolute top-3 right-3 px-2 py-1 bg-white/90 text-[9px] font-bold rounded-lg shadow-sm text-gray-600 uppercase">\${p.category}</div>
                    </div>
                    <div class="p-4 flex-1 flex flex-col">
                        <h4 class="font-bold text-gray-800 text-base mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">\${p.title}</h4>
                        <p class="text-gray-500 text-xs font-medium line-clamp-2 mb-3 leading-relaxed">\${(p.description_plain && String(p.description_plain).trim()) ? String(p.description_plain).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;') : '설명이 없습니다.'}</p>
                        <div class="mt-auto pt-3 border-t border-gray-50 flex justify-between items-center">
                            <div class="flex items-center gap-2">
                                <div class="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-[8px] font-bold">\${p.student_name[0]}</div>
                                <span class="text-xs font-bold text-gray-500">\${p.student_name}</span>
                            </div>
                            <button onclick="deletePortfolio(event, \${p.id})" class="text-gray-200 hover:text-red-500 transition-colors"><i class="fas fa-trash-alt text-xs"></i></button>
                        </div>
                    </div>
                </div>
            \`).join('');
        }

        function openUploadModal() {
            document.getElementById('uploadModal').classList.remove('hidden');
        }

        function closeUploadModal() {
            document.getElementById('uploadModal').classList.add('hidden');
            document.getElementById('uploadForm').reset();
        }

        async function handleUpload(e) {
            e.preventDefault();
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData.entries());
            
            try {
                const res = await fetch('/api/portfolios', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    },
                    body: JSON.stringify(data)
                });
                const result = await res.json();
                if (result.success) {
                    alert('포트폴리오가 등록되었습니다!');
                    closeUploadModal();
                    loadPortfolios();
                } else {
                    alert('등록 실패: ' + result.error);
                }
            } catch (e) {
                console.error(e);
                alert('등록 중 오류가 발생했습니다.');
            }
        }

        function openModal(id) {
            const p = currentPortfolios.find(item => item.id === id);
            if (!p) return;
            selectedId = id;

            document.getElementById('modalThumbnail').src = p.thumbnail_url || 'https://images.unsplash.com/photo-1587586062323-836091e6006e?auto=format&fit=crop&q=80&w=800';
            document.getElementById('modalCategory').textContent = p.category;
            document.getElementById('modalTitle').textContent = p.title;
            document.getElementById('modalDescription').innerHTML = p.description || '<p class="text-gray-500">설명이 공개되지 않았습니다.</p>';
            document.getElementById('modalStudent').textContent = p.student_name;
            document.getElementById('modalCourse').textContent = p.course_title || '소속 과정 정보 없음';
            document.getElementById('modalContentLink').href = p.content_url || '#';
            
            const featureBtn = document.getElementById('modalFeaturedBtn');
            featureBtn.innerHTML = p.is_featured ? '<i class="fas fa-star"></i> 추천 해제' : '<i class="fas fa-star"></i> 추천 설정';
            featureBtn.onclick = () => toggleFeatured(id, !p.is_featured);

            document.getElementById('detailModal').classList.remove('hidden');
        }

        function closeModal() { document.getElementById('detailModal').classList.add('hidden'); }

        async function toggleFeatured(id, isFeatured) {
            try {
                const res = await fetch(\`/api/portfolios/\${id}/featured\`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('token') },
                    body: JSON.stringify({ isFeatured })
                });
                if ((await res.json()).success) {
                    loadPortfolios();
                    closeModal();
                }
            } catch (e) { console.error(e); }
        }

        async function deletePortfolio(e, id) {
            e.stopPropagation();
            if (!confirm('정말 삭제하시겠습니까?')) return;
            try {
                const res = await fetch(\`/api/portfolios/\${id}\`, {
                    method: 'DELETE',
                    headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
                });
                if ((await res.json()).success) {
                    loadPortfolios();
                }
            } catch (e) { console.error(e); }
        }
    </script>
</body>
</html>
`;
