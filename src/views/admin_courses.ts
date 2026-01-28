import { hrdSidebar } from './components/hrd_sidebar';

export const adminCoursesListHtml = (sidebar = hrdSidebar('courses')) => `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>교육과정 관리 - 통합 교육행정 시스템</title>
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
    <style>
        .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f1f1f1; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #9ca3af; }
    </style>
</head>
<body class="bg-gray-50 font-sans text-gray-900">
    <div class="flex h-screen overflow-hidden">
        ${sidebar}
        <div class="flex-1 flex flex-col overflow-hidden bg-gray-50">
            <div class="bg-white border-b border-gray-200 flex-shrink-0">
                <div class="px-8 py-6">
                    <div class="flex justify-between items-center">
                        <div>
                            <h1 class="text-2xl font-bold text-gray-800">교육과정 관리</h1>
                            <p class="text-gray-600 mt-1">교육 과정을 개설하고 관리합니다.</p>
                        </div>
                        <button id="btnCreateCourse" onclick="openModal('createCourseModal')" class="px-5 py-2.5 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition flex items-center shadow-lg shadow-purple-100 font-bold">
                            <i class="fas fa-plus mr-2"></i> 과정 개설
                        </button>
                    </div>
                </div>
            </div>
            <main class="flex-1 overflow-y-auto p-8 custom-scrollbar">
                <div class="bg-white rounded-2xl shadow-sm p-5 mb-8 flex flex-wrap gap-4 items-center justify-between border border-gray-100">
                    <div class="flex gap-4 items-center flex-1">
                        <select id="categoryFilter" onchange="loadCourses(1)" class="px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-100 focus:border-purple-600 outline-none transition-all text-sm font-medium">
                            <option value="">전체 카테고리</option>
                            <option value="국비지원">국비지원</option>
                            <option value="일반과정">일반과정</option>
                            <option value="특강">특강</option>
                        </select>
                        <div class="relative max-w-md w-full">
                            <input type="text" id="searchInput" placeholder="과정명 또는 키워드 검색" onkeyup="if(event.key === 'Enter') loadCourses(1)" class="w-full pl-11 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-100 focus:border-purple-600 outline-none transition-all text-sm">
                            <i class="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                        </div>
                    </div>
                    <div class="flex items-center gap-2">
                         <button onclick="loadCourses(1)" class="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-purple-600 transition-all">
                            <i class="fas fa-sync-alt"></i>
                         </button>
                    </div>
                </div>
                
                <div class="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100 mb-6">
                    <div class="overflow-x-auto">
                        <table class="min-w-full divide-y divide-gray-100">
                            <thead>
                                <tr class="bg-gray-50/50">
                                    <th class="px-6 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">상태</th>
                                    <th class="px-6 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">과정 정보</th>
                                    <th class="px-6 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">교육 기간</th>
                                    <th class="px-6 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">담당 강사</th>
                                    <th class="px-6 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">수강료</th>
                                    <th class="px-6 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">정원/신청</th>
                                    <th class="px-6 py-4 text-right text-[11px] font-bold text-gray-400 uppercase tracking-wider">관리</th>
                                </tr>
                            </thead>
                            <tbody id="coursesTableBody" class="divide-y divide-gray-100">
                                <tr><td colspan="7" class="px-6 py-16 text-center text-gray-400 font-medium"><i class="fas fa-spinner fa-spin mr-3 text-purple-600"></i> 데이터를 불러오는 중입니다...</td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- 페이지네이션 -->
                <div id="paginationContainer" class="flex items-center justify-between bg-white px-6 py-4 rounded-2xl border border-gray-100 shadow-sm">
                    <div class="text-sm text-gray-500 font-medium">
                        총 <span id="totalCount" class="text-purple-600 font-bold">0</span>개의 과정
                    </div>
                    <div class="flex items-center gap-2" id="paginationButtons">
                        <!-- 페이지 버튼 동적 생성 -->
                    </div>
                </div>
            </main>
        </div>
    </div>

    <!-- 과정 개설/수정 모달 -->
    <div id="createCourseModal" class="fixed inset-0 bg-black/60 hidden z-50 flex items-center justify-center backdrop-blur-sm">
        <div class="bg-white rounded-3xl shadow-2xl w-full max-w-4xl mx-4 max-h-[94vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-300">
            <div class="px-10 py-6 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-20">
                <div class="flex items-center gap-4">
                    <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-purple-200">
                        <i class="fas fa-graduation-cap text-2xl"></i>
                    </div>
                    <div>
                        <h3 class="text-xl font-bold text-gray-900" id="modalTitle">과정 개설</h3>
                        <p class="text-sm text-gray-500 mt-0.5">교육 과정을 상세하게 구성하고 강사를 배정하세요.</p>
                    </div>
                </div>
                <button onclick="closeModal('createCourseModal')" class="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-all">
                    <i class="fas fa-times text-lg"></i>
                </button>
            </div>
            
            <div class="p-0 overflow-y-auto flex-1 custom-scrollbar bg-gray-50/50">
                <form id="createCourseForm" onsubmit="handleSaveCourse(event)" class="divide-y divide-gray-100">
                    <input type="hidden" name="id" id="courseId">
                    
                    <!-- 섹션 1: 기본 정보 -->
                    <div class="p-10 space-y-8 bg-white">
                        <div class="flex items-center gap-2.5">
                            <div class="w-1.5 h-6 bg-purple-600 rounded-full"></div>
                            <h4 class="font-bold text-lg text-gray-900">기본 정보 설정</h4>
                        </div>
                        
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div class="md:col-span-2">
                                <label class="block text-sm font-bold text-gray-700 mb-2">과정명 <span class="text-red-500 font-bold ml-1">*</span></label>
                                <input type="text" name="title" id="courseTitle" required placeholder="예: [국비지원] 하이브리드 클라우드 AI 엔지니어 양성과정" 
                                    class="w-full px-5 py-3.5 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-purple-50 focus:border-purple-600 outline-none transition-all text-gray-800 font-medium">
                            </div>
                            
                            <div>
                                <label class="block text-sm font-bold text-gray-700 mb-2">과정 카테고리</label>
                                <select name="category" id="courseCategory" class="w-full px-5 py-3.5 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-purple-50 focus:border-purple-600 outline-none transition-all bg-white font-medium">
                                    <option value="국비지원">국비지원과정 (HRD)</option>
                                    <option value="일반과정">일반 유료과정</option>
                                    <option value="특강">단기 특강/워크숍</option>
                                </select>
                            </div>
                            
                            <div>
                                <label class="block text-sm font-bold text-gray-700 mb-2">현재 모집 상태</label>
                                <select name="status" id="courseStatus" class="w-full px-5 py-3.5 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-purple-50 focus:border-purple-600 outline-none transition-all bg-white font-medium text-purple-700 font-bold">
                                    <option value="open">현재 모집중 (Active)</option>
                                    <option value="closed">모집 마감 (Closed)</option>
                                    <option value="preparing">준비중 (Draft)</option>
                                </select>
                            </div>

                            <div>
                                <label class="block text-sm font-bold text-gray-700 mb-2">메인 담당 강사</label>
                                <select name="teacher_id" id="courseInstructor" class="w-full px-5 py-3.5 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-purple-50 focus:border-purple-600 outline-none transition-all bg-white font-medium">
                                    <option value="">강사 목록 로드 중...</option>
                                </select>
                            </div>

                            <div>
                                <label class="block text-sm font-bold text-gray-700 mb-2">교육 캠퍼스</label>
                                <select name="campus_id" id="courseCampus" class="w-full px-5 py-3.5 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-purple-50 focus:border-purple-600 outline-none transition-all bg-white font-medium">
                                    <option value="1">서울 메인 캠퍼스</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <!-- 섹션 2: 교육 과목 및 개별 강사 배정 -->
                    <div class="p-10 space-y-6 bg-gray-50/30">
                        <div class="flex items-center justify-between">
                            <div class="flex items-center gap-2.5">
                                <div class="w-1.5 h-6 bg-purple-600 rounded-full"></div>
                                <h4 class="font-bold text-lg text-gray-900">교과목 및 강사 배정</h4>
                            </div>
                            <button type="button" onclick="addSubjectRow()" class="px-4 py-2 bg-white text-purple-600 border border-purple-200 rounded-xl hover:bg-purple-600 hover:text-white transition-all text-xs font-bold shadow-sm flex items-center gap-2">
                                <i class="fas fa-plus"></i> 과목 추가
                            </button>
                        </div>
                        
                        <div class="bg-gray-100/50 rounded-2xl p-5 border border-gray-200/50">
                            <div class="hidden sm:grid grid-cols-12 gap-5 px-3 mb-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                                <div class="col-span-1 text-center">NO</div>
                                <div class="col-span-5">교육 과목명</div>
                                <div class="col-span-5">과목 담당 강사</div>
                                <div class="col-span-1 text-center">삭제</div>
                            </div>
                            <div id="subjectListContainer" class="space-y-3">
                                <!-- Dynamic rows -->
                            </div>
                        </div>
                    </div>

                    <!-- 섹션 3: 일정 및 정원 -->
                    <div class="p-10 space-y-8 bg-white">
                        <div class="flex items-center gap-2.5">
                            <div class="w-1.5 h-6 bg-purple-600 rounded-full"></div>
                            <h4 class="font-bold text-lg text-gray-900">교육 일정 및 상세 인원</h4>
                        </div>
                        
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div class="space-y-2">
                                <label class="block text-sm font-bold text-gray-700">시작일</label>
                                <input type="date" name="start_date" id="courseStartDate" onchange="renderCalendar()" 
                                    class="w-full px-5 py-3 border border-gray-200 rounded-2xl outline-none focus:ring-4 focus:ring-purple-50 focus:border-purple-600 transition-all font-medium">
                            </div>
                            <div class="space-y-2">
                                <label class="block text-sm font-bold text-gray-700">종료일</label>
                                <input type="date" name="end_date" id="courseEndDate" onchange="renderCalendar()" 
                                    class="w-full px-5 py-3 border border-gray-200 rounded-2xl outline-none focus:ring-4 focus:ring-purple-50 focus:border-purple-600 transition-all font-medium">
                            </div>
                            <div class="space-y-2">
                                <label class="block text-sm font-bold text-gray-700">정원 (명)</label>
                                <input type="number" name="max_students" id="courseMaxStudents" placeholder="20" 
                                    class="w-full px-5 py-3 border border-gray-200 rounded-2xl outline-none focus:ring-4 focus:ring-purple-50 focus:border-purple-600 transition-all font-medium">
                            </div>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
                            <div class="space-y-2">
                                <label class="block text-sm font-bold text-gray-700">일일 교육 시간</label>
                                <div class="flex items-center gap-3">
                                    <input type="time" id="courseStartTime" class="flex-1 px-5 py-3 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-purple-50 outline-none font-medium">
                                    <span class="text-gray-400 font-bold">~</span>
                                    <input type="time" id="courseEndTime" class="flex-1 px-5 py-3 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-purple-50 outline-none font-medium">
                                </div>
                            </div>
                            <div class="space-y-2">
                                <label class="block text-sm font-bold text-purple-700 uppercase tracking-tighter">수강료 (KRW)</label>
                                <div class="relative">
                                    <span class="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₩</span>
                                    <input type="number" name="price" id="coursePrice" placeholder="0" 
                                        class="w-full pl-11 pr-5 py-3 bg-purple-50/30 border border-purple-100 rounded-2xl focus:ring-4 focus:ring-purple-100 focus:border-purple-600 outline-none font-bold text-gray-900 text-lg">
                                </div>
                            </div>
                        </div>

                        <div class="mt-8 bg-gray-50 rounded-3xl p-8 border border-gray-200/50 shadow-inner">
                             <div class="flex items-center justify-between mb-6">
                                 <div>
                                    <label class="block text-sm font-bold text-gray-800">교육 세부 일정 선택</label>
                                    <p class="text-[11px] text-gray-400 mt-0.5">실제 교육이 진행되는 날짜를 달력에서 직접 선택하세요.</p>
                                 </div>
                                 <button type="button" onclick="clearCalendarSelection()" class="text-xs font-bold text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-all border border-red-100 bg-white">전체 초기화</button>
                             </div>
                             
                             <div class="flex flex-wrap gap-2.5 mb-8">
                                <button type="button" onclick="presetDays([1,2,3,4,5])" class="px-5 py-2.5 text-xs font-bold bg-white border border-gray-200 text-gray-600 rounded-2xl hover:border-purple-400 hover:text-purple-600 transition-all shadow-sm">서울 평일반 (월-금)</button>
                                <button type="button" onclick="presetDays([1,3,5])" class="px-5 py-2.5 text-xs font-bold bg-white border border-gray-200 text-gray-600 rounded-2xl hover:border-purple-400 hover:text-purple-600 transition-all shadow-sm">월수금 집중반</button>
                                <button type="button" onclick="presetDays([0,6])" class="px-5 py-2.5 text-xs font-bold bg-white border border-gray-200 text-gray-600 rounded-2xl hover:border-purple-400 hover:text-purple-600 transition-all shadow-sm">주말 마스터반</button>
                             </div>

                             <div id="calendarContainer" class="border border-gray-200 rounded-2xl p-6 bg-white max-h-[480px] overflow-y-auto custom-scrollbar select-none">
                                <div class="text-center text-gray-300 py-20 flex flex-col items-center">
                                    <i class="fas fa-calendar-day text-5xl mb-4 opacity-20"></i>
                                    <p class="font-bold text-gray-400">교육 시작일과 종료일을 설정해 주세요.</p>
                                </div>
                             </div>

                             <div class="mt-6 flex items-center gap-4 bg-purple-600 rounded-2xl p-4 text-white shadow-lg shadow-purple-200">
                                <div class="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                                    <i class="fas fa-check-circle"></i>
                                </div>
                                <div>
                                    <p class="text-[10px] font-bold text-purple-100 uppercase tracking-widest">Selected Duration</p>
                                    <input type="text" id="courseDays" value="총 0일 선택됨" class="bg-transparent font-bold text-xl text-white w-full outline-none border-none cursor-default" readonly>
                                </div>
                             </div>
                        </div>
                    </div>

                    <!-- 섹션 4: 상세 커리큘럼 및 이미지 -->
                    <div class="p-10 space-y-8 bg-white">
                        <div class="flex items-center gap-2.5">
                            <div class="w-1.5 h-6 bg-purple-600 rounded-full"></div>
                            <h4 class="font-bold text-lg text-gray-900">상세 설명 및 디자인</h4>
                        </div>
                        
                        <div class="space-y-4">
                            <label class="block text-sm font-bold text-gray-700">과정 전체 커리큘럼 / 소개</label>
                            <div class="rounded-2xl overflow-hidden border border-gray-200">
                                <textarea id="courseDescription" rows="12" class="w-full px-5 py-4 outline-none"></textarea>
                            </div>
                        </div>
                        
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div class="space-y-4">
                                <label class="block text-sm font-bold text-gray-700">대표 썸네일 이미지</label>
                                <div class="flex gap-2">
                                    <input type="text" name="thumbnail_url" id="courseThumbnail" placeholder="https://" class="flex-1 px-5 py-3.5 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-purple-50 outline-none text-sm">
                                    <input type="file" id="thumbnailFile" accept="image/*" class="hidden" onchange="handleThumbnailFile(this)">
                                    <button type="button" onclick="document.getElementById('thumbnailFile').click()" class="px-5 py-2.5 bg-gray-900 text-white rounded-2xl text-xs font-bold hover:bg-black transition-all shadow-sm">업로드</button>
                                </div>
                                <div id="thumbnailPreview" class="hidden relative aspect-video rounded-3xl overflow-hidden border border-gray-100 shadow-xl group">
                                    <img src="" class="w-full h-full object-cover">
                                    <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <button type="button" onclick="clearThumbnail()" class="w-12 h-12 rounded-full bg-white text-red-500 flex items-center justify-center hover:scale-110 transition-transform shadow-lg">
                                            <i class="fas fa-trash-alt text-xl"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="bg-blue-50/50 p-8 rounded-[32px] border border-blue-100/50 self-start">
                                <h5 class="font-bold text-blue-900 flex items-center gap-2 mb-4">
                                    <i class="fas fa-info-circle"></i> 참고 사항
                                </h5>
                                <ul class="text-sm text-blue-800/80 space-y-3 leading-relaxed font-medium">
                                    <li>• 과정명은 사용자 홈페이지 상단에 굵게 노출됩니다.</li>
                                    <li>• 교육 과목별로 다른 강사를 배정하면, LMS 시스템에서 과목별 진도 관리가 가능해집니다.</li>
                                    <li>• 이미지는 1280x720 (16:9) 사이즈를 권장합니다.</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div class="px-10 py-8 bg-gray-50 flex justify-end items-center gap-4 sticky bottom-0 z-20 border-t border-gray-200/50">
                        <button type="button" onclick="closeModal('createCourseModal')" class="px-7 py-3 text-gray-500 font-bold hover:bg-white hover:text-gray-900 rounded-2xl transition-all">취소</button>
                        <button type="submit" class="px-10 py-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-2xl font-black text-lg shadow-xl shadow-purple-200 hover:shadow-purple-300 hover:-translate-y-1 active:translate-y-0 transition-all">시큐어 저장 및 개설</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <script>
        let instructorsData = [];
        let selectedDates = new Set();
        let currentPage = 1;
        const itemsPerPage = 10;

        window.onload = () => {
             loadCourses(1);
             loadInstructors();
             const user = JSON.parse(localStorage.getItem('user') || '{}');
             if (user.role === 'teacher') {
                 const btn = document.getElementById('btnCreateCourse');
                 if (btn) btn.style.display = 'none';
             }
        };

        async function loadInstructors() {
            try {
                const res = await fetch('/api/hrd/personnel');
                const result = await res.json();
                if (result.success) {
                    instructorsData = result.data;
                    const mainSelect = document.getElementById('courseInstructor');
                    mainSelect.innerHTML = '<option value="">메인 담당 강사 선택</option>';
                    instructorsData.forEach(p => {
                        const opt = document.createElement('option');
                        opt.value = p.id;
                        opt.textContent = p.name + ' (' + p.position + ')';
                        mainSelect.appendChild(opt);
                    });
                }
            } catch (e) { console.error('Load instructors error:', e); }
        }

        function addSubjectRow(name = '', instructorId = '') {
            const container = document.getElementById('subjectListContainer');
            const rowCount = container.children.length;
            const row = document.createElement('div');
            row.className = 'grid grid-cols-12 gap-5 items-center bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all animate-in slide-in-from-right-3 duration-300';
            
            const instructorOptions = instructorsData.map(p => 
                \`<option value="\${p.id}" \${p.id == instructorId ? 'selected' : ''}>\${p.name} (\${p.position})</option>\`
            ).join('');

            row.innerHTML = \`
                <div class="col-span-1 flex items-center justify-center">
                    <div class="w-7 h-7 rounded-full bg-gray-50 flex items-center justify-center text-[10px] font-bold text-gray-400 border border-gray-100">\${rowCount + 1}</div>
                </div>
                <div class="col-span-5">
                    <input type="text" class="subject-name w-full px-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-100 focus:border-purple-400 outline-none transition-all placeholder:text-gray-300" placeholder="교과목 코드 또는 명칭" value="\${name}">
                </div>
                <div class="col-span-5">
                    <select class="subject-instructor w-full px-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-100 focus:border-purple-400 outline-none transition-all">
                        <option value="">강사 배정</option>
                        \${instructorOptions}
                    </select>
                </div>
                <div class="col-span-1 flex justify-center">
                    <button type="button" onclick="this.closest('.grid').remove(); updateSubjectIndices();" class="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-50 text-gray-300 hover:text-red-500 hover:bg-red-50 transition-all">
                        <i class="fas fa-trash text-sm"></i>
                    </button>
                </div>
            \`;
            container.appendChild(row);
        }

        function updateSubjectIndices() {
            document.querySelectorAll('#subjectListContainer > div').forEach((row, idx) => {
                const badge = row.querySelector('.col-span-1 div');
                if (badge) badge.textContent = idx + 1;
            });
        }

        async function loadCourses(page = 1) {
            currentPage = page;
            const cat = document.getElementById('categoryFilter').value;
            const s = document.getElementById('searchInput').value;
            let url = \`/api/courses?sort=latest&page=\${page}&limit=\${itemsPerPage}&\`;
            if (cat) url += 'category=' + encodeURIComponent(cat) + '&';
            if (s) url += 'search=' + encodeURIComponent(s);
            
            try {
                const res = await fetch(url, { headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') } });
                const r = await res.json();
                const tbody = document.getElementById('coursesTableBody');
                
                if (!r.success || !r.data || r.data.length === 0) {
                    tbody.innerHTML = '<tr><td colspan="7" class="px-6 py-20 text-center text-gray-400 font-medium">과정 데이터가 없거나 조건에 맞는 결과가 없습니다.</td></tr>';
                    renderPagination(0);
                    document.getElementById('totalCount').textContent = '0';
                    return;
                }
                
                document.getElementById('totalCount').textContent = r.pagination?.total || r.data.length;

                tbody.innerHTML = r.data.map(c => {
                    let subjectMap = c.subject || '-';
                    if (subjectMap.startsWith('[')) {
                        try {
                            const subjects = JSON.parse(subjectMap);
                            subjectMap = subjects.map(it => it.name).join(', ');
                        } catch(e) {}
                    }
                    
                    const statusColors = {
                        active: 'bg-green-100 text-green-700',
                        open: 'bg-green-100 text-green-700',
                        closed: 'bg-red-100 text-red-700',
                        full: 'bg-orange-100 text-orange-700',
                        preparing: 'bg-gray-100 text-gray-600'
                    };
                    const statusText = { active: '진행중', open: '모집중', closed: '마감', full: '정원초과', preparing: '준비중' };
                    
                    return \`
                        <tr class="hover:bg-gray-50/80 transition-all border-b border-gray-50 group">
                            <td class="px-6 py-5 whitespace-nowrap">
                                <span class="px-3 py-1 rounded-full text-[10px] font-bold \${statusColors[c.status] || 'bg-gray-100 text-gray-600'} uppercase tracking-wider">\${statusText[c.status] || '알수없음'}</span>
                            </td>
                            <td class="px-6 py-5">
                                <div class="font-bold text-gray-900 group-hover:text-purple-700 transition-colors">\${c.title}</div>
                                <div class="text-[11px] text-gray-400 mt-1 line-clamp-1">\${subjectMap}</div>
                            </td>
                            <td class="px-6 py-5 whitespace-nowrap text-sm text-gray-600 font-medium">
                                \${c.start_date?.split('T')[0] || '-'} <span class="text-gray-300 mx-1">~</span> \${c.end_date?.split('T')[0] || '-'}
                            </td>
                            <td class="px-6 py-5 whitespace-nowrap">
                                <div class="flex items-center gap-2">
                                    <div class="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-500">\${(c.teacher_name || '?')[0]}</div>
                                    <span class="text-sm text-gray-700 font-bold">\${c.teacher_name || '-'}</span>
                                </div>
                            </td>
                            <td class="px-6 py-5 whitespace-nowrap font-bold text-gray-900">\${Number(c.price || 0).toLocaleString()}원</td>
                            <td class="px-6 py-5 whitespace-nowrap">
                                <div class="text-sm font-bold text-gray-600">\${c.max_students || 0}명</div>
                                <div class="w-16 h-1 bg-gray-100 rounded-full mt-2 overflow-hidden"><div class="h-full bg-purple-500" style="width: 30%"></div></div>
                            </td>
                            <td class="px-6 py-5 text-right whitespace-nowrap space-x-1">
                                <a href="/admin/courses/\${c.id}/lms" class="px-3 py-1.5 rounded-lg text-[11px] font-black uppercase text-purple-600 bg-purple-50 hover:bg-purple-600 hover:text-white transition-all shadow-sm">Manage</a>
                                <button onclick='editCourse(\${JSON.stringify(c).replace(/'/g, "&#39;")})' class="w-8 h-8 rounded-lg text-blue-500 hover:bg-blue-50 transition-all"><i class="fas fa-edit"></i></button>
                                \${JSON.parse(localStorage.getItem('user') || '{}').role === 'admin' ? \`<button onclick="deleteCourse(\${c.id})" class="w-8 h-8 rounded-lg text-red-400 hover:bg-red-50 transition-all"><i class="fas fa-trash-alt"></i></button>\` : ''}
                            </td>
                        </tr>
                    \`;
                }).join('');

                if (r.pagination) {
                    renderPagination(r.pagination.totalPages);
                } else {
                    renderPagination(1);
                }
            } catch(e) { console.error('Load courses error:', e); }
        }

        function renderPagination(totalPages) {
            const container = document.getElementById('paginationButtons');
            if (totalPages <= 1) {
                container.innerHTML = '';
                return;
            }

            let html = '';
            // 이전 버튼
            html += \`<button onclick="loadCourses(\${currentPage - 1})" \${currentPage === 1 ? 'disabled' : ''} class="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-100 text-gray-400 hover:bg-gray-50 disabled:opacity-30 disabled:hover:bg-transparent transition-all"><i class="fas fa-chevron-left text-xs"></i></button>\`;

            // 페이지 번호
            for (let i = 1; i <= totalPages; i++) {
                const isActive = i === currentPage;
                html += \`<button onclick="loadCourses(\${i})" class="w-10 h-10 flex items-center justify-center rounded-xl font-bold text-sm transition-all \${isActive ? 'bg-purple-600 text-white shadow-lg shadow-purple-200' : 'text-gray-500 hover:bg-gray-50 border border-transparent'}">\${i}</button>\`;
            }

            // 다음 버튼
            html += \`<button onclick="loadCourses(\${currentPage + 1})" \${currentPage === totalPages ? 'disabled' : ''} class="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-100 text-gray-400 hover:bg-gray-50 disabled:opacity-30 disabled:hover:bg-transparent transition-all"><i class="fas fa-chevron-right text-xs"></i></button>\`;

            container.innerHTML = html;
        }

        function openModal(modalId, course = null) {
            const f = document.getElementById('createCourseForm');
            const subContainer = document.getElementById('subjectListContainer');
            subContainer.innerHTML = '';
            selectedDates.clear();
            
            if (course) {
                document.getElementById('modalTitle').textContent = '교육과정 수정';
                document.getElementById('courseId').value = course.id;
                document.getElementById('courseTitle').value = course.title;
                document.getElementById('courseCategory').value = course.category || '국비지원';
                document.getElementById('courseStatus').value = course.status || 'open';
                document.getElementById('courseInstructor').value = course.teacher_id || '';
                document.getElementById('courseCampus').value = course.campus_id || '1';
                document.getElementById('coursePrice').value = course.price || '';
                document.getElementById('courseMaxStudents').value = course.max_students || '';
                document.getElementById('courseStartDate').value = course.start_date ? course.start_date.split('T')[0] : '';
                document.getElementById('courseEndDate').value = course.end_date ? course.end_date.split('T')[0] : '';
                document.getElementById('courseThumbnail').value = course.thumbnail_url || '';
                updateThumbnailPreview(course.thumbnail_url || '');

                if (course.subject) {
                    try {
                        if (course.subject.startsWith('[')) {
                            JSON.parse(course.subject).forEach(s => addSubjectRow(s.name, s.instructorId));
                        } else {
                            addSubjectRow(course.subject, course.teacher_id);
                        }
                    } catch(e) { addSubjectRow(course.subject); }
                } else { addSubjectRow(); }

                if (course.schedule && course.schedule.startsWith('{')) {
                    const sch = JSON.parse(course.schedule);
                    document.getElementById('courseStartTime').value = sch.startTime || '';
                    document.getElementById('courseEndTime').value = sch.endTime || '';
                }
                if (course.class_days) {
                    try {
                        const days = typeof course.class_days === 'string' ? JSON.parse(course.class_days) : course.class_days;
                        if(Array.isArray(days)) days.forEach(d => selectedDates.add(d));
                    } catch(e) {}
                }
                initTinyMCE(course.description || '');
            } else {
                document.getElementById('modalTitle').textContent = '신규 과정 개설';
                f.reset();
                document.getElementById('courseId').value = '';
                document.getElementById('courseStatus').value = 'preparing';
                addSubjectRow();
                initTinyMCE('');
                updateThumbnailPreview('');
            }
            document.getElementById(modalId).classList.remove('hidden');
            setTimeout(renderCalendar, 150);
        }

        function closeModal(id) { 
            document.getElementById(id).classList.add('hidden');
            if (tinymce.get('courseDescription')) tinymce.get('courseDescription').remove();
        }

        function initTinyMCE(content) {
            if (tinymce.get('courseDescription')) tinymce.get('courseDescription').remove();
            tinymce.init({
                selector: '#courseDescription', height: 450, menubar: false,
                plugins: ['advlist', 'autolink', 'lists', 'link', 'image', 'code', 'help', 'wordcount'],
                toolbar: 'undo redo | blocks | bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | code help',
                content_style: 'body { font-family:Inter,Helvetica,Arial,sans-serif; font-size:14px; color: #374151; }',
                setup: function (ed) { ed.on('init', function () { ed.setContent(content); }); }
            });
        }

        function toggleDate(dateStr) {
            if (selectedDates.has(dateStr)) selectedDates.delete(dateStr);
            else selectedDates.add(dateStr);
            renderCalendar();
        }

        function renderCalendar() {
            const startStr = document.getElementById('courseStartDate').value;
            const endStr = document.getElementById('courseEndDate').value;
            const container = document.getElementById('calendarContainer');
            if (!startStr || !endStr) {
                container.innerHTML = '<div class="text-center text-gray-300 py-12 flex flex-col items-center"><i class="fas fa-info-circle mb-3"></i> 기간을 설정해 주세요.</div>';
                return;
            }

            const start = new Date(startStr);
            const end = new Date(endStr);
            let html = '<div class="space-y-12">';
            let curr = new Date(startStr);
            curr.setDate(1);

            while (curr <= end) {
                const year = curr.getFullYear();
                const month = curr.getMonth();
                html += \`<div class="course-month px-2">
                    <div class="flex items-baseline justify-center gap-2 mb-4">
                        <span class="text-2xl font-black text-gray-900">\${month+1}</span>
                        <span class="text-xs font-bold text-gray-400 uppercase tracking-tighter">\${year} / MONTH</span>
                    </div>
                    <div class="grid grid-cols-7 text-center text-[10px] font-bold text-gray-300 mb-2 uppercase tracking-widest">
                        <div class="text-red-300">SUN</div><div>MON</div><div>TUE</div><div>WED</div><div>THU</div><div>FRI</div><div class="text-blue-300">SAT</div>
                    </div>
                    <div class="grid grid-cols-7 gap-1">\`;
                
                const firstDay = new Date(year, month, 1).getDay();
                for (let i = 0; i < firstDay; i++) html += '<div class="aspect-square bg-gray-50/30 rounded-lg"></div>';
                
                const lastDate = new Date(year, month + 1, 0).getDate();
                for (let d = 1; d <= lastDate; d++) {
                    const dateObj = new Date(year, month, d);
                    const y = dateObj.getFullYear();
                    const m_str = String(dateObj.getMonth()+1).padStart(2,'0');
                    const d_str = String(dateObj.getDate()).padStart(2,'0');
                    const dFull = \`\${y}-\${m_str}-\${d_str}\`;
                    
                    const isInRange = dFull >= startStr && dFull <= endStr;
                    const isSelected = selectedDates.has(dFull);
                    const isToday = dFull === new Date().toISOString().split('T')[0];
                    
                    let cls = "aspect-square rounded-xl flex flex-col items-center justify-center transition-all relative text-sm ";
                    if (!isInRange) cls += "text-gray-200 cursor-not-allowed";
                    else if (isSelected) cls += "bg-purple-600 text-white font-bold shadow-lg shadow-purple-100 cursor-pointer scale-105 z-10";
                    else cls += "bg-white text-gray-600 hover:bg-gray-100 cursor-pointer border border-gray-100";
                    
                    if (isInRange && isToday && !isSelected) cls += " border-purple-300 text-purple-600 ring-2 ring-purple-50";

                    html += \`<div class="\${cls}" \${isInRange ? \`onclick="toggleDate('\${dFull}')"\` : ''}>
                        \${d}
                        \${isSelected ? '<div class="absolute bottom-1.5 w-1 h-1 bg-white/50 rounded-full"></div>' : ''}
                    </div>\`;
                }
                html += '</div></div>';
                curr.setMonth(month + 1);
            }
            container.innerHTML = html;
            document.getElementById('courseDays').value = \`총 \${selectedDates.size}일 선택됨\`;
        }

        async function handleSaveCourse(e) {
            e.preventDefault();
            if (tinymce.get('courseDescription')) tinymce.triggerSave();
            const f = e.target;
            const fd = new FormData(f);
            const data = Object.fromEntries(fd.entries());
            
            data.description = document.getElementById('courseDescription').value;
            data.class_days = Array.from(selectedDates).sort();
            data.schedule = JSON.stringify({
                startTime: document.getElementById('courseStartTime').value,
                endTime: document.getElementById('courseEndTime').value,
                days: document.getElementById('courseDays').value
            });

            const rows = document.querySelectorAll('#subjectListContainer > div');
            data.subject = JSON.stringify(Array.from(rows).map(row => ({
                name: row.querySelector('.subject-name').value,
                instructorId: row.querySelector('.subject-instructor').value
            })).filter(s => s.name));

            const id = data.id;
            try {
                const res = await fetch(id ? '/api/courses/'+id : '/api/courses', {
                    method: id ? 'PUT' : 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('token') },
                    body: JSON.stringify(data)
                });
                const r = await res.json();
                if (r.success) { 
                    alert('성공적으로 저장되었습니다.'); 
                    closeModal('createCourseModal'); 
                    loadCourses(currentPage); 
                } else alert(r.error || '저장 중 오류가 발생했습니다.');
            } catch(err) { console.error('Save error:', err); alert('서버와의 통신에 실패했습니다.'); }
        }

        async function deleteCourse(id) {
            if(!confirm('해당 과정을 정말 삭제하시겠습니까? 관련 데이터가 모두 삭제됩니다.')) return;
            try {
                const res = await fetch('/api/courses/'+id, { method: 'DELETE', headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') } });
                const r = await res.json();
                if (r.success) loadCourses(currentPage);
                else alert(r.error || '삭제 실패');
            } catch(e) { console.error('Delete error:', e); }
        }

        function editCourse(c) { openModal('createCourseModal', c); }
        
        function presetDays(days) {
            const startStr = document.getElementById('courseStartDate').value;
            const endStr = document.getElementById('courseEndDate').value;
            if(!startStr || !endStr) { alert('교육 기간(시작/종료일)을 먼저 설정해 주세요.'); return; }
            
            const start = new Date(startStr);
            const end = new Date(endStr);
            const daySet = new Set(days);
            
            let curr = new Date(startStr);
            while (curr <= end) {
                if (daySet.has(curr.getDay())) {
                    const y = curr.getFullYear();
                    const m = String(curr.getMonth() + 1).padStart(2, '0');
                    const d = String(curr.getDate()).padStart(2, '0');
                    selectedDates.add(\`\${y}-\${m}-\${d}\`);
                }
                curr.setDate(curr.getDate() + 1);
            }
            renderCalendar();
        }

        function clearCalendarSelection() { selectedDates.clear(); renderCalendar(); }
        
        async function handleThumbnailFile(input) {
            if (input.files && input.files[0]) {
                const reader = new FileReader();
                reader.onload = function (e) { 
                    document.getElementById('courseThumbnail').value = e.target.result; 
                    updateThumbnailPreview(e.target.result); 
                };
                reader.readAsDataURL(input.files[0]);
            }
        }
        
        function updateThumbnailPreview(src) {
            const p = document.getElementById('thumbnailPreview'), img = p.querySelector('img');
            if (src) { img.src = src; p.classList.remove('hidden'); } 
            else p.classList.add('hidden');
        }
        
        function clearThumbnail() { 
            document.getElementById('courseThumbnail').value = ''; 
            updateThumbnailPreview(''); 
            document.getElementById('thumbnailFile').value = '';
        }
    </script>
</body>
</html>
`;
