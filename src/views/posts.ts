import { footerHtml } from './footer';
import { navigationHtml } from './components/navigation';

export const postsListHtml = `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>게시판 - 와우쓰리디홍대센터</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <script src="https://cdn.tiny.cloud/1/mvw2dv577uz6ru7oboooo1vpsgfgtj25kfa5sci9bblekdy3/tinymce/6/tinymce.min.js" referrerpolicy="origin"></script>
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
      .prose img {
        max-width: 100%;
        height: auto;
        border-radius: 0.5rem;
      }
    </style>
</head>
<body class="bg-gray-50">
    <!-- 네비게이션 -->
    ${navigationHtml('board')}


    <script>
        // 로그인 상태 확인 및 메뉴 업데이트
        document.addEventListener('DOMContentLoaded', () => {
            const token = localStorage.getItem('token');
            const userStr = localStorage.getItem('user');
            const authMenu = document.getElementById('authMenu');
            
            if (token && userStr && authMenu) {
                const user = JSON.parse(userStr);
                let menuHtml = '';
                
                if (user.role === 'admin') {
                    menuHtml += \`
                        <a href="/admin" class="text-purple-600 hover:text-purple-700 font-bold whitespace-nowrap mr-4">
                            <i class="fas fa-cog mr-1"></i> 관리자
                        </a>
                    \`;
                }
                
                menuHtml += \`
                    <span class="text-gray-700 mr-2">
                        <span class="font-bold">\${user.name}</span>님
                    </span>
                    <button onclick="logout()" class="text-gray-500 hover:text-red-600 font-medium whitespace-nowrap">
                        <i class="fas fa-sign-out-alt mr-1"></i> 로그아웃
                    </button>
                \`;
                
                authMenu.innerHTML = menuHtml;
            }
        });

        function logout() {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            location.href = '/';
        }
    </script>
    <script src="/static/academic-menu.js"></script>

    <!-- \ud5e4\ub354 -->
    <div class="bg-gradient-to-r from-gray-700 to-gray-900 text-white py-16">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 class="text-4xl font-bold mb-4">게시판</h1>
            <p class="text-xl text-gray-300">공지사항, FAQ, 포트폴리오 등 다양한 소식을 전해드립니다.</p>
        </div>
    </div>

    <!-- 메인 컨텐츠 -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <!-- 탭 메뉴 (순서: 공지사항 → FAQ → Q&A → 포트폴리오) -->
        <div class="flex border-b border-gray-200 mb-8 overflow-x-auto">
            <button onclick="filterCategory('notice')" class="tab-btn px-6 py-3 text-sm font-medium text-gray-500 hover:text-gray-700 border-b-2 border-transparent whitespace-nowrap" data-category="notice">
                공지사항
            </button>
            <button onclick="filterCategory('faq')" class="tab-btn px-6 py-3 text-sm font-medium text-gray-500 hover:text-gray-700 border-b-2 border-transparent whitespace-nowrap" data-category="faq">
                FAQ
            </button>
            <button onclick="filterCategory('qna')" class="tab-btn px-6 py-3 text-sm font-medium text-gray-500 hover:text-gray-700 border-b-2 border-transparent whitespace-nowrap" data-category="qna">
                Q&A
            </button>
            <button onclick="filterCategory('portfolio')" class="tab-btn px-6 py-3 text-sm font-medium text-gray-500 hover:text-gray-700 border-b-2 border-transparent whitespace-nowrap" data-category="portfolio">
                포트폴리오
            </button>
        </div>

        <!-- 검색 및 글쓰기 -->
        <div class="flex justify-between items-center mb-6">
            <div class="relative w-full max-w-xs">
                <input type="text" id="searchInput" placeholder="검색어 입력" onkeyup="if(event.key === 'Enter') loadPosts()" class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                <i class="fas fa-search absolute left-3 top-3 text-gray-400"></i>
            </div>
            <button id="writeBtn" onclick="openWriteModal()" class="hidden px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition flex items-center">
                <i class="fas fa-pen mr-2"></i> 글쓰기
            </button>
        </div>

        <!-- 게시글 목록 -->
        <div id="postsList" class="space-y-4">
            <!-- 로딩 중 표시 -->
            <div class="text-center py-12">
                <i class="fas fa-spinner fa-spin text-4xl text-primary-500 mb-4"></i>
                <p class="text-gray-500">게시글을 불러오는 중입니다...</p>
            </div>
        </div>
        
        <!-- 페이지네이션 -->
        <div id="pagination" class="mt-12 flex justify-center"></div>
    </div>

    <!-- 게시글 상세 모달 -->
    <div id="postDetailModal" class="fixed inset-0 bg-black bg-opacity-50 hidden z-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div class="p-6 border-b border-gray-200 flex justify-between items-start">
                <div class="w-full">
                    <div class="flex items-center gap-2 mb-2">
                        <span class="px-2.5 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded-full" id="detailCategory"></span>
                        <span class="text-gray-400 text-sm" id="detailDate"></span>
                    </div>
                    <h2 class="text-2xl font-bold text-gray-800 break-words" id="detailTitle"></h2>
                    <div class="flex items-center gap-4 mt-2 text-sm text-gray-500">
                        <span id="detailAuthor"></span>
                        <span><i class="far fa-eye mr-1"></i> <span id="detailViews"></span></span>
                    </div>
                </div>
                <button onclick="closeModal('postDetailModal')" class="text-gray-400 hover:text-gray-600 p-2 flex-shrink-0 ml-4">
                    <i class="fas fa-times text-2xl"></i>
                </button>
            </div>
            <div class="p-6">
                <div class="prose max-w-none text-gray-800 leading-relaxed min-h-[200px]" id="detailContent"></div>
                
                <!-- 댓글 섹션 (추후 구현 가능) -->
                <!--
                <div class="mt-8 pt-8 border-t border-gray-100">
                    <h3 class="text-lg font-bold text-gray-800 mb-4">댓글</h3>
                    ...
                </div>
                -->
            </div>
            <div class="p-6 bg-gray-50 border-t border-gray-200 flex justify-end">
                <button onclick="closeModal('postDetailModal')" class="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition">
                    닫기
                </button>
            </div>
        </div>
    </div>

    <!-- 글쓰기 모달 -->
    <div id="writeModal" class="fixed inset-0 bg-black bg-opacity-50 hidden z-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div class="p-6 border-b border-gray-200 flex justify-between items-center">
                <h3 class="text-xl font-bold text-gray-800">게시글 작성</h3>
                <button onclick="closeModal('writeModal')" class="text-gray-500 hover:text-gray-700">
                    <i class="fas fa-times text-xl"></i>
                </button>
            </div>
            <div class="p-6">
                <form id="writeForm" onsubmit="handleWrite(event)">
                    <input type="hidden" name="category" id="writeCategory">
                    <div class="space-y-4">
                        <div>
                            <label class="block text-gray-700 font-medium mb-2">제목</label>
                            <input type="text" name="title" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                        </div>
                        <div>
                            <label class="block text-gray-700 font-medium mb-2">내용</label>
                            <textarea name="content" id="writeContent" rows="15" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"></textarea>
                        </div>
                    </div>
                    <div class="mt-6 flex justify-end space-x-3">
                        <button type="button" onclick="closeModal('writeModal')" class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">취소</button>
                        <button type="submit" class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">등록하기</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <!-- 푸터 -->
    <!-- 푸터 -->
    ${footerHtml()}

    <script>
        let currentCategory = 'notice';
        let currentPage = 1;
        const itemsPerPage = 10;

        document.addEventListener('DOMContentLoaded', () => {
            // URL 파라미터 확인
            const urlParams = new URLSearchParams(window.location.search);
            const categoryParam = urlParams.get('category');
            if (categoryParam) {
                currentCategory = categoryParam;
            }
            
            updateTabButtons();
            checkWritePermission();
            loadPosts();
        });

        function filterCategory(category) {
            currentCategory = category;
            currentPage = 1;
            
            // URL 업데이트
            const url = new URL(window.location);
            url.searchParams.set('category', category);
            window.history.pushState({}, '', url);
            
            updateTabButtons();
            checkWritePermission();
            loadPosts();
        }

        function updateTabButtons() {
            document.querySelectorAll('.tab-btn').forEach(btn => {
                if (btn.dataset.category === currentCategory) {
                    btn.classList.remove('text-gray-500', 'border-transparent');
                    btn.classList.add('text-primary-600', 'border-primary-600');
                } else {
                    btn.classList.add('text-gray-500', 'border-transparent');
                    btn.classList.remove('text-primary-600', 'border-primary-600');
                }
            });
        }

        function checkWritePermission() {
            const token = localStorage.getItem('token');
            const userStr = localStorage.getItem('user');
            const writeBtn = document.getElementById('writeBtn');
            
            if (!token || !userStr) {
                writeBtn.classList.add('hidden');
                return;
            }
            
            const user = JSON.parse(userStr);
            
            // 공지사항, FAQ: 관리자만 작성
            if (currentCategory === 'notice' || currentCategory === 'faq') {
                if (user.role === 'admin') writeBtn.classList.remove('hidden');
                else writeBtn.classList.add('hidden');
                return;
            }
            // Q&A, 포트폴리오(게시글): 관리자·수강생 작성 가능
            if (currentCategory === 'qna' || currentCategory === 'portfolio') {
                writeBtn.classList.remove('hidden');
            } else {
                writeBtn.classList.add('hidden');
            }
        }

        async function loadPosts(page = 1) {
            currentPage = page;
            const search = document.getElementById('searchInput').value;
            
            try {
                let url = \`/api/posts?page=\${page}&limit=\${itemsPerPage}&category=\${currentCategory}&status=published\`;
                if (search) url += '&search=' + encodeURIComponent(search);

                const response = await fetch(url);
                const result = await response.json();
                
                const list = document.getElementById('postsList');
                
                if (!result.success) {
                    list.innerHTML = \`
                        <div class="text-center py-12 bg-white rounded-lg shadow-sm">
                            <i class="fas fa-exclamation-circle text-4xl text-red-400 mb-4"></i>
                            <p class="text-gray-600">데이터를 불러오는데 실패했습니다.</p>
                        </div>
                    \`;
                    return;
                }

                if (result.data.length === 0) {
                    list.innerHTML = \`
                        <div class="text-center py-16 bg-white rounded-lg shadow-sm">
                            <i class="fas fa-clipboard text-4xl text-gray-300 mb-4"></i>
                            <p class="text-lg text-gray-600 font-medium">등록된 게시글이 없습니다.</p>
                        </div>
                    \`;
                    document.getElementById('pagination').innerHTML = '';
                    return;
                }

                // 포트폴리오는 카드형, 나머지는 리스트형
                if (currentCategory === 'portfolio') {
                    list.innerHTML = \`
                        <div class="grid md:grid-cols-3 gap-6">
                            \${result.data.map(post => \`
                                <div class="bg-white rounded-lg shadow-sm hover:shadow-md transition cursor-pointer overflow-hidden border border-gray-100" onclick='openPostDetail(\${JSON.stringify(post).replace(/'/g, "&#39;")})'>
                                    <div class="h-48 bg-gray-200 overflow-hidden">
                                        \${post.images && post.images.length > 0 
                                            ? \`<img src="\${post.images[0]}" class="w-full h-full object-cover">\`
                                            : \`<div class="w-full h-full flex items-center justify-center text-gray-400"><i class="fas fa-image text-3xl"></i></div>\`
                                        }
                                    </div>
                                    <div class="p-4">
                                        <h3 class="font-bold text-gray-800 mb-2 truncate">\${post.title}</h3>
                                        <div class="flex justify-between text-xs text-gray-500">
                                            <span>\${post.author_name || '익명'}</span>
                                            <span>\${new Date(post.created_at).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>
                            \`).join('')}
                        </div>
                    \`;
                } else {
                    list.innerHTML = result.data.map(post => \`
                        <div class="bg-white rounded-lg shadow-sm hover:shadow-md transition p-5 border border-gray-100 cursor-pointer \${post.pinned ? 'bg-red-50 border-red-100' : ''}" onclick='openPostDetail(\${JSON.stringify(post).replace(/'/g, "&#39;")})'>
                            <div class="flex justify-between items-start">
                                <div class="flex-1 min-w-0">
                                    <div class="flex items-center gap-2 mb-1">
                                        \${post.pinned ? '<span class="px-2 py-0.5 bg-red-100 text-red-600 text-xs font-bold rounded-full">공지</span>' : ''}
                                        <h3 class="text-lg font-bold text-gray-800 truncate">\${post.title}</h3>
                                    </div>
                                    <p class="text-gray-500 text-sm line-clamp-2 mb-2">\${stripHtml(post.content)}</p>
                                    <div class="flex items-center gap-4 text-xs text-gray-400">
                                        <span>\${post.author_name || '익명'}</span>
                                        <span>\${new Date(post.created_at).toLocaleDateString()}</span>
                                        <span><i class="far fa-eye mr-1"></i>\${post.views}</span>
                                    </div>
                                </div>
                                \${post.images && post.images.length > 0 ? \`
                                    <div class="ml-4 w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                        <img src="\${post.images[0]}" class="w-full h-full object-cover">
                                    </div>
                                \` : ''}
                            </div>
                        </div>
                    \`).join('');
                }

                renderPagination(result.pagination);
                
            } catch (error) {
                console.error('Error:', error);
                list.innerHTML = \`
                    <div class="text-center py-12 bg-white rounded-lg shadow-sm">
                        <i class="fas fa-exclamation-triangle text-4xl text-red-400 mb-4"></i>
                        <p class="text-gray-600">오류가 발생했습니다.</p>
                    </div>
                \`;
            }
        }

        function renderPagination(pagination) {
            const { page, totalPages } = pagination;
            let html = '';
            
            if (totalPages > 1) {
                html += \`
                    <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                        <button onclick="loadPosts(\${page - 1})" \${page === 1 ? 'disabled' : ''} class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 \${page === 1 ? 'cursor-not-allowed opacity-50' : ''}">
                            <span class="sr-only">Previous</span>
                            <i class="fas fa-chevron-left"></i>
                        </button>
                \`;

                for (let i = 1; i <= totalPages; i++) {
                    if (i === page) {
                        html += \`
                            <button aria-current="page" class="z-10 bg-primary-50 border-primary-500 text-primary-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                                \${i}
                            </button>
                        \`;
                    } else {
                        html += \`
                            <button onclick="loadPosts(\${i})" class="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                                \${i}
                            </button>
                        \`;
                    }
                }

                html += \`
                        <button onclick="loadPosts(\${page + 1})" \${page === totalPages ? 'disabled' : ''} class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 \${page === totalPages ? 'cursor-not-allowed opacity-50' : ''}">
                            <span class="sr-only">Next</span>
                            <i class="fas fa-chevron-right"></i>
                        </button>
                    </nav>
                \`;
            }
            
            document.getElementById('pagination').innerHTML = html;
        }

        async function openPostDetail(post) {
            // 상세 정보 조회 (조회수 증가 등을 위해 API 호출)
            try {
                const response = await fetch('/api/posts/' + post.id);
                const result = await response.json();
                
                if (result.success) {
                    const detail = result.data;
                    document.getElementById('detailTitle').textContent = detail.title;
                    document.getElementById('detailCategory').textContent = getCategoryName(detail.category);
                    document.getElementById('detailDate').textContent = new Date(detail.created_at).toLocaleDateString();
                    document.getElementById('detailAuthor').textContent = detail.author_name || '익명';
                    document.getElementById('detailViews').textContent = detail.views;
                    document.getElementById('detailContent').innerHTML = detail.content || '';
                    
                    document.getElementById('postDetailModal').classList.remove('hidden');
                    document.body.style.overflow = 'hidden';
                }
            } catch (error) {
                console.error('Error:', error);
            }
        }

        function openWriteModal() {
            document.getElementById('writeForm').reset();
            document.getElementById('writeCategory').value = currentCategory;
            document.getElementById('writeModal').classList.remove('hidden');
            
            if (!tinymce.get('writeContent')) {
                initTinyMCE();
            } else {
                tinymce.get('writeContent').setContent('');
            }
        }

        function initTinyMCE() {
            tinymce.init({
                selector: '#writeContent',
                height: 400,
                menubar: false,
                plugins: [
                    'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                    'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                    'insertdatetime', 'media', 'table', 'help', 'wordcount'
                ],
                toolbar: 'undo redo | blocks | ' +
                    'bold italic backcolor | alignleft aligncenter ' +
                    'alignright alignjustify | bullist numlist outdent indent | ' +
                    'removeformat | image code | help',
                content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                images_upload_handler: (blobInfo, progress) => new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = () => {
                        resolve(reader.result);
                    };
                    reader.onerror = () => {
                        reject('Image upload failed');
                    };
                    reader.readAsDataURL(blobInfo.blob());
                })
            });
        }

        async function handleWrite(e) {
            e.preventDefault();
            
            const form = e.target;
            const formData = new FormData(form);
            
            if (tinymce.get('writeContent')) {
                tinymce.triggerSave();
                formData.set('content', tinymce.get('writeContent').getContent());
            }
            
            const data = Object.fromEntries(formData.entries());
            
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('/api/posts', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token
                    },
                    body: JSON.stringify(data)
                });
                
                const result = await response.json();
                
                if (result.success) {
                    alert('등록되었습니다.');
                    closeModal('writeModal');
                    loadPosts();
                } else {
                    alert('오류: ' + result.error);
                }
            } catch (error) {
                console.error('Error:', error);
                alert('등록 중 오류가 발생했습니다.');
            }
        }

        function closeModal(id) {
            document.getElementById(id).classList.add('hidden');
            document.body.style.overflow = '';
        }

        function getCategoryName(category) {
            const names = {
                'notice': '공지사항',
                'faq': 'FAQ',
                'portfolio': '포트폴리오',
                'qna': 'Q&A'
            };
            return names[category] || category;
        }

        function stripHtml(html) {
            if (!html) return '';
            const tmp = document.createElement("DIV");
            tmp.innerHTML = html;
            return tmp.textContent || tmp.innerText || "";
        }
    </script>
</body>
</html>
`;
