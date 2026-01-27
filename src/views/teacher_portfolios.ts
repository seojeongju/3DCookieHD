import { teacherSidebar } from './components/teacher_sidebar';

export const teacherPortfoliosHtml = `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>학생 포트폴리오 관리 - 강사 모드</title>
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
        \${teacherSidebar('portfolios')}

        <!-- 메인 컨텐츠 영역 -->
        <main class="flex-1 overflow-y-auto bg-gray-50 flex flex-col">
            <!-- 헤더 -->
            <header class="bg-white shadow-sm sticky top-0 z-10">
                <div class="px-8 py-4 flex justify-between items-center">
                    <h1 class="text-2xl font-bold text-gray-800">학생 포트폴리오 관리</h1>
                    <div class="flex items-center space-x-4">
                        <select id="categoryFilter" onchange="loadPortfolios()" class="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold shadow-sm focus:ring-4 focus:ring-primary-50">
                            <option value="">모든 카테고리</option>
                            <option value="3d_modeling">3D 모델링</option>
                            <option value="design">디자인</option>
                            <option value="coding">코딩/개발</option>
                            <option value="other">기타</option>
                        </select>
                    </div>
                </div>
            </header>

            <div class="p-8 max-w-7xl mx-auto w-full flex-1">
                <p class="text-gray-500 mb-8 font-medium">담당하시는 과정의 학생들이 등록한 포트폴리오 목록입니다. 우수한 작품은 '추천'으로 표시할 수 있습니다.</p>
                
                <div id="portfolioGrid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    <!-- JS Load -->
                    <div class="col-span-full py-20 text-center text-gray-400">
                        <i class="fas fa-spinner fa-spin text-3xl mb-4 text-primary-300"></i>
                        <p>포트폴리오를 불러오는 중입니다...</p>
                    </div>
                </div>
            </div>
        </main>
    </div>

    <!-- 상세 모달 -->
    <div id="detailModal" class="fixed inset-0 bg-black/80 hidden z-[70] flex items-center justify-center p-4 backdrop-blur-sm">
        <div class="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto transform transition-all">
            <div class="relative">
                <img id="modalThumbnail" src="" class="w-full h-80 object-cover rounded-t-3xl text-gray-200">
                <button onclick="closeModal()" class="absolute top-6 right-6 w-10 h-10 bg-black/30 hover:bg-black/50 text-white rounded-full flex items-center justify-center transition backdrop-blur-md">
                    <i class="fas fa-times"></i>
                </button>
                <div class="absolute bottom-6 left-8">
                    <span id="modalCategory" class="px-3 py-1 bg-white/90 text-primary-600 text-[10px] font-black rounded-full shadow-sm uppercase tracking-widest mb-2 inline-block">CATEGORY</span>
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
                            <a id="modalContentLink" href="#" target="_blank" class="w-full py-4 bg-primary-600 text-white font-bold rounded-2xl hover:bg-primary-700 transition text-center shadow-lg shadow-primary-100 flex items-center justify-center gap-2">
                                <i class="fas fa-external-link-alt"></i> 작품 상세보기
                            </a>
                            <button id="modalFeaturedBtn" class="w-full py-3 border-2 border-primary-100 text-primary-600 font-bold rounded-2xl hover:bg-primary-50 transition flex items-center justify-center gap-2">
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
        const user = JSON.parse(localStorage.getItem('user') || '{}');

        document.addEventListener('DOMContentLoaded', loadPortfolios);

        async function loadPortfolios() {
            const category = document.getElementById('categoryFilter').value;
            const grid = document.getElementById('portfolioGrid');
            
            try {
                // 강사 ID로 필터링하여 담당 학생들의 포트폴리오만 조회
                const url = new URL('/api/portfolios', window.location.origin);
                if (category) url.searchParams.append('category', category);
                if (user.id) url.searchParams.append('teacherId', user.id);
                
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
                grid.innerHTML = '<div class="col-span-full py-32 text-center text-gray-300 font-bold text-xl">담당 과정에 등록된 포트폴리오가 없습니다.</div>';
                return;
            }

            grid.innerHTML = currentPortfolios.map(p => \`
                <div class="group bg-white rounded-3xl shadow-sm hover:shadow-2xl border border-gray-100 overflow-hidden transition-all duration-500 cursor-pointer flex flex-col h-full" onclick="openModal(\${p.id})">
                    <div class="relative overflow-hidden h-52">
                        <img src="\${p.thumbnail_url || 'https://images.unsplash.com/photo-1587586062323-836091e6006e?auto=format&fit=crop&q=80&w=800'}" 
                             class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110">
                        <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
                            <span class="text-white text-sm font-black flex items-center gap-2">
                                <i class="fas fa-eye"></i> 상세보기
                            </span>
                        </div>
                        \${p.is_featured ? '<div class="absolute top-4 left-4 px-3 py-1 bg-yellow-400 text-white text-[10px] font-black rounded-full shadow-lg flex items-center gap-1.5"><i class="fas fa-star"></i> FEATURED</div>' : ''}
                        <div class="absolute top-4 right-4 px-2 py-1 bg-white/90 text-[9px] font-black rounded-lg shadow-sm text-gray-600 uppercase tracking-tighter">\${p.category}</div>
                    </div>
                    <div class="p-6 flex-1 flex flex-col">
                        <h4 class="font-black text-gray-800 text-lg mb-1 line-clamp-1 group-hover:text-primary-600 transition-colors">\${p.title}</h4>
                        <p class="text-[10px] text-primary-600 font-black mb-3 uppercase tracking-wider">\${p.course_title}</p>
                        <p class="text-gray-500 text-xs font-medium line-clamp-2 mb-4 leading-relaxed">\${p.description || '설명이 없습니다.'}</p>
                        <div class="mt-auto pt-4 border-t border-gray-50 flex justify-between items-center">
                            <div class="flex items-center gap-2">
                                <div class="w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-[8px] font-bold">\${p.student_name[0]}</div>
                                <span class="text-xs font-black text-gray-500">\${p.student_name}</span>
                            </div>
                            <button onclick="deletePortfolio(event, \${p.id})" class="text-gray-200 hover:text-red-500 transition-colors"><i class="fas fa-trash-alt text-xs"></i></button>
                        </div>
                    </div>
                </div>
            \`).join('');
        }

        function openModal(id) {
            const p = currentPortfolios.find(item => item.id === id);
            if (!p) return;

            document.getElementById('modalThumbnail').src = p.thumbnail_url || 'https://images.unsplash.com/photo-1587586062323-836091e6006e?auto=format&fit=crop&q=80&w=800';
            document.getElementById('modalCategory').textContent = p.category;
            document.getElementById('modalTitle').textContent = p.title;
            document.getElementById('modalDescription').textContent = p.description || '설명이 공개되지 않았습니다.';
            document.getElementById('modalStudent').textContent = p.student_name;
            document.getElementById('modalCourse').textContent = p.course_title || '소속 과정 정보 없음';
            document.getElementById('modalContentLink').href = p.content_url || '#';
            
            const featureBtn = document.getElementById('modalFeaturedBtn');
            featureBtn.innerHTML = p.is_featured ? '<i class="fas fa-star"></i> 추천 해제' : '<i class="fas fa-star"></i> 추천 설정';
            featureBtn.onclick = () => toggleFeatured(p.id, !p.is_featured);

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
            if (!confirm('정말 삭제하시겠습니까? (강사 권한으로 삭제)')) return;
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
