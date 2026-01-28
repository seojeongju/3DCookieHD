import { teacherSidebar } from './components/teacher_sidebar';

export const teacherProfileHtml = `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>개인정보 수정 - 강사 대시보드</title>
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
</head>
<body class="bg-gray-50 font-sans">
    <div class="flex h-screen overflow-hidden">
        <!-- 사이드바 -->
        ${teacherSidebar('profile')}

        <!-- 메인 컨텐츠 영역 -->
        <main class="flex-1 overflow-y-auto bg-gray-50">
            <!-- 헤더 -->
            <header class="bg-white shadow-sm sticky top-0 z-10">
                <div class="px-8 py-4 flex justify-between items-center">
                    <h1 class="text-2xl font-bold text-gray-800">개인정보 수정</h1>
                    <div class="flex items-center space-x-4">
                        <span class="px-3 py-1 bg-blue-100 text-blue-600 text-xs font-bold rounded-full">TEACHER</span>
                        <a href="/teacher" class="text-gray-500 hover:text-primary-600 transition">
                            <i class="fas fa-arrow-left mr-1"></i> 대시보드로
                        </a>
                    </div>
                </div>
            </header>

            <div class="p-8 max-w-5xl mx-auto">
                <!-- 개인정보 수정 폼 -->
                <form id="profileForm" onsubmit="handleSaveProfile(event)" class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <!-- 기초 정보 섹션 (상단 고정) -->
                    <div class="bg-gradient-to-br from-gray-50 to-blue-50/30 px-8 py-6 border-b border-gray-200">
                        <div class="flex items-start gap-6">
                            <!-- 프로필 이미지 -->
                            <div class="flex-shrink-0">
                                <div class="w-32 h-32 rounded-[2rem] bg-white border-4 border-white shadow-xl overflow-hidden relative group cursor-pointer" onclick="document.getElementById('pImageFile').click()">
                                    <i class="fas fa-user text-gray-300 text-5xl absolute inset-0 flex items-center justify-center" id="pImagePlaceholder"></i>
                                    <img id="pImagePreview" src="" class="w-full h-full object-cover hidden">
                                    <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold">
                                        <i class="fas fa-camera mr-2"></i> 변경
                                    </div>
                                </div>
                                <input type="hidden" name="profile_image" id="pImageUrl">
                                <input type="file" id="pImageFile" accept="image/*" class="hidden" onchange="handlePImage(this)">
                            </div>

                            <!-- 기본 정보 그리드 -->
                            <div class="flex-1 grid grid-cols-2 gap-4">
                                <div>
                                    <label class="text-xs font-black text-gray-500 uppercase tracking-wider mb-2 block">이름 <span class="text-red-500">*</span></label>
                                    <input type="text" name="name" id="pName" required class="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 transition">
                                </div>
                                <div>
                                    <label class="text-xs font-black text-gray-500 uppercase tracking-wider mb-2 block">직위</label>
                                    <input type="text" name="position" id="pPosition" class="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 transition" placeholder="예: 전임강사">
                                </div>
                                <div>
                                    <label class="text-xs font-black text-gray-500 uppercase tracking-wider mb-2 block">이메일 <span class="text-red-500">*</span></label>
                                    <input type="email" name="email" id="pEmail" required class="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 transition">
                                </div>
                                <div>
                                    <label class="text-xs font-black text-gray-500 uppercase tracking-wider mb-2 block">연락처 <span class="text-red-500">*</span></label>
                                    <input type="text" name="phone" id="pPhone" required class="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 transition" placeholder="010-0000-0000">
                                </div>
                                <div>
                                    <label class="text-xs font-black text-gray-500 uppercase tracking-wider mb-2 block">담당 과목</label>
                                    <input type="text" name="subject" id="pSubject" class="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 transition" placeholder="예: 3D 모델링, 제품디자인">
                                </div>
                                <div>
                                    <label class="text-xs font-black text-gray-500 uppercase tracking-wider mb-2 block">입사일</label>
                                    <input type="date" name="joined_at" id="pJoined" class="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 transition">
                                </div>
                                <div>
                                    <label class="text-xs font-black text-gray-500 uppercase tracking-wider mb-2 block">고용 형태</label>
                                    <select name="type" id="pType" class="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 transition cursor-pointer">
                                        <option value="full">전임</option>
                                        <option value="part">파트타임</option>
                                        <option value="external">외부강사</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- 탭 네비게이션 -->
                    <div class="bg-white border-b border-gray-200 px-8">
                        <div class="flex items-center gap-8">
                            <button type="button" onclick="switchProfileTab('education')" id="tabEducation" class="pb-4 text-sm font-black uppercase tracking-widest tab-active-profile transition-all border-b-2 border-blue-600 text-blue-600">
                                <i class="fas fa-graduation-cap mr-2"></i> 학력 및 경력
                            </button>
                            <button type="button" onclick="switchProfileTab('certifications')" id="tabCertifications" class="pb-4 text-sm font-black uppercase tracking-widest tab-inactive-profile transition-all border-b-2 border-transparent text-gray-400 hover:text-gray-600">
                                <i class="fas fa-certificate mr-2"></i> 자격증
                            </button>
                            <button type="button" onclick="switchProfileTab('training')" id="tabTraining" class="pb-4 text-sm font-black uppercase tracking-widest tab-inactive-profile transition-all border-b-2 border-transparent text-gray-400 hover:text-gray-600">
                                <i class="fas fa-chalkboard-teacher mr-2"></i> 보수교육
                            </button>
                            <button type="button" onclick="switchProfileTab('teaching')" id="tabTeaching" class="pb-4 text-sm font-black uppercase tracking-widest tab-inactive-profile transition-all border-b-2 border-transparent text-gray-400 hover:text-gray-600">
                                <i class="fas fa-book-open mr-2"></i> 강의이력
                            </button>
                        </div>
                    </div>

                    <!-- 탭 컨텐츠 영역 -->
                    <div class="bg-gray-50/50 p-8">
                        <!-- 탭 1: 학력 및 경력 -->
                        <div id="contentEducation" class="space-y-6">
                            <div class="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm">
                                <h5 class="text-sm font-black text-gray-900 uppercase tracking-widest flex items-center mb-6">
                                    <i class="fas fa-university mr-3 text-blue-500"></i> 최종 학력
                                </h5>
                                <div>
                                    <input type="text" name="education" id="pEducation" class="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 transition" placeholder="예: 서울대학교 컴퓨터공학과 학사">
                                </div>
                            </div>

                            <div class="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm">
                                <h5 class="text-sm font-black text-gray-900 uppercase tracking-widest flex items-center mb-6">
                                    <i class="fas fa-briefcase mr-3 text-purple-500"></i> 경력 사항
                                </h5>
                                <div>
                                    <textarea name="career" id="pCareer" rows="6" class="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-sm outline-none resize-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 transition" placeholder="회사명, 기간, 직책 등을 입력하세요&#10;&#10;예:&#10;- 2020.01 ~ 2023.12: ㈜ABC디자인, 시니어 디자이너&#10;- 2018.03 ~ 2019.12: XYZ스튜디오, 주임"></textarea>
                                </div>
                            </div>
                        </div>

                        <!-- 탭 2: 자격증 -->
                        <div id="contentCertifications" class="hidden space-y-6">
                            <div class="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm">
                                <div class="flex items-center justify-between mb-6">
                                    <h5 class="text-sm font-black text-gray-900 uppercase tracking-widest flex items-center">
                                        <i class="fas fa-certificate mr-3 text-orange-500"></i> 자격증 목록
                                    </h5>
                                    <button type="button" onclick="addCertification()" class="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-500/20 flex items-center">
                                        <i class="fas fa-plus mr-2"></i> 자격증 추가
                                    </button>
                                </div>
                                <div id="certificationsContainer" class="space-y-4">
                                    <!-- 자격증 항목들이 여기에 동적으로 추가됨 -->
                                </div>
                            </div>
                        </div>

                        <!-- 탭 3: 보수교육 -->
                        <div id="contentTraining" class="hidden space-y-6">
                            <div class="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm">
                                <h5 class="text-sm font-black text-gray-900 uppercase tracking-widest flex items-center mb-6">
                                    <i class="fas fa-chalkboard-teacher mr-3 text-green-500"></i> 보수교육 현황
                                </h5>
                                <div>
                                    <textarea name="training_history" id="pTrainingHistory" rows="8" class="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-sm outline-none resize-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 transition" placeholder="보수교육 이력, 연수명, 기간 등을 입력하세요&#10;&#10;예:&#10;- 2024.03: HRD-Net 보수교육 (40시간)&#10;- 2023.09: 디지털 교육 역량 강화 연수 (20시간)"></textarea>
                                </div>
                            </div>
                        </div>

                        <!-- 탭 4: 강의이력 -->
                        <div id="contentTeaching" class="hidden space-y-6">
                            <div class="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm">
                                <div class="flex items-center justify-between mb-6">
                                    <h5 class="text-sm font-black text-gray-900 uppercase tracking-widest flex items-center">
                                        <i class="fas fa-book-open mr-3 text-indigo-500"></i> 강의이력
                                    </h5>
                                    <button type="button" onclick="addTeachingHistory()" class="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-500/20 flex items-center">
                                        <i class="fas fa-plus mr-2"></i> 강의이력 추가
                                    </button>
                                </div>
                                <div id="teachingHistoryContainer" class="space-y-4">
                                    <!-- 강의이력 항목들이 여기에 동적으로 추가됨 -->
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- 하단 버튼 -->
                    <div class="bg-white border-t border-gray-200 px-8 py-6 flex justify-end gap-4">
                        <button type="button" onclick="location.href='/teacher'" class="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold text-sm hover:bg-gray-200 transition">
                            취소
                        </button>
                        <button type="submit" class="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition shadow-lg shadow-blue-500/20 flex items-center">
                            <i class="fas fa-save mr-2"></i> 저장하기
                        </button>
                    </div>
                </form>
            </div>
        </main>
    </div>

    <script>
        let certifications = [];
        let certIdCounter = 0;
        let teachingHistory = [];
        let teachingHistoryIdCounter = 0;
        let currentProfileTab = 'education';
        let currentUserId = null;

        document.addEventListener('DOMContentLoaded', () => {
            checkLogin();
            loadProfileData();
        });

        function checkLogin() {
            const token = localStorage.getItem('token');
            if (!token) {
                alert('로그인이 필요합니다.');
                window.location.href = '/login';
            }
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            if (user.role !== 'teacher' && user.role !== 'admin') {
                alert('강사 권한이 필요합니다.');
                window.location.href = '/';
            }
            // user.id를 숫자로 변환 (문자열이어도 숫자로 변환)
            const userIdNum = parseInt(user.id);
            currentUserId = isNaN(userIdNum) ? user.id : userIdNum;
        }

        async function loadProfileData() {
            try {
                const token = localStorage.getItem('token');
                const user = JSON.parse(localStorage.getItem('user') || '{}');
                
                // 교강사 목록에서 본인 정보 찾기
                const response = await fetch('/api/hrd/personnel', {
                    headers: { 'Authorization': 'Bearer ' + token }
                });
                const result = await response.json();
                
                if (result.success) {
                    const myData = result.data.find(p => p.id === user.id);
                    if (myData) {
                        populateForm(myData);
                    } else {
                        // 교강사 정보가 없으면 기본 정보만 표시
                        populateBasicInfo(user);
                    }
                } else {
                    console.error('Failed to load profile:', result.error);
                    populateBasicInfo(user);
                }
            } catch (error) {
                console.error('Error loading profile:', error);
                const user = JSON.parse(localStorage.getItem('user') || '{}');
                populateBasicInfo(user);
            }
        }

        function populateBasicInfo(user) {
            document.getElementById('pName').value = user.name || '';
            document.getElementById('pEmail').value = user.email || '';
            document.getElementById('pPhone').value = user.phone || '';
            if (user.profile_image) {
                document.getElementById('pImagePreview').src = user.profile_image;
                document.getElementById('pImagePreview').classList.remove('hidden');
                document.getElementById('pImagePlaceholder').classList.add('hidden');
                document.getElementById('pImageUrl').value = user.profile_image;
            }
        }

        function populateForm(data) {
            // 기본 정보
            document.getElementById('pName').value = data.name || '';
            document.getElementById('pEmail').value = data.email || '';
            document.getElementById('pPhone').value = data.phone || '';
            document.getElementById('pPosition').value = data.position || '';
            document.getElementById('pSubject').value = data.subject || '';
            document.getElementById('pType').value = data.type || 'full';
            if (data.joined_at) {
                document.getElementById('pJoined').value = data.joined_at.split('T')[0];
            }
            
            // 프로필 이미지
            if (data.profile_image) {
                document.getElementById('pImagePreview').src = data.profile_image;
                document.getElementById('pImagePreview').classList.remove('hidden');
                document.getElementById('pImagePlaceholder').classList.add('hidden');
                document.getElementById('pImageUrl').value = data.profile_image;
            }
            
            // 상세 정보
            document.getElementById('pEducation').value = data.education || '';
            document.getElementById('pCareer').value = data.career || '';
            document.getElementById('pTrainingHistory').value = data.training_history || '';
            
            // 자격증
            if (data.certifications) {
                try {
                    const certs = Array.isArray(data.certifications) ? data.certifications : JSON.parse(data.certifications);
                    certifications = certs || [];
                    loadCertifications();
                } catch (e) {
                    console.error('Failed to parse certifications:', e);
                    certifications = [];
                }
            } else {
                certifications = [];
            }
            
            // 강의이력
            if (data.teaching_history) {
                try {
                    const history = Array.isArray(data.teaching_history) ? data.teaching_history : JSON.parse(data.teaching_history);
                    teachingHistory = history || [];
                    loadTeachingHistory();
                } catch (e) {
                    console.error('Failed to parse teaching_history:', e);
                    teachingHistory = [];
                }
            } else {
                teachingHistory = [];
            }
        }

        function switchProfileTab(tab) {
            currentProfileTab = tab;
            
            // 탭 버튼 스타일 업데이트
            ['education', 'certifications', 'training', 'teaching'].forEach(t => {
                const btn = document.getElementById('tab' + t.charAt(0).toUpperCase() + t.slice(1));
                const content = document.getElementById('content' + t.charAt(0).toUpperCase() + t.slice(1));
                
                if (t === tab) {
                    btn.className = 'pb-4 text-sm font-black uppercase tracking-widest tab-active-profile transition-all border-b-2 border-blue-600 text-blue-600';
                    content.classList.remove('hidden');
                } else {
                    btn.className = 'pb-4 text-sm font-black uppercase tracking-widest tab-inactive-profile transition-all border-b-2 border-transparent text-gray-400 hover:text-gray-600';
                    content.classList.add('hidden');
                }
            });
        }

        // 프로필 이미지 업로드
        async function handlePImage(input) {
            if (!input.files || !input.files[0]) return;
            
            const file = input.files[0];
            const formData = new FormData();
            formData.append('file', file);
            formData.append('category', 'images');
            formData.append('folder', 'profiles');
            
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('/api/upload', {
                    method: 'POST',
                    headers: { 'Authorization': 'Bearer ' + token },
                    body: formData
                });
                
                const result = await response.json();
                if (result.success) {
                    const imageUrl = result.data.url;
                    document.getElementById('pImagePreview').src = imageUrl;
                    document.getElementById('pImagePreview').classList.remove('hidden');
                    document.getElementById('pImagePlaceholder').classList.add('hidden');
                    document.getElementById('pImageUrl').value = imageUrl;
                } else {
                    alert('이미지 업로드 실패: ' + result.error);
                }
            } catch (error) {
                console.error('Image upload error:', error);
                alert('이미지 업로드 중 오류가 발생했습니다.');
            }
        }

        // 자격증 관리 (관리자 페이지와 동일한 로직)
        function addCertification(certData = null) {
            const certId = certData ? certData.id : 'new_' + (certIdCounter++);
            const container = document.getElementById('certificationsContainer');
            
            const certHtml = \`
                <div class="bg-gray-50 rounded-2xl p-6 border border-gray-200" data-cert-id="\${certId}">
                    <div class="flex justify-between items-start mb-4">
                        <h6 class="text-sm font-bold text-gray-800">자격증 정보</h6>
                        <button type="button" onclick="removeCertification('\${certId}')" class="text-red-500 hover:text-red-700">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                    <div class="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <label class="text-xs font-medium text-gray-600 mb-1 block">자격증명</label>
                            <input type="text" class="cert-name w-full px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm" placeholder="예: 정보처리기사" value="\${certData ? (certData.name || '') : ''}">
                        </div>
                        <div>
                            <label class="text-xs font-medium text-gray-600 mb-1 block">발급일</label>
                            <input type="date" class="cert-issue-date w-full px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm" value="\${certData ? (certData.issue_date ? certData.issue_date.split('T')[0] : '') : ''}">
                        </div>
                        <div>
                            <label class="text-xs font-medium text-gray-600 mb-1 block">만료일</label>
                            <input type="date" class="cert-expiry-date w-full px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm" value="\${certData ? (certData.expiry_date ? certData.expiry_date.split('T')[0] : '') : ''}">
                        </div>
                    </div>
                    <div>
                        <label class="text-xs font-medium text-gray-600 mb-1 block">자격증 파일</label>
                        <div class="space-y-2">
                            <input type="file" class="cert-file-input w-full px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm" accept=".pdf,.jpg,.jpeg,.png" multiple>
                            <div class="cert-file-list space-y-1"></div>
                            <input type="hidden" class="cert-file-urls" value="\${certData && certData.file_urls ? JSON.stringify(certData.file_urls) : '[]'}">
                        </div>
                    </div>
                </div>
            \`;
            
            container.insertAdjacentHTML('beforeend', certHtml);
            
            // 파일 입력 이벤트 리스너 추가
            const fileInput = container.querySelector(\`[data-cert-id="\${certId}"] .cert-file-input\`);
            if (fileInput) {
                fileInput.addEventListener('change', (e) => handleCertFileUpload(e, certId));
            }
            
            // 기존 파일이 있으면 표시
            if (certData && certData.file_urls) {
                loadCertFiles(certId, certData.file_urls);
            }
        }

        function removeCertification(certId) {
            const certEl = document.querySelector(\`[data-cert-id="\${certId}"]\`);
            if (certEl) {
                certEl.remove();
            }
            certifications = certifications.filter(c => c.id !== certId);
        }

        async function handleCertFileUpload(event, certId) {
            const files = event.target.files;
            if (!files || files.length === 0) return;
            
            const token = localStorage.getItem('token');
            const fileListEl = event.target.closest('[data-cert-id]').querySelector('.cert-file-list');
            const fileUrlsInput = event.target.closest('[data-cert-id]').querySelector('.cert-file-urls');
            
            // 기존 파일 URL 가져오기
            let existingFiles = [];
            try {
                const existingValue = fileUrlsInput.value;
                if (existingValue && existingValue !== '[]') {
                    existingFiles = JSON.parse(existingValue);
                }
            } catch (e) {}
            
            for (let file of files) {
                const formData = new FormData();
                formData.append('file', file);
                formData.append('category', 'documents');
                formData.append('folder', 'personnel_certs/' + certId);
                
                try {
                    const response = await fetch('/api/upload', {
                        method: 'POST',
                        headers: { 'Authorization': 'Bearer ' + token },
                        body: formData
                    });
                    
                    const result = await response.json();
                    if (result.success) {
                        const fileInfo = {
                            url: result.data.url,
                            name: result.data.originalName || file.name
                        };
                        existingFiles.push(fileInfo);
                        
                        // 파일 목록에 추가
                        const fileItem = document.createElement('div');
                        fileItem.className = 'flex items-center justify-between px-3 py-2 bg-white rounded-lg border border-gray-200';
                        fileItem.setAttribute('data-file-name', fileInfo.name);
                        fileItem.innerHTML = \`
                            <span class="text-sm text-gray-700 flex items-center">
                                <i class="fas fa-file-pdf text-red-500 mr-2"></i>
                                \${fileInfo.name}
                            </span>
                            <div class="flex items-center gap-2">
                                <button type="button" onclick="downloadCertFile('\${fileInfo.url}', '\${fileInfo.name}')" class="text-blue-600 hover:text-blue-800 text-sm">
                                    <i class="fas fa-download"></i>
                                </button>
                                <button type="button" onclick="removeCertFile(this, '\${fileInfo.url}')" class="text-red-600 hover:text-red-800 text-sm">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        \`;
                        fileListEl.appendChild(fileItem);
                    }
                } catch (error) {
                    console.error('File upload error:', error);
                    alert('파일 업로드 중 오류가 발생했습니다: ' + file.name);
                }
            }
            
            // 파일 URL 업데이트
            fileUrlsInput.value = JSON.stringify(existingFiles);
        }

        function loadCertFiles(certId, fileUrls) {
            const certEl = document.querySelector(\`[data-cert-id="\${certId}"]\`);
            if (!certEl) return;
            
            const fileListEl = certEl.querySelector('.cert-file-list');
            const fileUrlsInput = certEl.querySelector('.cert-file-urls');
            
            // fileUrls를 배열로 정규화
            let files = [];
            if (Array.isArray(fileUrls)) {
                files = fileUrls.map(f => {
                    if (typeof f === 'string') {
                        return { url: f, name: f.split('/').pop() || '파일' };
                    }
                    return f;
                });
            } else if (fileUrls) {
                files = [{ url: fileUrls, name: fileUrls.split('/').pop() || '파일' }];
            }
            
            fileListEl.innerHTML = '';
            files.forEach(fileInfo => {
                const fileItem = document.createElement('div');
                fileItem.className = 'flex items-center justify-between px-3 py-2 bg-white rounded-lg border border-gray-200';
                fileItem.setAttribute('data-file-name', fileInfo.name || fileInfo.url.split('/').pop());
                fileItem.innerHTML = \`
                    <span class="text-sm text-gray-700 flex items-center">
                        <i class="fas fa-file-pdf text-red-500 mr-2"></i>
                        \${fileInfo.name || fileInfo.url.split('/').pop()}
                    </span>
                    <div class="flex items-center gap-2">
                        <button type="button" onclick="downloadCertFile('\${fileInfo.url}', '\${fileInfo.name || fileInfo.url.split('/').pop()}')" class="text-blue-600 hover:text-blue-800 text-sm">
                            <i class="fas fa-download"></i>
                        </button>
                        <button type="button" onclick="removeCertFile(this, '\${fileInfo.url}')" class="text-red-600 hover:text-red-800 text-sm">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                \`;
                fileListEl.appendChild(fileItem);
            });
            
            fileUrlsInput.value = JSON.stringify(files);
        }

        function removeCertFile(button, fileUrl) {
            if (!confirm('파일을 삭제하시겠습니까?')) return;
            
            const fileItem = button.closest('[data-file-name]');
            const certEl = fileItem.closest('[data-cert-id]');
            const fileUrlsInput = certEl.querySelector('.cert-file-urls');
            
            try {
                let files = JSON.parse(fileUrlsInput.value || '[]');
                files = files.filter(f => f.url !== fileUrl);
                fileUrlsInput.value = JSON.stringify(files);
                fileItem.remove();
            } catch (e) {
                console.error('Failed to remove file from list:', e);
            }
        }

        async function downloadCertFile(fileUrl, fileName) {
            try {
                const token = localStorage.getItem('token');
                let downloadUrl = fileUrl;
                if (fileUrl.startsWith('/')) {
                    downloadUrl = fileUrl;
                } else if (!fileUrl.startsWith('http')) {
                    downloadUrl = '/' + fileUrl;
                }
                
                const fullUrl = downloadUrl + (downloadUrl.includes('?') ? '&' : '?') + 'download=true';
                const response = await fetch(fullUrl, {
                    method: 'GET',
                    headers: { 'Authorization': 'Bearer ' + token }
                });
                
                if (!response.ok) {
                    throw new Error(\`파일 다운로드 실패: \${response.status}\`);
                }
                
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = fileName || fileUrl.split('/').pop() || '파일';
                document.body.appendChild(a);
                a.click();
                setTimeout(() => {
                    window.URL.revokeObjectURL(url);
                    document.body.removeChild(a);
                }, 100);
            } catch (error) {
                console.error('Download error:', error);
                alert('파일 다운로드 중 오류가 발생했습니다: ' + (error.message || error));
            }
        }

        function loadCertifications() {
            const container = document.getElementById('certificationsContainer');
            container.innerHTML = '';
            
            certifications.forEach(cert => {
                addCertification(cert);
            });
        }

        // 강의이력 관리
        function addTeachingHistory(historyData = null) {
            const historyId = historyData ? historyData.id : 'teaching_' + (teachingHistoryIdCounter++);
            const container = document.getElementById('teachingHistoryContainer');
            
            const historyHtml = \`
                <div class="bg-gray-50 rounded-2xl p-6 border-2 border-gray-200" data-teaching-id="\${historyId}">
                    <div class="flex justify-between items-start mb-4">
                        <h6 class="text-sm font-bold text-gray-800">강의이력 정보</h6>
                        <button type="button" onclick="removeTeachingHistory('\${historyId}')" class="text-red-500 hover:text-red-700">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                    <div class="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <label class="text-xs font-medium text-gray-600 mb-1 block">과정명 <span class="text-red-500">*</span></label>
                            <input type="text" class="teaching-course-name w-full px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm" 
                                   placeholder="예: 3D 모델링 기초" value="\${historyData ? (historyData.course_name || '') : ''}">
                        </div>
                        <div>
                            <label class="text-xs font-medium text-gray-600 mb-1 block">수강생 수</label>
                            <input type="number" class="teaching-student-count w-full px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm" 
                                   placeholder="예: 25" value="\${historyData ? (historyData.student_count || '') : ''}">
                        </div>
                        <div>
                            <label class="text-xs font-medium text-gray-600 mb-1 block">시작일</label>
                            <input type="date" class="teaching-start-date w-full px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm" 
                                   value="\${historyData && historyData.start_date ? historyData.start_date.split('T')[0] : ''}">
                        </div>
                        <div>
                            <label class="text-xs font-medium text-gray-600 mb-1 block">종료일</label>
                            <input type="date" class="teaching-end-date w-full px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm" 
                                   value="\${historyData && historyData.end_date ? historyData.end_date.split('T')[0] : ''}">
                        </div>
                    </div>
                    <div class="mb-4">
                        <label class="text-xs font-medium text-gray-600 mb-1 block">강의 내용/설명</label>
                        <textarea class="teaching-description w-full px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm resize-none" 
                                  rows="3" placeholder="강의 내용, 커리큘럼, 주요 학습 내용 등을 입력하세요">\${historyData ? (historyData.description || '') : ''}</textarea>
                    </div>
                    <div>
                        <label class="text-xs font-medium text-gray-600 mb-1 block">기타 메모</label>
                        <textarea class="teaching-notes w-full px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm resize-none" 
                                  rows="2" placeholder="특이사항, 성과, 수강생 반응 등을 입력하세요">\${historyData ? (historyData.notes || '') : ''}</textarea>
                    </div>
                </div>
            \`;
            
            container.insertAdjacentHTML('beforeend', historyHtml);
            
            if (historyData) {
                teachingHistory.push(historyData);
            } else {
                teachingHistory.push({ id: historyId, course_name: '', start_date: '', end_date: '', student_count: '', description: '', notes: '' });
            }
        }

        function removeTeachingHistory(historyId) {
            if (!confirm('강의이력을 삭제하시겠습니까?')) return;
            
            const historyEl = document.querySelector(\`[data-teaching-id="\${historyId}"]\`);
            if (historyEl) {
                historyEl.remove();
            }
            teachingHistory = teachingHistory.filter(h => h.id !== historyId);
        }

        function loadTeachingHistory() {
            const container = document.getElementById('teachingHistoryContainer');
            container.innerHTML = '';
            
            if (teachingHistory.length === 0) {
                container.innerHTML = '<div class="text-center py-8 text-gray-400 text-sm">강의이력이 없습니다. 추가 버튼을 클릭하여 이력을 추가하세요.</div>';
                return;
            }
            
            teachingHistory.forEach(history => {
                addTeachingHistory(history);
            });
        }

        async function handleSaveProfile(event) {
            event.preventDefault();
            
            try {
                const token = localStorage.getItem('token');
                const form = event.target;
                
                // 자격증 데이터 수집
                const certs = [];
                document.querySelectorAll('[data-cert-id]').forEach(certEl => {
                    const certId = certEl.getAttribute('data-cert-id');
                    const name = certEl.querySelector('.cert-name').value;
                    const issueDate = certEl.querySelector('.cert-issue-date').value;
                    const expiryDate = certEl.querySelector('.cert-expiry-date').value;
                    const fileUrlsInput = certEl.querySelector('.cert-file-urls');
                    
                    let fileUrls = [];
                    try {
                        fileUrls = JSON.parse(fileUrlsInput.value || '[]');
                    } catch (e) {}
                    
                    if (name || issueDate || expiryDate || fileUrls.length > 0) {
                        certs.push({
                            id: certId,
                            name: name || null,
                            issue_date: issueDate || null,
                            expiry_date: expiryDate || null,
                            file_urls: fileUrls
                        });
                    }
                });
                
                // 강의이력 데이터 수집
                const teachingHistoryData = [];
                document.querySelectorAll('[data-teaching-id]').forEach(historyEl => {
                    const historyId = historyEl.getAttribute('data-teaching-id');
                    const courseName = historyEl.querySelector('.teaching-course-name').value;
                    const startDate = historyEl.querySelector('.teaching-start-date').value;
                    const endDate = historyEl.querySelector('.teaching-end-date').value;
                    const studentCount = historyEl.querySelector('.teaching-student-count').value;
                    const description = historyEl.querySelector('.teaching-description').value;
                    const notes = historyEl.querySelector('.teaching-notes').value;
                    
                    if (courseName || startDate || endDate || studentCount || description || notes) {
                        teachingHistoryData.push({
                            id: historyId,
                            course_name: courseName || null,
                            start_date: startDate || null,
                            end_date: endDate || null,
                            student_count: studentCount || null,
                            description: description || null,
                            notes: notes || null
                        });
                    }
                });
                
                // 폼 데이터 수집
                const data = {
                    name: form.pName.value,
                    email: form.pEmail.value,
                    phone: form.pPhone.value,
                    position: form.pPosition.value || null,
                    subject: form.pSubject.value || null,
                    type: form.pType.value,
                    joined_at: form.pJoined.value || null,
                    profile_image: form.pImageUrl.value || null,
                    education: form.pEducation.value || null,
                    career: form.pCareer.value || null,
                    certifications: certs.length > 0 ? JSON.stringify(certs) : '[]',
                    training_history: form.pTrainingHistory.value || null,
                    teaching_history: teachingHistoryData.length > 0 ? JSON.stringify(teachingHistoryData) : '[]'
                };
                
                // API 호출
                const response = await fetch(\`/api/hrd/personnel/\${currentUserId}\`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token
                    },
                    body: JSON.stringify(data)
                });
                
                const result = await response.json();
                if (result.success) {
                    alert('개인정보가 저장되었습니다.');
                    // 사용자 정보 업데이트
                    const user = JSON.parse(localStorage.getItem('user') || '{}');
                    user.name = data.name;
                    user.email = data.email;
                    user.phone = data.phone;
                    user.profile_image = data.profile_image;
                    localStorage.setItem('user', JSON.stringify(user));
                    // 대시보드로 이동
                    window.location.href = '/teacher';
                } else {
                    alert('저장 실패: ' + (result.error || '알 수 없는 오류'));
                }
            } catch (error) {
                console.error('Save error:', error);
                alert('저장 중 오류가 발생했습니다: ' + (error.message || error));
            }
        }
    </script>
    <style>
        .tab-active-profile {
            border-bottom-color: #2563eb;
            color: #2563eb;
        }
        .tab-inactive-profile {
            border-bottom-color: transparent;
            color: #9ca3af;
        }
        .tab-inactive-profile:hover {
            color: #4b5563;
        }
    </style>
</body>
</html>
`;
