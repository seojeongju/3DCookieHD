import { footerHtml } from './footer';
import { navigationHtml } from './components/navigation';

export const prototypeGalleryHtml = `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>시제품 제작 사진 - 와우쓰리디홍대센터</title>
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
    ${navigationHtml('prototype')}

    <!-- 히어로 -->
    <div class="bg-gradient-to-br from-gray-800 to-primary-900 text-white py-20 relative overflow-hidden">
        <div class="absolute inset-0 opacity-20">
            <div class="absolute top-0 right-0 w-96 h-96 bg-primary-500 rounded-full blur-[100px] -mr-48 -mt-48"></div>
            <div class="absolute bottom-0 left-0 w-64 h-64 bg-amber-500 rounded-full blur-[80px] -ml-32 -mb-32"></div>
        </div>
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <span class="px-3 py-1 bg-amber-500 text-gray-900 text-[10px] font-black rounded-full mb-4 inline-block uppercase tracking-widest">PROTOTYPE</span>
            <h1 class="text-5xl font-black mb-6 tracking-tight">시제품 제작 사진</h1>
            <p class="text-xl text-primary-100 max-w-2xl mx-auto font-medium leading-relaxed">
                3D 프린팅으로 제작한 시제품과 프로젝트 결과물을 소개합니다.
            </p>
        </div>
    </div>

    <!-- 갤러리 -->
    <main class="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-16">
        <div id="galleryGrid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            <div class="col-span-full py-20 text-center">
                <i class="fas fa-spinner fa-spin text-4xl text-primary-300 mb-4"></i>
                <p class="text-gray-400 font-bold">시제품 사진을 불러오는 중입니다...</p>
            </div>
        </div>
        <div id="pagination" class="mt-12 flex justify-center"></div>
    </main>

    <!-- 상세 모달 -->
    <div id="detailModal" class="fixed inset-0 bg-black/90 hidden z-[70] flex items-center justify-center p-4 backdrop-blur-md">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div class="relative">
                <img id="modalImage" src="" alt="" class="w-full h-80 object-cover rounded-t-2xl">
                <button onclick="closeDetailModal()" class="absolute top-4 right-4 w-12 h-12 bg-white/90 hover:bg-white text-gray-800 rounded-full flex items-center justify-center transition">
                    <i class="fas fa-times text-xl"></i>
                </button>
            </div>
            <div class="p-8">
                <h2 id="modalTitle" class="text-2xl font-bold text-gray-800 mb-2"></h2>
                <div class="flex gap-4 text-sm text-gray-500 mb-6">
                    <span id="modalAuthor"></span>
                    <span id="modalDate"></span>
                    <span><i class="far fa-eye mr-1"></i><span id="modalViews">0</span></span>
                </div>
                <div id="modalContent" class="prose max-w-none text-gray-700 leading-relaxed"></div>
            </div>
        </div>
    </div>

    ${footerHtml()}

    <script>
        let currentPage = 1;
        let currentList = [];
        const limit = 12;

        document.addEventListener('DOMContentLoaded', () => {
            loadItems(1);
            updateAuthMenu();
        });

        function updateAuthMenu() {
            const token = localStorage.getItem('token');
            const userStr = localStorage.getItem('user');
            const authMenu = document.getElementById('authMenu');
            if (!authMenu) return;
            if (token && userStr) {
                const user = JSON.parse(userStr);
                let html = '';
                if (user.role === 'admin') html += '<a href="/admin" class="text-purple-600 hover:text-purple-700 font-bold mr-4"><i class="fas fa-cog mr-1"></i>관리자</a>';
                html += '<span class="text-gray-700 mr-2 font-bold">' + (user.name || '') + '님</span>';
                html += '<button onclick="logout()" class="text-gray-500 hover:text-red-600 text-sm">로그아웃</button>';
                authMenu.innerHTML = html;
            }
        }
        function logout() { localStorage.removeItem('token'); localStorage.removeItem('user'); location.href = '/'; }

        async function loadItems(page) {
            currentPage = page;
            const grid = document.getElementById('galleryGrid');
            try {
                const url = \`/api/posts?page=\${page}&limit=\${limit}&category=prototype&status=published\`;
                const res = await fetch(url);
                const result = await res.json();
                if (!result.success) {
                    grid.innerHTML = '<div class="col-span-full py-20 text-center text-red-500">데이터를 불러오는데 실패했습니다.</div>';
                    return;
                }
                currentList = result.data || [];
                if (currentList.length === 0) {
                    grid.innerHTML = '<div class="col-span-full py-20 text-center text-gray-500 font-medium">등록된 시제품 사진이 없습니다.</div>';
                    document.getElementById('pagination').innerHTML = '';
                    return;
                }
                grid.innerHTML = currentList.map((post, idx) => {
                    const img = (post.images && post.images.length) ? post.images[0] : '';
                    const title = (post.title || '').replace(/</g, '&lt;').replace(/>/g, '&gt;');
                    return \`
                        <div class="group bg-white rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 overflow-hidden transition-all cursor-pointer" onclick="openDetailByIndex(\${idx})">
                            <div class="aspect-square bg-gray-200 overflow-hidden">
                                \${img ? \`<img src="\${img}" class="w-full h-full object-cover group-hover:scale-105 transition duration-500" alt="">\` : \`<div class="w-full h-full flex items-center justify-center text-gray-400"><i class="fas fa-cube text-5xl"></i></div>\`}
                            </div>
                            <div class="p-5">
                                <h3 class="font-bold text-gray-800 truncate">\${title}</h3>
                                <p class="text-sm text-gray-500 mt-1">\${(post.author_name || '관리자')} · \${new Date(post.created_at).toLocaleDateString('ko-KR')}</p>
                            </div>
                        </div>
                    \`;
                }).join('');
                renderPagination(result.pagination);
            } catch (e) {
                console.error(e);
                grid.innerHTML = '<div class="col-span-full py-20 text-center text-red-500">오류가 발생했습니다.</div>';
            }
        }

        function renderPagination(p) {
            if (!p || p.totalPages <= 1) {
                document.getElementById('pagination').innerHTML = '';
                return;
            }
            let html = '<nav class="flex gap-2">';
            for (let i = 1; i <= p.totalPages; i++) {
                html += '<button onclick="loadItems(' + i + ')" class="px-4 py-2 rounded-lg ' + (i === p.page ? 'bg-primary-600 text-white' : 'bg-white border text-gray-700 hover:bg-gray-50') + '">' + i + '</button>';
            }
            html += '</nav>';
            document.getElementById('pagination').innerHTML = html;
        }

        function openDetailByIndex(idx) {
            const post = currentList[idx];
            if (!post) return;
            openDetail(post);
        }
        function openDetail(post) {
            const img = (post.images && post.images.length) ? post.images[0] : '';
            document.getElementById('modalImage').src = img || '';
            document.getElementById('modalImage').style.display = img ? 'block' : 'none';
            document.getElementById('modalTitle').textContent = post.title || '';
            document.getElementById('modalAuthor').textContent = post.author_name || '관리자';
            document.getElementById('modalDate').textContent = new Date(post.created_at).toLocaleDateString('ko-KR');
            document.getElementById('modalViews').textContent = post.views || 0;
            document.getElementById('modalContent').innerHTML = post.content || '<p class="text-gray-500">내용이 없습니다.</p>';
            document.getElementById('detailModal').classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        }

        function closeDetailModal() {
            document.getElementById('detailModal').classList.add('hidden');
            document.body.style.overflow = '';
        }
    </script>
</body>
</html>
`;
