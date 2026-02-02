import { hrdSidebar } from './components/hrd_sidebar';

export const adminPrototypeGalleryHtml = (sidebar: string) => `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>시제품 제작사진 관리 - 와우쓰리디홍대센터</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <script src="https://cdn.tiny.cloud/1/mvw2dv577uz6ru7oboooo1vpsgfgtj25kfa5sci9bblekdy3/tinymce/6/tinymce.min.js" referrerpolicy="origin"></script>
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
<body class="bg-gray-50">
    <div class="flex h-screen overflow-hidden">
        ${sidebar}
        <div class="flex-1 flex flex-col overflow-hidden bg-gray-50">
            <div class="bg-white border-b border-gray-200 px-8 py-6">
                <div class="flex justify-between items-center">
                    <div>
                        <h1 class="text-2xl font-bold text-gray-800">시제품 제작사진 관리</h1>
                        <p class="text-gray-600 mt-1">시제품 갤러리 게시글을 관리합니다.</p>
                    </div>
                    <button onclick="openModal(null)" class="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition flex items-center">
                        <i class="fas fa-plus mr-2"></i> 시제품 등록
                    </button>
                </div>
            </div>
            <main class="flex-1 overflow-y-auto p-8 custom-scrollbar">
                <div class="bg-white rounded-lg shadow-sm mb-6 p-4">
                    <div class="flex gap-4 items-center">
                        <div class="relative flex-1 max-w-md">
                            <input type="text" id="searchInput" placeholder="제목/내용 검색" onkeyup="if(event.key === 'Enter') loadPosts(1)" class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500">
                            <i class="fas fa-search absolute left-3 top-3 text-gray-400"></i>
                        </div>
                        <button onclick="loadPosts(1)" class="p-2 text-gray-600 hover:text-amber-600"><i class="fas fa-sync-alt"></i></button>
                    </div>
                </div>
                <div class="bg-white rounded-lg shadow overflow-hidden">
                    <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">상태</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">제목</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">작성자</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">조회수</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">작성일</th>
                                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">관리</th>
                            </tr>
                        </thead>
                        <tbody id="tableBody" class="bg-white divide-y divide-gray-200">
                            <tr>
                                <td colspan="6" class="px-6 py-12 text-center text-gray-500">
                                    <i class="fas fa-spinner fa-spin mr-2"></i> 데이터를 불러오는 중...
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="mt-4 flex justify-center" id="pagination"></div>
            </main>
        </div>
    </div>

    <!-- 작성/수정 모달 -->
    <div id="createPostModal" class="fixed inset-0 bg-black bg-opacity-50 hidden z-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div class="p-6 border-b border-gray-200 flex justify-between items-center">
                <h3 class="text-xl font-bold text-gray-800" id="modalTitle">시제품 등록</h3>
                <button onclick="closeModal('createPostModal')" class="text-gray-500 hover:text-gray-700"><i class="fas fa-times text-xl"></i></button>
            </div>
            <div class="p-6">
                <form id="createPostForm" onsubmit="handleSavePost(event)">
                    <input type="hidden" name="id" id="postId">
                    <input type="hidden" name="category" id="postCategory" value="prototype">
                    <div class="space-y-4">
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-gray-700 font-medium mb-2">상태</label>
                                <select name="status" id="postStatus" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500">
                                    <option value="published">공개</option>
                                    <option value="draft">임시저장</option>
                                    <option value="hidden">비공개</option>
                                </select>
                            </div>
                            <div class="flex items-center pt-8">
                                <input type="checkbox" name="pinned" id="postPinned" class="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500">
                                <label for="postPinned" class="ml-2 block text-gray-700 font-medium">상단 고정</label>
                            </div>
                        </div>
                        <div>
                            <label class="block text-gray-700 font-medium mb-2">제목</label>
                            <input type="text" name="title" id="postTitle" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500" placeholder="시제품/작품 제목">
                        </div>
                        <div>
                            <label class="block text-gray-700 font-medium mb-2">내용 (이미지 첨부 가능)</label>
                            <textarea name="content" id="postContent" rows="15" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"></textarea>
                        </div>
                    </div>
                    <div class="mt-6 flex justify-end space-x-3">
                        <button type="button" onclick="closeModal('createPostModal')" class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">취소</button>
                        <button type="submit" class="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700">저장하기</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <script>
        let currentPage = 1;
        const itemsPerPage = 10;

        document.addEventListener('DOMContentLoaded', () => {
            loadPosts(1);
        });

        function openModal(post) {
            document.getElementById('postCategory').value = 'prototype';
            if (post) {
                document.getElementById('modalTitle').textContent = '시제품 수정';
                document.getElementById('postId').value = post.id;
                document.getElementById('postTitle').value = post.title || '';
                document.getElementById('postStatus').value = post.status || 'published';
                document.getElementById('postPinned').checked = post.pinned === 1;
                setTinyContent(post.content || '');
            } else {
                document.getElementById('modalTitle').textContent = '시제품 등록';
                document.getElementById('createPostForm').reset();
                document.getElementById('postId').value = '';
                document.getElementById('postCategory').value = 'prototype';
                document.getElementById('postStatus').value = 'published';
                setTinyContent('');
            }
            document.getElementById('createPostModal').classList.remove('hidden');
        }

        function setTinyContent(html) {
            if (tinymce.get('postContent')) {
                tinymce.get('postContent').setContent(html);
            } else {
                initTinyMCE(html);
            }
        }

        const IMAGE_MAX = 1200;
        const IMAGE_QUALITY = 0.82;
        function resizeImageBlob(blob) {
            return new Promise((resolve, reject) => {
                const img = new Image();
                const url = URL.createObjectURL(blob);
                img.onload = () => {
                    URL.revokeObjectURL(url);
                    let w = img.naturalWidth, h = img.naturalHeight;
                    if (w <= IMAGE_MAX && h <= IMAGE_MAX && blob.size < 200000) { resolve(blob); return; }
                    const r = Math.min(IMAGE_MAX / w, IMAGE_MAX / h, 1);
                    w = Math.round(w * r); h = Math.round(h * r);
                    const canvas = document.createElement('canvas');
                    canvas.width = w; canvas.height = h;
                    canvas.getContext('2d').drawImage(img, 0, 0, w, h);
                    canvas.toBlob(b => b ? resolve(b) : reject(), 'image/jpeg', IMAGE_QUALITY);
                };
                img.onerror = () => { URL.revokeObjectURL(url); reject(); };
                img.src = url;
            });
        }
        async function uploadPostImage(blob) {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('로그인이 필요합니다.');
            const resized = await resizeImageBlob(blob);
            const file = new File([resized], 'post_' + Date.now() + '.jpg', { type: 'image/jpeg' });
            const fd = new FormData();
            fd.append('file', file);
            fd.append('category', 'images');
            fd.append('folder', 'posts');
            const res = await fetch('/api/upload', { method: 'POST', headers: { 'Authorization': 'Bearer ' + token }, body: fd });
            const json = await res.json();
            if (!json.success) throw new Error(json.error || '업로드 실패');
            return json.data.url || json.data.file_url || '';
        }
        function initTinyMCE(initialContent) {
            tinymce.init({
                selector: '#postContent',
                height: 400,
                menubar: true,
                plugins: 'advlist autolink lists link image charmap preview anchor searchreplace visualblocks code fullscreen insertdatetime media table',
                toolbar: 'undo redo | blocks | bold italic | alignleft aligncenter alignright | bullist numlist | image code',
                content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                images_upload_handler: (blobInfo, progress) => uploadPostImage(blobInfo.blob()),
                setup: function(editor) {
                    editor.on('init', function() { editor.setContent(initialContent); });
                }
            });
        }
        function closeModal(id) {
            document.getElementById(id).classList.add('hidden');
        }

        let currentList = [];
        async function loadPosts(page) {
            currentPage = page;
            const search = document.getElementById('searchInput').value;
            let url = '/api/posts?page=' + page + '&limit=' + itemsPerPage + '&category=prototype';
            if (search) url += '&search=' + encodeURIComponent(search);
            try {
                const res = await fetch(url);
                const result = await res.json();
                const tbody = document.getElementById('tableBody');
                if (!result.success) {
                    tbody.innerHTML = '<tr><td colspan="6" class="px-6 py-4 text-center text-red-500">데이터를 불러오는데 실패했습니다.</td></tr>';
                    return;
                }
                currentList = result.data || [];
                if (currentList.length === 0) {
                    tbody.innerHTML = '<tr><td colspan="6" class="px-6 py-12 text-center text-gray-500">등록된 시제품이 없습니다.</td></tr>';
                    document.getElementById('pagination').innerHTML = '';
                    return;
                }
                tbody.innerHTML = currentList.map((post, idx) => \`
                    <tr class="hover:bg-gray-50 \${post.pinned ? 'bg-amber-50' : ''}">
                        <td class="px-6 py-4 whitespace-nowrap">
                            <span class="px-2 py-1 text-xs font-semibold rounded-full \${post.status === 'published' ? 'bg-green-100 text-green-800' : post.status === 'draft' ? 'bg-gray-100 text-gray-800' : 'bg-red-100 text-red-800'}">
                                \${post.status === 'published' ? '공개' : post.status === 'draft' ? '임시' : '비공개'}
                            </span>
                            \${post.pinned ? '<span class="ml-1 px-2 py-1 text-xs font-semibold rounded-full bg-amber-100 text-amber-800"><i class="fas fa-thumbtack mr-1"></i>고정</span>' : ''}
                        </td>
                        <td class="px-6 py-4">
                            <div class="text-sm font-medium text-gray-900">\${(post.title || '').substring(0, 50)}\${(post.title || '').length > 50 ? '...' : ''}</div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">\${post.author_name || '-'}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">\${post.views || 0}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">\${new Date(post.created_at).toLocaleDateString('ko-KR')}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-right text-sm">
                            <button onclick="editPostByIndex(\${idx})" class="text-amber-600 hover:text-amber-800 mr-3"><i class="fas fa-edit"></i> 수정</button>
                            <button onclick="deletePost(\${post.id})" class="text-red-600 hover:text-red-800"><i class="fas fa-trash"></i> 삭제</button>
                        </td>
                    </tr>
                \`).join('');
                const p = result.pagination;
                if (p && p.totalPages > 1) {
                    let html = '<nav class="flex gap-2">';
                    for (let i = 1; i <= p.totalPages; i++) {
                        html += '<button onclick="loadPosts(' + i + ')" class="px-4 py-2 rounded-lg ' + (i === p.page ? 'bg-amber-600 text-white' : 'bg-white border text-gray-700 hover:bg-gray-50') + '">' + i + '</button>';
                    }
                    html += '</nav>';
                    document.getElementById('pagination').innerHTML = html;
                } else {
                    document.getElementById('pagination').innerHTML = '';
                }
            } catch (e) {
                console.error(e);
                document.getElementById('tableBody').innerHTML = '<tr><td colspan="6" class="px-6 py-4 text-center text-red-500">오류가 발생했습니다.</td></tr>';
            }
        }

        function editPostByIndex(idx) {
            const post = currentList[idx];
            if (post) openModal(post);
        }

        async function handleSavePost(e) {
            e.preventDefault();
            const data = {
                id: document.getElementById('postId').value || null,
                category: 'prototype',
                title: document.getElementById('postTitle').value,
                status: document.getElementById('postStatus').value,
                pinned: document.getElementById('postPinned').checked,
                content: tinymce.get('postContent') ? tinymce.get('postContent').getContent() : '',
                images: []
            };
            if (tinymce.get('postContent')) {
                const content = tinymce.get('postContent').getContent();
                const div = document.createElement('div');
                div.innerHTML = content;
                const imgs = div.getElementsByTagName('img');
                for (let i = 0; i < imgs.length; i++) data.images.push(imgs[i].src);
            }
            try {
                const token = localStorage.getItem('token');
                const url = data.id ? '/api/posts/' + data.id : '/api/posts';
                const method = data.id ? 'PUT' : 'POST';
                const res = await fetch(url, {
                    method: method,
                    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
                    body: JSON.stringify(data)
                });
                if (res.status === 401) {
                    alert('로그인 세션이 만료되었습니다.');
                    window.location.href = '/login';
                    return;
                }
                const result = await res.json();
                if (result.success) {
                    alert(data.id ? '수정되었습니다.' : '등록되었습니다.');
                    closeModal('createPostModal');
                    loadPosts(currentPage);
                } else {
                    alert('오류: ' + (result.error || '저장 실패'));
                }
            } catch (err) {
                console.error(err);
                alert('저장 중 오류가 발생했습니다.');
            }
        }

        async function deletePost(id) {
            if (!confirm('이 시제품 게시글을 삭제하시겠습니까?')) return;
            try {
                const token = localStorage.getItem('token');
                const res = await fetch('/api/posts/' + id, { method: 'DELETE', headers: { 'Authorization': 'Bearer ' + token } });
                if (res.status === 401) {
                    alert('로그인 세션이 만료되었습니다.');
                    window.location.href = '/login';
                    return;
                }
                const result = await res.json();
                if (result.success) {
                    alert('삭제되었습니다.');
                    loadPosts(currentPage);
                } else {
                    alert('오류: ' + (result.error || '삭제 실패'));
                }
            } catch (err) {
                console.error(err);
                alert('삭제 중 오류가 발생했습니다.');
            }
        }
    </script>
</body>
</html>
`;
