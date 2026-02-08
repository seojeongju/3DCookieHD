import { hrdSidebar } from './components/hrd_sidebar';

export const adminEducationGalleryHtml = (sidebar: string) => `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>교육사진 갤러리 관리 - 와우쓰리디홍대센터</title>
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
            <div class="bg-white border-b border-gray-200 px-8 py-6 shadow-sm">
                <div class="flex flex-wrap justify-between items-start gap-4">
                    <div>
                        <h1 class="text-2xl font-bold text-gray-800">교육사진 갤러리 관리</h1>
                        <p class="text-gray-600 mt-1 text-sm">교육사진 갤러리 게시글을 관리합니다.</p>
                    </div>
                    <div class="flex gap-2 flex-wrap">
                        <a href="/education-photos?filter=education_photo" target="_blank" rel="noopener" class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition flex items-center text-sm font-medium shadow-sm border border-gray-200">
                            <i class="fas fa-external-link-alt mr-2"></i> 공개 갤러리 미리보기
                        </a>
                        <button type="button" onclick="openBulkImageModal()" class="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition flex items-center text-sm font-medium shadow-sm">
                            <i class="fas fa-link mr-2"></i> 이미지 URL 일괄 입력
                        </button>
                        <button type="button" onclick="openCsvImportModal()" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center text-sm font-medium shadow-sm">
                            <i class="fas fa-file-csv mr-2"></i> CSV 일괄 등록
                        </button>
                        <button type="button" onclick="openModal(null)" class="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition flex items-center text-sm font-medium shadow-sm">
                            <i class="fas fa-plus mr-2"></i> 교육사진 등록
                        </button>
                    </div>
                </div>
            </div>
            <main class="flex-1 overflow-y-auto p-8 custom-scrollbar">
                <div class="bg-white rounded-xl shadow-sm border border-gray-200 mb-6 p-4">
                    <div class="flex flex-wrap gap-3 items-center">
                        <div class="relative flex-1 min-w-[200px] max-w-md">
                            <input type="text" id="searchInput" placeholder="제목/내용 검색" onkeyup="if(event.key === 'Enter') loadPosts(1)" class="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500">
                            <i class="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                        </div>
                        <button type="button" onclick="loadPosts(1)" class="p-2.5 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-amber-600 transition" title="새로고침"><i class="fas fa-sync-alt"></i></button>
                        <div class="flex items-center gap-2 text-sm text-gray-500">
                            <span id="searchResultText"></span>
                            <label class="flex items-center gap-1.5">
                                <span>페이지당</span>
                                <select id="rowsPerPage" onchange="setRowsPerPage(parseInt(this.value, 10))" class="border border-gray-300 rounded-lg px-2 py-1.5 text-sm focus:ring-2 focus:ring-amber-500">
                                    <option value="10">10</option>
                                    <option value="20">20</option>
                                    <option value="30">30</option>
                                    <option value="50">50</option>
                                </select>
                                <span>건</span>
                            </label>
                        </div>
                    </div>
                </div>
                <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden min-h-[320px]">
                    <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">상태</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">제목</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">작성자</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">조회수</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">작성일</th>
                                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">관리</th>
                            </tr>
                        </thead>
                        <tbody id="tableBody" class="bg-white divide-y divide-gray-200">
                            <tr>
                                <td colspan="6" class="px-6 py-16 text-center text-gray-500">
                                    <i class="fas fa-spinner fa-spin mr-2"></i> 데이터를 불러오는 중...
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div id="paginationWrap" class="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div id="paginationRange" class="text-sm text-gray-600"></div>
                    <nav id="pagination" class="flex flex-wrap items-center justify-center gap-1"></nav>
                </div>
            </main>
        </div>
    </div>

    <!-- CSV 일괄 등록 모달 -->
    <div id="csvImportModal" class="fixed inset-0 bg-black bg-opacity-50 hidden z-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <div class="p-6 border-b border-gray-200 flex justify-between items-center">
                <h3 class="text-xl font-bold text-gray-800">구 사이트 CSV 일괄 등록</h3>
                <button onclick="closeCsvImportModal()" class="text-gray-500 hover:text-gray-700"><i class="fas fa-times text-xl"></i></button>
            </div>
            <div class="p-6 overflow-y-auto flex-1">
                <p class="text-gray-600 text-sm mb-4">구 사이트 관리자에서 <strong>3D프린팅 교육사진</strong> 목록을 CSV로 다운받은 파일을 선택하세요. 제목·등록자·등록일자·이미지 URL(있으면) 컬럼을 인식해 교육사진으로 등록합니다.</p>
                <div class="mb-4">
                    <label class="block text-gray-700 font-medium mb-2">CSV 파일 선택</label>
                    <input type="file" id="csvFileInput" accept=".csv,text/csv,application/csv" class="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100">
                </div>
                <div id="csvPreview" class="hidden mb-4 p-4 bg-gray-50 rounded-lg text-sm">
                    <span id="csvPreviewText"></span>
                </div>
                <div id="csvProgress" class="hidden mb-4">
                    <div class="flex justify-between text-sm text-gray-600 mb-1">
                        <span id="csvProgressText">0 / 0 등록 중...</span>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-2">
                        <div id="csvProgressBar" class="bg-blue-600 h-2 rounded-full transition-all" style="width: 0%"></div>
                    </div>
                </div>
                <div id="csvResult" class="hidden p-4 rounded-lg text-sm"></div>
            </div>
            <div class="p-6 border-t border-gray-200 flex justify-end gap-2">
                <button type="button" onclick="closeCsvImportModal()" class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">닫기</button>
                <button type="button" id="csvStartBtn" onclick="startCsvImport()" disabled class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed">등록 시작</button>
            </div>
        </div>
    </div>

    <!-- 이미지 URL 일괄 입력 모달 (CSV로 등록한 뒤 사진만 채울 때) -->
    <div id="bulkImageModal" class="fixed inset-0 bg-black bg-opacity-50 hidden z-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <div class="p-6 border-b border-gray-200 flex justify-between items-center">
                <h3 class="text-xl font-bold text-gray-800">이미지 URL 일괄 입력</h3>
                <button onclick="closeBulkImageModal()" class="text-gray-500 hover:text-gray-700"><i class="fas fa-times text-xl"></i></button>
            </div>
            <div class="p-6 overflow-y-auto flex-1">
                <p class="text-gray-600 text-sm mb-4">CSV로 등록한 글에 <strong>사진이 없을 때</strong> 사용하세요. 구 사이트에서 각 게시글 상세 페이지를 열고 이미지에 마우스 오른쪽 → <strong>이미지 주소 복사</strong>한 뒤, 아래에 <strong>목록 순서대로 한 줄에 하나씩</strong> 붙여넣으세요.</p>
                <div id="bulkImageListInfo" class="mb-2 text-sm text-gray-500">교육사진 목록 불러오는 중...</div>
                <label class="block text-gray-700 font-medium mb-2">이미지 URL (한 줄에 하나)</label>
                <textarea id="bulkImageUrls" rows="12" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 font-mono text-sm" placeholder="https://example.com/photo1.jpg&#10;https://example.com/photo2.jpg"></textarea>
                <div id="bulkImageProgress" class="hidden mt-4">
                    <div class="flex justify-between text-sm text-gray-600 mb-1"><span id="bulkImageProgressText">0 / 0 적용 중...</span></div>
                    <div class="w-full bg-gray-200 rounded-full h-2"><div id="bulkImageProgressBar" class="bg-emerald-600 h-2 rounded-full transition-all" style="width: 0%"></div></div>
                </div>
                <div id="bulkImageResult" class="hidden mt-4 p-4 rounded-lg text-sm"></div>
            </div>
            <div class="p-6 border-t border-gray-200 flex justify-end gap-2">
                <button type="button" onclick="closeBulkImageModal()" class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">닫기</button>
                <button type="button" id="bulkImageApplyBtn" onclick="applyBulkImageUrls()" class="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">적용하기</button>
            </div>
        </div>
    </div>

    <!-- 작성/수정 모달 -->
    <div id="createPostModal" class="fixed inset-0 bg-black bg-opacity-50 hidden z-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div class="p-6 border-b border-gray-200 flex justify-between items-center">
                <h3 class="text-xl font-bold text-gray-800" id="modalTitle">교육사진 등록</h3>
                <button onclick="closeModal('createPostModal')" class="text-gray-500 hover:text-gray-700"><i class="fas fa-times text-xl"></i></button>
            </div>
            <div class="p-6">
                <form id="createPostForm" onsubmit="handleSavePost(event)">
                    <input type="hidden" name="id" id="postId">
                    <input type="hidden" name="category" id="postCategory" value="education_photo">
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
                            <input type="text" name="title" id="postTitle" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500" placeholder="교육사진 제목">
                        </div>
                        <div>
                            <label class="block text-gray-700 font-medium mb-2">사진 여러 장 올리기</label>
                            <div id="multiImageDropZone" class="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center bg-gray-50 hover:bg-amber-50 hover:border-amber-400 transition cursor-pointer">
                                <input type="file" id="multiImageInput" accept="image/*" multiple class="hidden">
                                <p class="text-gray-500 text-sm mb-1"><i class="fas fa-cloud-upload-alt text-2xl text-amber-500 mb-2"></i></p>
                                <p class="text-gray-600 font-medium">클릭하거나 이미지를 여기에 끌어다 놓으세요</p>
                                <p class="text-gray-400 text-xs mt-1">여러 장 선택 가능 (JPG, PNG 등)</p>
                                <div id="multiImageProgress" class="hidden mt-3 text-sm text-amber-600"></div>
                                <div id="multiImageThumbs" class="hidden mt-3 flex flex-wrap gap-2 justify-center"></div>
                            </div>
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
        let itemsPerPage = 10;

        function setRowsPerPage(n) {
            itemsPerPage = n;
            document.getElementById('rowsPerPage').value = String(n);
            loadPosts(1);
        }

        document.addEventListener('DOMContentLoaded', () => {
            loadPosts(1);
            setupMultiImageUpload();
            const csvInput = document.getElementById('csvFileInput');
            if (csvInput) {
                csvInput.addEventListener('change', function() {
                    const file = this.files && this.files[0];
                    if (!file) {
                        csvParsedList = [];
                        document.getElementById('csvPreview').classList.add('hidden');
                        document.getElementById('csvStartBtn').disabled = true;
                        return;
                    }
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        try {
                            const text = (e.target && e.target.result) || '';
                            csvParsedList = parseCSVToEducationList(text);
                            const preview = document.getElementById('csvPreview');
                            const previewText = document.getElementById('csvPreviewText');
                            if (csvParsedList.length === 0) {
                                previewText.textContent = '제목 컬럼을 찾을 수 없거나 유효한 행이 없습니다. CSV에 "제목" 컬럼이 있는지 확인하세요.';
                                preview.classList.remove('hidden');
                                document.getElementById('csvStartBtn').disabled = true;
                            } else {
                                const noImage = csvParsedList.filter(i => !i.imageUrl).length;
                                previewText.textContent = '총 ' + csvParsedList.length + '건 확인.' + (noImage > 0 ? ' (이미지 URL 없는 항목 ' + noImage + '건은 제목·내용만 등록됩니다.)' : '');
                                preview.classList.remove('hidden');
                                document.getElementById('csvStartBtn').disabled = false;
                            }
                        } catch (err) {
                            console.error(err);
                            document.getElementById('csvPreviewText').textContent = 'CSV 파싱 중 오류: ' + err.message;
                            document.getElementById('csvPreview').classList.remove('hidden');
                            document.getElementById('csvStartBtn').disabled = true;
                        }
                    };
                    reader.readAsText(file, 'UTF-8');
                });
            }
        });

        let multiUploadedUrls = [];
        function openModal(post) {
            document.getElementById('postCategory').value = 'education_photo';
            multiUploadedUrls = [];
            document.getElementById('multiImageProgress').classList.add('hidden');
            document.getElementById('multiImageProgress').textContent = '';
            document.getElementById('multiImageThumbs').classList.add('hidden');
            document.getElementById('multiImageThumbs').innerHTML = '';
            document.getElementById('multiImageInput').value = '';
            if (post) {
                document.getElementById('modalTitle').textContent = '교육사진 수정';
                document.getElementById('postId').value = post.id;
                document.getElementById('postTitle').value = post.title || '';
                document.getElementById('postStatus').value = post.status || 'published';
                document.getElementById('postPinned').checked = post.pinned === 1;
                setTinyContent(post.content || '');
            } else {
                document.getElementById('modalTitle').textContent = '교육사진 등록';
                document.getElementById('createPostForm').reset();
                document.getElementById('postId').value = '';
                document.getElementById('postCategory').value = 'education_photo';
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

        function triggerMultiImageInput() {
            document.getElementById('multiImageInput').click();
        }
        function setupMultiImageUpload() {
            var dropZone = document.getElementById('multiImageDropZone');
            var input = document.getElementById('multiImageInput');
            if (!dropZone || !input) return;
            dropZone.addEventListener('click', function(e) { if (!e.target.closest('#multiImageThumbs')) triggerMultiImageInput(); });
            dropZone.addEventListener('dragover', function(e) { e.preventDefault(); e.stopPropagation(); dropZone.classList.add('border-amber-500', 'bg-amber-50'); });
            dropZone.addEventListener('dragleave', function(e) { e.preventDefault(); dropZone.classList.remove('border-amber-500', 'bg-amber-50'); });
            dropZone.addEventListener('drop', function(e) {
                e.preventDefault();
                e.stopPropagation();
                dropZone.classList.remove('border-amber-500', 'bg-amber-50');
                var files = e.dataTransfer && e.dataTransfer.files;
                if (files && files.length) handleMultiImageFiles(Array.from(files));
            });
            input.addEventListener('change', function() {
                var files = this.files;
                if (files && files.length) handleMultiImageFiles(Array.from(files));
                this.value = '';
            });
        }
        async function handleMultiImageFiles(files) {
            var imageFiles = Array.from(files).filter(function(f) { return f.type.indexOf('image/') === 0; });
            if (imageFiles.length === 0) {
                alert('이미지 파일만 선택해 주세요.');
                return;
            }
            var total = imageFiles.length;
            var progressEl = document.getElementById('multiImageProgress');
            var thumbsEl = document.getElementById('multiImageThumbs');
            progressEl.classList.remove('hidden');
            progressEl.textContent = '업로드 중 0 / ' + total + '...';
            thumbsEl.classList.remove('hidden');
            var editor = tinymce.get('postContent');
            for (var i = 0; i < imageFiles.length; i++) {
                progressEl.textContent = '업로드 중 ' + (i + 1) + ' / ' + total + '...';
                try {
                    var blob = imageFiles[i];
                    var url = await uploadPostImage(blob);
                    multiUploadedUrls.push(url);
                    var thumb = document.createElement('span');
                    thumb.className = 'inline-block w-12 h-12 rounded border border-gray-200 overflow-hidden bg-gray-100';
                    thumb.innerHTML = '<img src="' + url + '" alt="" class="w-full h-full object-cover">';
                    thumbsEl.appendChild(thumb);
                    if (editor) editor.insertContent('<p><img src="' + url.replace(/"/g, '&quot;') + '" style="max-width:100%;height:auto"/></p>');
                } catch (err) {
                    console.error(err);
                    progressEl.textContent = '업로드 중 ' + (i + 1) + '/' + total + ' - 오류: ' + (err.message || '실패');
                }
            }
            progressEl.textContent = total + '장 업로드 완료.';
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
            document.getElementById('searchResultText').textContent = '';
            document.getElementById('paginationRange').textContent = '';
            const search = document.getElementById('searchInput').value;
            let url = '/api/posts?page=' + page + '&limit=' + itemsPerPage + '&category=education_photo';
            if (search) url += '&search=' + encodeURIComponent(search);
            try {
                const res = await fetch(url);
                const result = await res.json();
                const tbody = document.getElementById('tableBody');
                if (!result.success) {
                    tbody.innerHTML = '<tr><td colspan="6" class="px-6 py-4 text-center text-red-500">데이터를 불러오는데 실패했습니다.</td></tr>';
                    document.getElementById('pagination').innerHTML = '';
                    return;
                }
                currentList = result.data || [];
                const p = result.pagination || {};
                const total = p.total != null ? p.total : 0;
                const totalPages = p.totalPages != null ? p.totalPages : 1;
                const page = p.page != null ? p.page : 1;
                if (p.limit) {
                    itemsPerPage = p.limit;
                    const sel = document.getElementById('rowsPerPage');
                    if (sel) sel.value = String(p.limit);
                }

                document.getElementById('searchResultText').textContent = '검색결과 ' + total + '건';

                if (currentList.length === 0) {
                    tbody.innerHTML = '<tr><td colspan="6" class="px-6 py-16 text-center"><div class="flex flex-col items-center justify-center text-gray-500"><i class="fas fa-images text-4xl text-gray-300 mb-3"></i><p class="font-medium">등록된 교육사진이 없습니다</p><p class="text-sm mt-1">CSV 일괄 등록 또는 교육사진 등록 버튼으로 추가해 보세요.</p></div></td></tr>';
                    document.getElementById('paginationRange').textContent = '';
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
                            <button type="button" onclick="editPostByIndex(\${idx})" class="text-amber-600 hover:text-amber-800 mr-3"><i class="fas fa-edit"></i> 수정</button>
                            <button type="button" onclick="deletePost(\${post.id})" class="text-red-600 hover:text-red-800"><i class="fas fa-trash"></i> 삭제</button>
                        </td>
                    </tr>
                \`).join('');

                const start = total === 0 ? 0 : (page - 1) * (p.limit || itemsPerPage) + 1;
                const end = Math.min(page * (p.limit || itemsPerPage), total);
                document.getElementById('paginationRange').textContent = total > 0 ? start + '-' + end + ' / ' + total + '건' : '';

                const nav = document.getElementById('pagination');
                if (totalPages <= 1) {
                    nav.innerHTML = '';
                    return;
                }
                const radius = 2;
                const pages = [];
                for (let i = 1; i <= totalPages; i++) {
                    if (i === 1 || i === totalPages || (i >= page - radius && i <= page + radius)) pages.push(i);
                    else if (pages[pages.length - 1] !== '...') pages.push('...');
                }
                let html = '';
                html += '<button type="button" onclick="loadPosts(' + (page - 1) + ')" ' + (page <= 1 ? 'disabled' : '') + ' class="px-3 py-2 rounded-lg border border-gray-300 text-sm font-medium ' + (page <= 1 ? 'opacity-50 cursor-not-allowed bg-gray-50 text-gray-400' : 'bg-white text-gray-700 hover:bg-gray-50') + '"><i class="fas fa-chevron-left mr-1"></i> 이전</button>';
                pages.forEach(function(n) {
                    if (n === '...') {
                        html += '<span class="px-2 py-2 text-gray-400">…</span>';
                    } else {
                        const active = n === page;
                        html += '<button type="button" onclick="loadPosts(' + n + ')" class="min-w-[2.25rem] px-3 py-2 rounded-lg text-sm font-medium ' + (active ? 'bg-amber-600 text-white' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50') + '">' + n + '</button>';
                    }
                });
                html += '<button type="button" onclick="loadPosts(' + (page + 1) + ')" ' + (page >= totalPages ? 'disabled' : '') + ' class="px-3 py-2 rounded-lg border border-gray-300 text-sm font-medium ' + (page >= totalPages ? 'opacity-50 cursor-not-allowed bg-gray-50 text-gray-400' : 'bg-white text-gray-700 hover:bg-gray-50') + '">다음 <i class="fas fa-chevron-right ml-1"></i></button>';
                nav.innerHTML = html;
            } catch (e) {
                console.error(e);
                document.getElementById('tableBody').innerHTML = '<tr><td colspan="6" class="px-6 py-4 text-center text-red-500">오류가 발생했습니다.</td></tr>';
                document.getElementById('pagination').innerHTML = '';
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
                category: 'education_photo',
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
            data.images = [...new Set([].concat(multiUploadedUrls, data.images))];
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
            if (!confirm('이 교육사진 게시글을 삭제하시겠습니까?')) return;
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

        // --- CSV 일괄 등록 ---
        let csvParsedList = [];

        function parseCSVLine(line) {
            const out = [];
            let cur = '';
            let inQuotes = false;
            for (let i = 0; i < line.length; i++) {
                const c = line[i];
                if (c === '"') { inQuotes = !inQuotes; continue; }
                if (!inQuotes && (c === ',' || c === '\\t')) {
                    out.push(cur.trim());
                    cur = '';
                    continue;
                }
                cur += c;
            }
            out.push(cur.trim());
            return out;
        }

        function parseCSV(text) {
            const lines = text.split(/\\r?\\n/).map(l => l.trim()).filter(Boolean);
            if (lines.length === 0) return { headers: [], rows: [] };
            const headers = parseCSVLine(lines[0]);
            const rows = [];
            for (let i = 1; i < lines.length; i++) {
                const values = parseCSVLine(lines[i]);
                const row = {};
                headers.forEach((h, j) => { row[h] = values[j] !== undefined ? values[j] : ''; });
                rows.push(row);
            }
            return { headers, rows };
        }

        function findColumn(headers, candidates) {
            const lower = s => String(s).toLowerCase();
            for (const c of candidates) {
                const found = headers.find(h => lower(h) === lower(c) || h === c);
                if (found) return found;
            }
            return null;
        }

        function parseCSVToEducationList(raw) {
            const { headers, rows } = parseCSV(raw);
            if (headers.length === 0 || rows.length === 0) return [];
            const titleCol = findColumn(headers, ['제목', 'title', 'Title']);
            if (!titleCol) return [];
            const registrantCol = findColumn(headers, ['등록자', 'registrant', 'Registrant']);
            const dateCol = findColumn(headers, ['등록일자', '등록일', 'date', 'Date']);
            const imageCol = findColumn(headers, ['이미지', 'imageUrl', 'image', '이미지URL', 'img', 'url']);
            const list = [];
            for (const row of rows) {
                const title = String(row[titleCol] || '').trim();
                if (!title) continue;
                const contentParts = [];
                if (registrantCol && row[registrantCol]) contentParts.push('등록자: ' + row[registrantCol]);
                if (dateCol && row[dateCol]) contentParts.push('등록일: ' + row[dateCol]);
                const content = contentParts.length ? contentParts.join(', ') : '';
                const item = { title, content: content || '' };
                if (imageCol && row[imageCol]) {
                    const url = String(row[imageCol]).trim();
                    if (url) item.imageUrl = url;
                }
                list.push(item);
            }
            return list;
        }

        function openCsvImportModal() {
            csvParsedList = [];
            document.getElementById('csvFileInput').value = '';
            document.getElementById('csvPreview').classList.add('hidden');
            document.getElementById('csvProgress').classList.add('hidden');
            document.getElementById('csvResult').classList.add('hidden');
            document.getElementById('csvStartBtn').disabled = true;
            document.getElementById('csvImportModal').classList.remove('hidden');
        }

        function closeCsvImportModal() {
            document.getElementById('csvImportModal').classList.add('hidden');
        }

        let bulkImagePostList = [];
        async function openBulkImageModal() {
            document.getElementById('bulkImageModal').classList.remove('hidden');
            document.getElementById('bulkImageListInfo').textContent = '교육사진 목록 불러오는 중...';
            document.getElementById('bulkImageUrls').value = '';
            document.getElementById('bulkImageProgress').classList.add('hidden');
            document.getElementById('bulkImageResult').classList.add('hidden');
            const token = localStorage.getItem('token');
            if (!token) {
                document.getElementById('bulkImageListInfo').textContent = '로그인이 필요합니다.';
                return;
            }
            try {
                const res = await fetch('/api/posts?category=education_photo&limit=500');
                const result = await res.json();
                if (!result.success || !result.data || result.data.length === 0) {
                    document.getElementById('bulkImageListInfo').textContent = '등록된 교육사진이 없습니다.';
                    bulkImagePostList = [];
                    return;
                }
                bulkImagePostList = result.data;
                document.getElementById('bulkImageListInfo').textContent = '총 ' + bulkImagePostList.length + '건. 아래에 목록 순서대로 한 줄에 하나씩 이미지 URL을 붙여넣으세요.';
            } catch (e) {
                document.getElementById('bulkImageListInfo').textContent = '목록을 불러오지 못했습니다.';
                bulkImagePostList = [];
            }
        }
        function closeBulkImageModal() {
            document.getElementById('bulkImageModal').classList.add('hidden');
        }
        async function applyBulkImageUrls() {
            const token = localStorage.getItem('token');
            if (!token) { alert('로그인이 필요합니다.'); return; }
            const raw = document.getElementById('bulkImageUrls').value || '';
            const urls = raw.split(/\\r?\\n/).map(s => s.trim()).filter(Boolean);
            if (urls.length === 0) {
                alert('한 줄에 하나씩 이미지 URL을 입력해 주세요.');
                return;
            }
            if (bulkImagePostList.length === 0) {
                alert('적용할 게시글이 없습니다. 모달을 다시 열어 주세요.');
                return;
            }
            const total = Math.min(urls.length, bulkImagePostList.length);
            document.getElementById('bulkImageApplyBtn').disabled = true;
            document.getElementById('bulkImageProgress').classList.remove('hidden');
            const progressText = document.getElementById('bulkImageProgressText');
            const progressBar = document.getElementById('bulkImageProgressBar');
            let ok = 0, fail = 0;
            for (let i = 0; i < total; i++) {
                progressText.textContent = (i + 1) + ' / ' + total + ' 적용 중...';
                progressBar.style.width = ((i + 1) / total * 100) + '%';
                const post = bulkImagePostList[i];
                const url = urls[i];
                try {
                    const res = await fetch('/api/posts/' + post.id, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
                        body: JSON.stringify({ images: [url] })
                    });
                    if (res.status === 401) {
                        alert('로그인 세션이 만료되었습니다.');
                        window.location.href = '/login';
                        return;
                    }
                    const json = await res.json().catch(() => ({}));
                    if (res.ok && json.success) ok++; else fail++;
                } catch (e) { fail++; }
                await new Promise(r => setTimeout(r, 150));
            }
            progressBar.style.width = '100%';
            progressText.textContent = '완료';
            const resultEl = document.getElementById('bulkImageResult');
            resultEl.className = 'mt-4 p-4 rounded-lg text-sm ' + (fail > 0 ? 'bg-amber-50 text-amber-800' : 'bg-green-50 text-green-800');
            resultEl.innerHTML = '적용 완료: 성공 <strong>' + ok + '</strong>건, 실패 <strong>' + fail + '</strong>건';
            resultEl.classList.remove('hidden');
            document.getElementById('bulkImageApplyBtn').disabled = false;
            loadPosts(currentPage);
        }

        async function startCsvImport() {
            if (csvParsedList.length === 0) return;
            const token = localStorage.getItem('token');
            if (!token) {
                alert('로그인이 필요합니다.');
                return;
            }
            const total = csvParsedList.length;
            const BULK_SIZE = 100;
            let ok = 0, fail = 0;
            document.getElementById('csvStartBtn').disabled = true;
            document.getElementById('csvProgress').classList.remove('hidden');
            document.getElementById('csvResult').classList.add('hidden');
            const progressText = document.getElementById('csvProgressText');
            const progressBar = document.getElementById('csvProgressBar');

            for (let offset = 0; offset < csvParsedList.length; offset += BULK_SIZE) {
                const chunk = csvParsedList.slice(offset, offset + BULK_SIZE);
                progressText.textContent = (offset + chunk.length) + ' / ' + total + ' 등록 중...';
                progressBar.style.width = (Math.min(offset + BULK_SIZE, total) / total * 100) + '%';

                const items = chunk.map(function(item) {
                    const images = [];
                    if (item.imageUrl) images.push(item.imageUrl);
                    return {
                        title: item.title,
                        content: item.content || '',
                        category: 'education_photo',
                        status: 'published',
                        images: images
                    };
                });
                try {
                    const res = await fetch('/api/posts/bulk', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
                        body: JSON.stringify({ items: items })
                    });
                    if (res.status === 401) {
                        alert('로그인 세션이 만료되었습니다.');
                        window.location.href = '/login';
                        return;
                    }
                    const json = await res.json().catch(() => ({}));
                    if (json.success && json.data) {
                        ok += json.data.ok || 0;
                        fail += json.data.fail || 0;
                    } else {
                        fail += chunk.length;
                    }
                } catch (err) {
                    fail += chunk.length;
                }
                await new Promise(r => setTimeout(r, 50));
            }

            progressBar.style.width = '100%';
            progressText.textContent = '완료';
            const resultEl = document.getElementById('csvResult');
            resultEl.className = 'p-4 rounded-lg text-sm ' + (fail > 0 ? 'bg-amber-50 text-amber-800' : 'bg-green-50 text-green-800');
            resultEl.innerHTML = '일괄 등록 완료: 성공 <strong>' + ok + '</strong>건, 실패 <strong>' + fail + '</strong>건';
            resultEl.classList.remove('hidden');
            document.getElementById('csvStartBtn').disabled = false;
            loadPosts(1);
        }
    </script>
</body>
</html>
`;
