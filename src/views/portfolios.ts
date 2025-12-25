import { footerHtml } from './footer';
import { navigationHtml } from './components/navigation';

export const portfoliosListHtml = `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>포트폴리오 갤러리 - 와우쓰리디홍대센터</title>
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
<body class="bg-gray-50 flex flex-col min-h-screen">
    <!-- 네비게이션 (courses.ts와 동일한 구조) -->
    ${navigationHtml('portfolios')}

    <!-- 히어로 섹션 -->
    <div class="bg-gradient-to-br from-gray-900 to-primary-900 text-white py-20 relative overflow-hidden">
        <div class="absolute inset-0 opacity-20">
            <div class="absolute top-0 right-0 w-96 h-96 bg-primary-500 rounded-full blur-[100px] -mr-48 -mt-48"></div>
            <div class="absolute bottom-0 left-0 w-64 h-64 bg-blue-500 rounded-full blur-[80px] -ml-32 -mb-32"></div>
        </div>
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <span class="px-3 py-1 bg-primary-500 text-white text-[10px] font-black rounded-full mb-4 inline-block uppercase tracking-widest">SHOWCASE</span>
            <h1 class="text-5xl font-black mb-6 tracking-tight">수강생 우수 포트폴리오</h1>
            <p class="text-xl text-primary-100 max-w-2xl mx-auto font-medium leading-relaxed">
                와우쓰리디홍대센터에서 꿈을 실현한 수강생들의 뛰어난 작품들을 소개합니다.<br>
                실무 중심 교육의 성과를 직접 확인해보세요.
            </p>
        </div>
    </div>

    <!-- 필터 및 검색 바 -->
    <div class="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        <div class="bg-white rounded-3xl shadow-2xl p-4 md:p-6 border border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between">
            <div class="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide">
                <button onclick="filterCategory('')" class="cat-btn px-6 py-2.5 rounded-2xl text-sm font-black bg-primary-600 text-white shadow-lg shadow-primary-100 transition duration-300" data-category="">전체</button>
                <button onclick="filterCategory('3d_modeling')" class="cat-btn px-6 py-2.5 rounded-2xl text-sm font-black bg-gray-50 text-gray-500 hover:bg-gray-100 transition duration-300" data-category="3d_modeling">3D 모델링</button>
                <button onclick="filterCategory('design')" class="cat-btn px-6 py-2.5 rounded-2xl text-sm font-black bg-gray-50 text-gray-500 hover:bg-gray-100 transition duration-300" data-category="design">디자인</button>
                <button onclick="filterCategory('coding')" class="cat-btn px-6 py-2.5 rounded-2xl text-sm font-black bg-gray-50 text-gray-500 hover:bg-gray-100 transition duration-300" data-category="coding">코딩/개발</button>
                <button onclick="filterCategory('other')" class="cat-btn px-6 py-2.5 rounded-2xl text-sm font-black bg-gray-50 text-gray-500 hover:bg-gray-100 transition duration-300" data-category="other">기타</button>
            </div>
            <div class="flex items-center gap-2">
                <label class="flex items-center gap-2 cursor-pointer group">
                    <input type="checkbox" id="featuredOnly" onchange="loadPortfolios()" class="w-5 h-5 rounded-lg border-2 border-gray-200 text-primary-600 focus:ring-primary-100 transition">
                    <span class="text-sm font-bold text-gray-600 group-hover:text-primary-600 transition">추천 작품만 보기</span>
                </label>
            </div>
        </div>
    </div>

    <!-- 메인 컨텐츠 -->
    <main class="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-16">
        <div id="portfolioGrid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
            <!-- Loading -->
            <div class="col-span-full py-20 text-center">
                <i class="fas fa-spinner fa-spin text-4xl text-primary-300 mb-4"></i>
                <p class="text-gray-400 font-bold">포트폴리오를 불러오는 중입니다...</p>
            </div>
        </div>
    </main>

    <!-- 상세 모달 -->
    <div id="detailModal" class="fixed inset-0 bg-black/90 hidden z-[70] flex items-center justify-center p-4 backdrop-blur-md">
        <div class="bg-white rounded-[2rem] shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto transform transition-all group">
            <div class="relative h-96">
                <img id="modalThumbnail" src="" class="w-full h-full object-cover">
                <div class="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent"></div>
                <button onclick="closeModal()" class="absolute top-6 right-6 w-12 h-12 bg-white/20 hover:bg-white/40 text-white rounded-full flex items-center justify-center transition backdrop-blur-lg border border-white/30">
                    <i class="fas fa-times text-xl"></i>
                </button>
                <div class="absolute bottom-0 left-0 p-10 w-full">
                    <span id="modalCategory" class="px-4 py-1.5 bg-primary-600 text-white text-[10px] font-black rounded-full shadow-lg uppercase tracking-[0.2em] mb-4 inline-block">CATEGORY</span>
                    <h3 id="modalTitle" class="text-4xl font-black text-gray-900 tracking-tight">TITLE</h3>
                </div>
            </div>
            <div class="p-10 -mt-6">
                <div class="flex flex-col lg:flex-row gap-16">
                    <div class="flex-1">
                        <h4 class="text-[11px] font-black text-primary-600 uppercase tracking-[0.3em] mb-6 flex items-center">
                            <span class="w-8 h-px bg-primary-200 mr-4"></span> Project Overview
                        </h4>
                        <p id="modalDescription" class="text-gray-600 leading-[1.8] text-lg font-medium whitespace-pre-wrap"></p>
                    </div>
                    <div class="w-full lg:w-80 space-y-8">
                        <div class="p-8 bg-gray-50 rounded-[2rem] border border-gray-100 flex flex-col gap-6">
                            <div class="flex items-center gap-4">
                                <div class="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-primary-500 font-bold text-lg" id="studentInitial">S</div>
                                <div>
                                    <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Creator</p>
                                    <p class="text-base font-black text-gray-800" id="modalStudentName">Student Name</p>
                                </div>
                            </div>
                            <div class="flex items-center gap-4">
                                <div class="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-primary-300 text-lg"><i class="fas fa-graduation-cap"></i></div>
                                <div>
                                    <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Course</p>
                                    <p class="text-sm font-bold text-gray-700" id="modalCourseTitle">Course Title</p>
                                </div>
                            </div>
                        </div>
                        <a id="modalContentLink" href="#" target="_blank" class="w-full py-5 bg-gray-900 text-white font-black rounded-[1.5rem] hover:bg-black transition-all text-center flex items-center justify-center gap-3 shadow-xl hover:shadow-2xl hover:-translate-y-1">
                            보러가기 <i class="fas fa-arrow-right text-xs"></i>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- 푸터 -->
    ${footerHtml()}

    <script>
        let currentPortfolios = [];
        let activeCategory = '';

        document.addEventListener('DOMContentLoaded', () => {
            loadPortfolios();
            updateAuthMenu();
        });

        async function loadPortfolios() {
            const isFeatured = document.getElementById('featuredOnly').checked;
            const grid = document.getElementById('portfolioGrid');
            
            try {
                const url = new URL('/api/portfolios', window.location.origin);
                if (activeCategory) url.searchParams.append('category', activeCategory);
                if (isFeatured) url.searchParams.append('isFeatured', 'true');
                
                const res = await fetch(url.toString());
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
                grid.innerHTML = '<div class="col-span-full py-32 text-center text-gray-300 font-bold text-xl">등록된 작품이 없습니다.</div>';
                return;
            }

            grid.innerHTML = currentPortfolios.map(p => \`
                <div class="group bg-white rounded-[2rem] shadow-sm hover:shadow-2xl border border-gray-100 overflow-hidden transition-all duration-700 cursor-pointer flex flex-col h-full" onclick="openModal(\${p.id})">
                    <div class="relative overflow-hidden h-72">
                        <img src="\${p.thumbnail_url || 'https://images.unsplash.com/photo-1587586062323-836091e6006e?auto=format&fit=crop&q=80&w=800'}" 
                             class="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-110">
                        <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8">
                            <span class="text-white text-xs font-black uppercase tracking-widest mb-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75">\${p.category}</span>
                            <h4 class="text-white text-xl font-black mb-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-100">\${p.title}</h4>
                            <div class="flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-150">
                                <span class="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white text-[10px] font-bold">\${p.student_name[0]}</span>
                                <span class="text-white/80 text-xs font-bold">\${p.student_name}</span>
                            </div>
                        </div>
                        \${p.is_featured ? \`
                            <div class="absolute top-6 left-6 px-3 py-1 bg-yellow-400 text-white text-[10px] font-black rounded-full shadow-lg flex items-center gap-1.5 z-10">
                                <i class="fas fa-star text-[8px]"></i> RECOMMENDED
                            </div>
                        \` : ''}
                    </div>
                </div>
            \`).join('');
        }

        function filterCategory(cat) {
            activeCategory = cat;
            document.querySelectorAll('.cat-btn').forEach(btn => {
                if (btn.dataset.category === cat) {
                    btn.className = 'cat-btn px-6 py-2.5 rounded-2xl text-sm font-black bg-primary-600 text-white shadow-lg shadow-primary-100 transition duration-300';
                } else {
                    btn.className = 'cat-btn px-6 py-2.5 rounded-2xl text-sm font-black bg-gray-50 text-gray-500 hover:bg-gray-100 transition duration-300';
                }
            });
            loadPortfolios();
        }

        function openModal(id) {
            const p = currentPortfolios.find(item => item.id === id);
            if (!p) return;

            document.getElementById('modalThumbnail').src = p.thumbnail_url || 'https://images.unsplash.com/photo-1587586062323-836091e6006e?auto=format&fit=crop&q=80&w=800';
            document.getElementById('modalCategory').textContent = p.category;
            document.getElementById('modalTitle').textContent = p.title;
            document.getElementById('modalDescription').textContent = p.description || '작품 설명이 아직 등록되지 않았습니다.';
            document.getElementById('modalStudentName').textContent = p.student_name;
            document.getElementById('studentInitial').textContent = p.student_name[0];
            document.getElementById('modalCourseTitle').textContent = p.course_title || '일반 참여';
            document.getElementById('modalContentLink').href = p.content_url || '#';
            
            document.getElementById('detailModal').classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        }

        function closeModal() {
            document.getElementById('detailModal').classList.add('hidden');
            document.body.style.overflow = '';
        }

        function updateAuthMenu() {
            const token = localStorage.getItem('token');
            const userStr = localStorage.getItem('user');
            if (token && userStr) {
                const user = JSON.parse(userStr);
                document.getElementById('authMenu').innerHTML = \`
                    <a href="/\${user.role === 'admin' ? 'admin' : user.role === 'teacher' ? 'teacher' : 'student'}" class="px-4 py-2 bg-primary-50 text-primary-600 font-bold text-sm rounded-xl hover:bg-primary-100 transition">
                        나의 메뉴
                    </a>
                \`;
            }
        }
    </script>
</body>
</html>
`;
