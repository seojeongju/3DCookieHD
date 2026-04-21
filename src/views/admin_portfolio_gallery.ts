import { hrdSidebar } from './components/hrd_sidebar';

export const adminPortfolioGalleryHtml = (sidebar: string) => `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>포트폴리오 갤러리 관리 - 와우쓰리디홍대센터</title>
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
                        <h1 class="text-2xl font-bold text-gray-800">포트폴리오 갤러리 관리</h1>
                        <p class="text-gray-600 mt-1 text-sm">포트폴리오 갤러리 게시글을 관리합니다. 공개 페이지 <a href="/portfolios" target="_blank" class="text-primary-600 hover:underline">/portfolios</a>에 연동됩니다.</p>
                    </div>
                    <div class="flex gap-2 flex-wrap">
                        <a href="/portfolios" target="_blank" rel="noopener" class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition flex items-center text-sm font-medium shadow-sm border border-gray-200">
                            <i class="fas fa-external-link-alt mr-2"></i> 공개 갤러리 미리보기
                        </a>
                        <button type="button" onclick="migrateExternalPortfolioImages(true)" class="px-4 py-2 bg-white text-violet-700 border border-violet-200 rounded-lg hover:bg-violet-50 transition flex items-center text-sm font-medium shadow-sm" title="본문·썸네일에 남아 있는 외부(http) 이미지 URL만 집계(저장 안 함)">
                            <i class="fas fa-eye mr-2"></i> 외부 이미지 R2 이전 미리보기
                        </button>
                        <button type="button" onclick="migrateExternalPortfolioImages(false)" class="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition flex items-center text-sm font-medium shadow-sm" title="외부 이미지를 다운로드해 R2에 저장하고 URL을 우리 서버 경로로 바꿉니다">
                            <i class="fas fa-cloud-download-alt mr-2"></i> 외부 이미지 R2로 이전
                        </button>
                        <button type="button" onclick="checkExternalPortfolioMigrationStatus()" class="px-4 py-2 bg-white text-violet-800 border border-violet-200 rounded-lg hover:bg-violet-50 transition flex items-center text-sm font-medium shadow-sm" title="DB에 http 링크가 남아 있을 수 있는 건수(빠른 참고)">
                            <i class="fas fa-check-double mr-2"></i> 이전 여부 빠른 확인
                        </button>
                        <button type="button" onclick="openModal(null)" class="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition flex items-center text-sm font-medium shadow-sm">
                            <i class="fas fa-plus mr-2"></i> 포트폴리오 등록
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

    <!-- 작성/수정 모달 -->
    <div id="createPostModal" class="fixed inset-0 bg-black bg-opacity-50 hidden z-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div class="p-6 border-b border-gray-200 flex justify-between items-center">
                <h3 class="text-xl font-bold text-gray-800" id="modalTitle">포트폴리오 등록</h3>
                <button onclick="closeModal('createPostModal')" class="text-gray-500 hover:text-gray-700"><i class="fas fa-times text-xl"></i></button>
            </div>
            <div class="p-6">
                <form id="createPostForm" onsubmit="handleSavePost(event)">
                    <input type="hidden" name="id" id="postId">
                    <input type="hidden" name="category" id="postCategory" value="portfolio">
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
                            <input type="text" name="title" id="postTitle" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500" placeholder="포트폴리오 제목">
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
                        <div class="border-t border-gray-100 pt-4">
                            <label class="block text-gray-700 font-bold mb-3 flex items-center">
                                <i class="fas fa-video mr-2 text-amber-500"></i> 동영상 관리
                            </label>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label class="block text-gray-600 text-sm font-medium mb-2">동영상 직접 올리기 (MP4, WebM)</label>
                                    <div id="multiVideoDropZone" class="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center bg-gray-50 hover:bg-blue-50 hover:border-blue-300 transition cursor-pointer">
                                        <input type="file" id="multiVideoInput" accept="video/*" multiple class="hidden">
                                        <p class="text-gray-500 text-sm mb-1"><i class="fas fa-file-video text-2xl text-blue-500 mb-2"></i></p>
                                        <p class="text-gray-600 text-sm font-medium">영상을 여기에 끌어다 놓으세요</p>
                                        <p class="text-gray-400 text-[10px] mt-1">최대 50MB</p>
                                        <div id="multiVideoProgress" class="hidden mt-3 text-xs text-blue-600"></div>
                                        <div id="multiVideoList" class="hidden mt-3 space-y-2"></div>
                                    </div>
                                </div>
                                <div>
                                    <label class="block text-gray-600 text-sm font-medium mb-2">동영상 링크 (유튜브/비메오)</label>
                                    <div class="flex gap-2 mb-3">
                                        <input type="text" id="videoLinkInput" class="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500" placeholder="https://www.youtube.com/watch?v=...">
                                        <button type="button" onclick="addVideoLink()" class="px-3 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition text-sm">추가</button>
                                    </div>
                                    <div id="videoLinksList" class="space-y-2 max-h-[150px] overflow-y-auto custom-scrollbar pr-1">
                                        <p class="text-gray-400 text-xs text-center py-4 bg-gray-50 rounded-lg">등록된 링크가 없습니다.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-gray-700 font-medium mb-2">과정 선택 (선택)</label>
                                <select name="course_id" id="postCourseId" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500">
                                    <option value="">과정 선택 없음</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-gray-700 font-medium mb-2">학생 선택 (선택)</label>
                                <select name="author_id" id="postAuthorId" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500">
                                    <option value="">게시자 본인</option>
                                </select>
                            </div>
                        </div>
                        <div class="grid grid-cols-2 gap-4">
                             <div>
                                <label class="block text-gray-700 font-medium mb-2">분류</label>
                                <select name="sub_category" id="postSubCategory" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500">
                                    <option value="other">기타</option>
                                    <option value="3d_modeling">3D 모델링</option>
                                    <option value="design">디자인</option>
                                    <option value="coding">개발/코딩</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-gray-700 font-medium mb-2">외부 링크 (URL)</label>
                                <input type="url" name="content_url" id="postContentUrl" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500" placeholder="https://...">
                            </div>
                        </div>
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-gray-700 font-medium mb-2">작성일</label>
                                <input type="date" name="created_at" id="postCreatedAt" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500">
                            </div>
                            <div></div>
                        </div>
                        <div>
                            <label class="block text-gray-700 font-medium mb-2">내용 (이미지 첨부 가능)</label>
                            <textarea name="content" id="postContent" rows="15" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"></textarea>
                        </div>
                        <div>
                            <label class="block text-gray-700 font-medium mb-2 text-purple-600">강사 피드백 (선택)</label>
                            <textarea name="teacher_feedback" id="postTeacherFeedback" rows="3" class="w-full px-4 py-2 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500" placeholder="수강생에게 전달할 피드백..."></textarea>
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
            loadInitialData();
            loadPosts(1);
            setupMultiImageUpload();
            setupMultiVideoUpload();
        });

        async function loadInitialData() {
            try {
                const token = localStorage.getItem('token');
                // 과정 목록 로드
                const cRes = await fetch('/api/courses?limit=200', { headers: { 'Authorization': 'Bearer ' + token } });
                const cData = await cRes.json();
                if (cData.success) {
                    const sel = document.getElementById('postCourseId');
                    cData.data.forEach(c => {
                        const opt = document.createElement('option');
                        opt.value = c.id;
                        opt.textContent = c.title;
                        sel.appendChild(opt);
                    });
                }
                // 학생(회원) 목록 로드
                const uRes = await fetch('/api/users?limit=500', { headers: { 'Authorization': 'Bearer ' + token } });
                const uData = await uRes.json();
                if (uData.success) {
                    const sel = document.getElementById('postAuthorId');
                    uData.data.forEach(u => {
                        const opt = document.createElement('option');
                        opt.value = u.id;
                        opt.textContent = u.name + ' (' + u.email + ')';
                        sel.appendChild(opt);
                    });
                }
            } catch (err) { console.error(err); }
        }

        let multiUploadedUrls = [];
        let multiUploadedVideos = [];
        let videoLinks = [];

        function toDateInputValue(v) {
            if (!v) return '';
            const d = new Date(v);
            if (Number.isNaN(d.getTime())) return '';
            const y = d.getFullYear();
            const m = String(d.getMonth() + 1).padStart(2, '0');
            const day = String(d.getDate()).padStart(2, '0');
            return y + '-' + m + '-' + day;
        }

        function openModal(post) {
            document.getElementById('postCategory').value = 'portfolio';
            multiUploadedUrls = [];
            multiUploadedVideos = [];
            videoLinks = [];
            document.getElementById('multiImageProgress').classList.add('hidden');
            document.getElementById('multiImageProgress').textContent = '';
            document.getElementById('multiImageThumbs').classList.add('hidden');
            document.getElementById('multiImageThumbs').innerHTML = '';
            document.getElementById('multiImageInput').value = '';

            document.getElementById('multiVideoProgress').classList.add('hidden');
            document.getElementById('multiVideoList').innerHTML = '';
            document.getElementById('multiVideoList').classList.add('hidden');
            document.getElementById('multiVideoInput').value = '';
            document.getElementById('videoLinkInput').value = '';
            document.getElementById('videoLinksList').innerHTML = '<p class="text-gray-400 text-xs text-center py-4 bg-gray-50 rounded-lg">등록된 링크가 없습니다.</p>';
            if (post) {
                document.getElementById('modalTitle').textContent = '포트폴리오 수정';
                document.getElementById('postId').value = post.id;
                document.getElementById('postTitle').value = post.title || '';
                document.getElementById('postStatus').value = post.status || 'published';
                document.getElementById('postPinned').checked = post.pinned === 1 || post.is_featured;
                document.getElementById('postCourseId').value = post.course_id || '';
                document.getElementById('postAuthorId').value = post.author_id || post.student_id || '';
                document.getElementById('postSubCategory').value = post.sub_category || 'other';
                document.getElementById('postContentUrl').value = post.content_url || '';
                document.getElementById('postTeacherFeedback').value = post.teacher_feedback || '';
                document.getElementById('postCreatedAt').value = toDateInputValue(post.created_at);

                const div = document.createElement('div');
                div.innerHTML = post.content || post.description || '';
                div.querySelectorAll('iframe').forEach(ifr => {
                    const src = ifr.src;
                    if (src && (src.includes('youtube.com') || src.includes('youtu.be') || src.includes('vimeo.com'))) {
                         videoLinks.push(src);
                    }
                });
                div.querySelectorAll('video').forEach(vid => {
                    if (vid.src) multiUploadedVideos.push(vid.src);
                });

                renderUploadedVideos();
                renderVideoLinks();

                setTinyContent(post.content || post.description || '');
            } else {
                document.getElementById('modalTitle').textContent = '포트폴리오 등록';
                document.getElementById('createPostForm').reset();
                document.getElementById('postId').value = '';
                document.getElementById('postCategory').value = 'portfolio';
                document.getElementById('postStatus').value = 'published';
                document.getElementById('postCourseId').value = '';
                document.getElementById('postAuthorId').value = '';
                document.getElementById('postSubCategory').value = 'other';
                document.getElementById('postContentUrl').value = '';
                document.getElementById('postTeacherFeedback').value = '';
                document.getElementById('postCreatedAt').value = toDateInputValue(new Date());
                
                renderUploadedVideos();
                renderVideoLinks();

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

        function triggerMultiVideoInput() { document.getElementById('multiVideoInput').click(); }
        function setupMultiVideoUpload() {
            var dropZone = document.getElementById('multiVideoDropZone');
            var input = document.getElementById('multiVideoInput');
            if (!dropZone || !input) return;
            dropZone.addEventListener('click', function(e) { if (!e.target.closest('#multiVideoList')) triggerMultiVideoInput(); });
            dropZone.addEventListener('dragover', function(e) { e.preventDefault(); e.stopPropagation(); dropZone.classList.add('border-blue-500', 'bg-blue-50'); });
            dropZone.addEventListener('dragleave', function(e) { e.preventDefault(); dropZone.classList.remove('border-blue-500', 'bg-blue-50'); });
            dropZone.addEventListener('drop', function(e) {
                e.preventDefault(); e.stopPropagation(); dropZone.classList.remove('border-blue-500', 'bg-blue-50');
                var files = e.dataTransfer && e.dataTransfer.files;
                if (files && files.length) handleMultiVideoFiles(Array.from(files));
            });
            input.addEventListener('change', function() {
                var files = this.files;
                if (files && files.length) handleMultiVideoFiles(Array.from(files));
                this.value = '';
            });
        }
        
        async function handleMultiVideoFiles(files) {
            var videoFiles = Array.from(files).filter(function(f) { return f.type.indexOf('video/') === 0; });
            if (videoFiles.length === 0) { alert('동영상 파일만 선택해 주세요.'); return; }
            var total = videoFiles.length;
            var progressEl = document.getElementById('multiVideoProgress');
            var listEl = document.getElementById('multiVideoList');
            progressEl.classList.remove('hidden');
            progressEl.textContent = '업로드 중 0 / ' + total + '...';
            listEl.classList.remove('hidden');
            for (var i = 0; i < videoFiles.length; i++) {
                progressEl.textContent = '업로드 중 ' + (i + 1) + ' / ' + total + '...';
                try {
                    var blob = videoFiles[i];
                    if (blob.size > 50 * 1024 * 1024) { alert('파일 용량이 너무 큽니다 (최대 50MB): ' + blob.name); continue; }
                    var url = await uploadPostVideo(blob);
                    multiUploadedVideos.push(url);
                    renderUploadedVideos();
                    insertVideoToEditor(url);
                } catch (err) {
                    console.error(err);
                    alert('업로드 오류: ' + (err.message || '실패'));
                }
            }
            progressEl.textContent = total + '개 업로드 완료.';
        }
 
        async function uploadPostVideo(blob) {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('로그인이 필요합니다.');
            const fd = new FormData();
            fd.append('file', blob);
            fd.append('category', 'videos');
            fd.append('folder', 'portfolios');
            const res = await fetch('/api/upload', { method: 'POST', headers: { 'Authorization': 'Bearer ' + token }, body: fd });
            const json = await res.json();
            if (!json.success) throw new Error(json.error || '업로드 실패');
            return json.data.url || json.data.file_url || '';
        }
 
        function renderUploadedVideos() {
            const listEl = document.getElementById('multiVideoList');
            if (!listEl) return;
            listEl.innerHTML = multiUploadedVideos.map((url, idx) => \`
                <div class="flex items-center justify-between p-2 bg-white rounded border border-gray-200 text-xs">
                    <span class="truncate flex-1 mr-2 text-gray-600"><i class="fas fa-video mr-1 text-blue-400"></i> \${url.split('/').pop()}</span>
                    <button type="button" onclick="removeUploadedVideo(\${idx})" class="text-red-500 hover:text-red-700 px-1"><i class="fas fa-times"></i></button>
                </div>
            \`).join('');
            listEl.classList.toggle('hidden', multiUploadedVideos.length === 0);
        }
 
        function removeUploadedVideo(idx) {
            multiUploadedVideos.splice(idx, 1);
            renderUploadedVideos();
        }
 
        function addVideoLink() {
            const input = document.getElementById('videoLinkInput');
            const url = input.value.trim();
            if (!url) return;
            if (!url.startsWith('http')) { alert('올바른 URL 형식이 아닙니다.'); return; }
            videoLinks.push(url);
            input.value = '';
            renderVideoLinks();
            insertVideoToEditor(url);
        }
 
        function renderVideoLinks() {
            const listEl = document.getElementById('videoLinksList');
            if (!listEl) return;
            if (videoLinks.length === 0) {
                listEl.innerHTML = '<p class="text-gray-400 text-xs text-center py-4 bg-gray-50 rounded-lg">등록된 링크가 없습니다.</p>';
                return;
            }
            listEl.innerHTML = videoLinks.map((url, idx) => {
                let icon = 'fa-link';
                if (url.includes('youtube.com') || url.includes('youtu.be')) icon = 'fa-youtube text-red-500';
                else if (url.includes('vimeo.com')) icon = 'fa-vimeo-v text-blue-400';
                return \`
                    <div class="flex items-center justify-between p-2 bg-white rounded border border-gray-200 text-xs">
                        <span class="truncate flex-1 mr-2 text-gray-600"><i class="fab \${icon} mr-1"></i> \${url}</span>
                        <button type="button" onclick="removeVideoLink(\${idx})" class="text-red-500 hover:text-red-700 px-1"><i class="fas fa-times"></i></button>
                    </div>
                \`;
            }).join('');
        }
 
        function removeVideoLink(idx) {
            videoLinks.splice(idx, 1);
            renderVideoLinks();
        }

        function insertVideoToEditor(url) {
            const editor = tinymce.get('postContent');
            if (!editor) return;
            
            let html = '';
            const ytMatch = url.match(/(?:youtube\\.com\\/(?:[^\\/]+\\/.+\\/|(?:v|e(?:mbed)?)\\/|.*[?&]v=)|youtu\\.be\\/)([^"&?\\/\\s]{11})/);
            if (ytMatch && ytMatch[1]) {
                html = \`<p><iframe src="https://www.youtube.com/embed/\${ytMatch[1]}" width="560" height="315" frameborder="0" allowfullscreen></iframe></p>\`;
            }
            else if (url.includes('vimeo.com')) {
                const vimeoMatch = url.match(/vimeo\\.com\\/(?:channels\\/(?:\\w+\\/)?|groups\\/([^\\/]*)\\/videos\\/|album\\/(\\d+)\\/video\\/|video\\/|)(\\d+)(?:$|\\/|\\?)/);
                if (vimeoMatch && vimeoMatch[3]) {
                    html = \`<p><iframe src="https://player.vimeo.com/video/\${vimeoMatch[3]}" width="640" height="360" frameborder="0" allowfullscreen></iframe></p>\`;
                }
            }
            else {
                html = \`<p><video controls src="\${url}" style="max-width:100%; height:auto;"></video></p>\`;
            }
            
            if (html) editor.insertContent(html);
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
            let url = '/api/portfolios?page=' + page + '&limit=' + itemsPerPage;
            if (search) url += '&search=' + encodeURIComponent(search);
            try {
                const token = localStorage.getItem('token');
                const res = await fetch(url, {
                    headers: token ? { 'Authorization': 'Bearer ' + token } : {}
                });
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
                    tbody.innerHTML = '<tr><td colspan="6" class="px-6 py-16 text-center"><div class="flex flex-col items-center justify-center text-gray-500"><i class="fas fa-images text-4xl text-gray-300 mb-3"></i><p class="font-medium">등록된 포트폴리오가 없습니다</p><p class="text-sm mt-1">포트폴리오 등록 버튼으로 추가해 보세요.</p></div></td></tr>';
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
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">\${post.student_name || post.author_name || '-'}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">\${post.views || 0}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">\${post.created_at ? new Date(post.created_at).toLocaleDateString('ko-KR') : '-'}</td>
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

        async function checkExternalPortfolioMigrationStatus() {
            const token = localStorage.getItem('token');
            if (!token) { alert('로그인이 필요합니다.'); return; }
            try {
                const res = await fetch('/api/portfolios/admin/migrate-external-images/status', {
                    headers: { 'Authorization': 'Bearer ' + token }
                });
                const json = await res.json();
                if (!json.success) {
                    alert('오류: ' + (json.error || '실패'));
                    return;
                }
                const d = json.data || {};
                const n = d.rows_with_http_in_db_columns != null ? d.rows_with_http_in_db_columns : '-';
                alert('본문·썸네일에 http(s)가 포함된 포트폴리오(추정): ' + n + '건\\n\\n' + (d.note || '') + '\\n\\n※ 최종 확인: 「미리보기」로 이전 대상 합을 확인하세요.');
            } catch (e) {
                console.error(e);
                alert('처리 중 오류가 발생했습니다.');
            }
        }

        async function migrateExternalPortfolioImages(dryRun) {
            if (dryRun) {
                if (!confirm('외부 사이트 이미지 URL(http/https)이 본문·썸네일에 남아 있는 글만 집계합니다(저장하지 않음). 계속할까요?')) return;
            } else {
                if (!confirm('외부 이미지를 다운로드해 R2에 저장하고, 본문·썸네일의 URL을 우리 서버(/api/upload/files/) 경로로 바꿉니다. 시간이 걸릴 수 있습니다. 진행할까요?')) return;
            }
            const token = localStorage.getItem('token');
            if (!token) { alert('로그인이 필요합니다.'); return; }
            let offset = 0;
            const limit = 8;
            let sumWould = 0;
            let sumUpdated = 0;
            let sumSkipped = 0;
            let sumErr = 0;
            let batches = 0;
            try {
                while (true) {
                    const res = await fetch('/api/portfolios/admin/migrate-external-images', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + token
                        },
                        body: JSON.stringify({ dry_run: dryRun, limit, offset })
                    });
                    if (res.status === 401) {
                        alert('로그인 세션이 만료되었습니다.');
                        window.location.href = '/login';
                        return;
                    }
                    const json = await res.json();
                    if (!json.success) {
                        alert('오류: ' + (json.error || '실패'));
                        return;
                    }
                    const d = json.data;
                    const s = d.summary || {};
                    sumWould += Number(s.would_update) || 0;
                    sumUpdated += Number(s.updated) || 0;
                    sumSkipped += Number(s.skipped_no_external) || 0;
                    sumErr += Number(s.errors) || 0;
                    batches++;
                    console.log('[포트폴리오 외부이미지] 배치 ' + batches + ':', d.summary, 'offset→' + (d.batch && d.batch.next_offset));
                    if (!d.batch || !d.batch.has_more) break;
                    offset = d.batch.next_offset;
                }
                if (dryRun) {
                    alert('미리보기 완료.\\n\\n이전 대상(건수 합): ' + sumWould + '\\n스킵(외부 이미지 URL 없음): ' + sumSkipped + '\\n오류: ' + sumErr + '\\n배치 수: ' + batches + '\\n\\n※ 대상 합이 0이면 더 이상 옮길 외부 이미지가 없습니다.');
                } else {
                    alert('이전 완료.\\n\\n갱신된 글: ' + sumUpdated + '\\n스킵: ' + sumSkipped + '\\n오류: ' + sumErr + '\\n배치 수: ' + batches + '\\n\\n확인: 「미리보기」를 다시 눌러 대상 합이 0인지 보세요.');
                }
                loadPosts(currentPage);
            } catch (e) {
                console.error(e);
                alert('처리 중 오류가 발생했습니다.');
            }
        }

        async function handleSavePost(e) {
            e.preventDefault();
            const data = {
                id: document.getElementById('postId').value || null,
                category: 'portfolio',
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
                const url = data.id ? '/api/portfolios/' + data.id : '/api/portfolios';
                const method = data.id ? 'PUT' : 'POST';
                
                // 추가 필드 구성
                const payload = {
                    ...data,
                    course_id: document.getElementById('postCourseId').value || null,
                    student_id: document.getElementById('postAuthorId').value || null,
                    category: document.getElementById('postSubCategory').value || 'other',
                    content_url: document.getElementById('postContentUrl').value || null,
                    teacher_feedback: document.getElementById('postTeacherFeedback').value || null,
                    description: data.content,
                    is_featured: data.pinned,
                    thumbnail_url: data.images[0] || null,
                    created_at: document.getElementById('postCreatedAt').value || null
                };

                const res = await fetch(url, {
                    method: method,
                    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
                    body: JSON.stringify(payload)
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
            if (!confirm('이 포트폴리오 게시글을 삭제하시겠습니까?')) return;
            try {
                const token = localStorage.getItem('token');
                const res = await fetch('/api/portfolios/' + id, { method: 'DELETE', headers: { 'Authorization': 'Bearer ' + token } });
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
