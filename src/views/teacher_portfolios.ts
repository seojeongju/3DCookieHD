import { teacherSidebar } from './components/teacher_sidebar';

export const teacherPortfoliosHtml = `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>강사 포트폴리오 관리 - 3D Cookie</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
    <script>
      tailwind.config = {
        theme: {
          extend: {
            fontFamily: {
              sans: ['Inter', 'Apple SD Gothic Neo', 'Malgun Gothic', 'sans-serif'],
            },
            colors: {
              primary: {
                50: '#f0f7ff', 100: '#e0effe', 200: '#baddfd', 300: '#7dbcfb', 400: '#3a9bf7',
                500: '#5b9bd5', 600: '#4a90e2', 700: '#2d5fa3', 800: '#1e4278', 900: '#132d54'
              },
              industry: {
                dark: '#0f172a',
                glass: 'rgba(255, 255, 255, 0.03)',
                border: 'rgba(255, 255, 255, 0.1)',
              }
            }
          }
        }
      }
    </script>
    <style>
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fadeIn 0.5s ease-out forwards; }
        .bento-card { transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); }
        .bento-card:hover { transform: translateY(-4px); box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1); }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        .glass-header { background: rgba(255, 255, 255, 0.8); backdrop-filter: blur(12px); border-bottom: 1px solid rgba(226, 232, 240, 0.6); }
        .asset-image-hover { transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1); }
        .group:hover .asset-image-hover { transform: scale(1.08); }
        .modal-blur { backdrop-filter: blur(12px); background: rgba(15, 23, 42, 0.8); }
    </style>
</head>
<body class="bg-slate-50 font-sans text-slate-900 antialiased overflow-hidden">
    <div class="flex h-screen overflow-hidden">
        <!-- 사이드바 -->
        ${teacherSidebar('portfolios')}

        <div class="flex-1 flex flex-col overflow-hidden relative">
            <div class="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:32px_32px] opacity-40 pointer-events-none"></div>

            <!-- 상단 헤더 -->
            <header class="glass-header sticky top-0 z-20 px-8 py-6 flex justify-between items-center">
                <div class="flex flex-col">
                    <h1 class="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        성과물 지능 관리
                        <span class="text-[10px] bg-sky-600 text-white px-2 py-0.5 rounded-full uppercase tracking-widest font-black">포트폴리오</span>
                    </h1>
                    <p class="text-xs font-medium text-slate-500 mt-0.5 tracking-tight uppercase">교과목별 우수 성과물 관리 및 공유</p>
                </div>
                <div class="flex items-center gap-4">
                    <button onclick="location.href='/teacher'" class="px-4 py-2 bg-white border border-slate-200 text-[10px] font-black rounded-xl hover:bg-slate-50 transition uppercase tracking-widest flex items-center gap-2 shadow-sm">
                        <i class="fas fa-arrow-left"></i> 대시보드
                    </button>
                    <div class="flex items-center gap-3 pl-4 border-l border-slate-200">
                        <div class="text-right flex flex-col uppercase tracking-tighter">
                            <span id="header-user-name" class="text-xs font-black text-slate-900">강사명</span>
                            <span class="text-[9px] font-black text-slate-400">포트폴리오 관리</span>
                        </div>
                    </div>
                </div>
            </header>

            <main class="flex-1 overflow-y-auto p-8 custom-scrollbar relative z-10">
                <div class="max-w-[1400px] mx-auto space-y-8">
                    
                    <!-- 1. 과정 선택 섹션 -->
                    <div id="coursesSection" class="animate-fade-in" style="animation-delay: 0.1s">
                        <div class="flex items-center gap-4 mb-8">
                            <div class="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center shadow-lg shadow-sky-100">
                                <i class="fas fa-layer-group text-sm"></i>
                            </div>
                            <div>
                                <h2 class="text-xl font-black text-slate-800 tracking-tight">자산 관리 대상 선택</h2>
                                <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">포트폴리오를 관리할 과정을 선택하세요.</p>
                            </div>
                        </div>

                        <div id="coursesContainer" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <!-- JS Load -->
                            <div class="col-span-full py-20 flex flex-col items-center justify-center bg-white rounded-[2.5rem] border border-dashed border-slate-200">
                                <i class="fas fa-circle-notch fa-spin text-3xl text-sky-500 mb-4"></i>
                                <p class="text-slate-400 font-black text-sm uppercase tracking-widest">과정 정보를 불러오는 중...</p>
                            </div>
                        </div>
                    </div>

                    <!-- 2. 포트폴리오 관리 섹션 (Hidden by Default) -->
                    <div id="portfoliosSection" class="hidden animate-fade-in">
                        <div class="flex flex-col lg:flex-row items-center justify-between gap-6 mb-8 bg-white p-8 rounded-[2.5rem] border border-slate-200/60 shadow-sm">
                            <div class="flex items-center gap-6">
                                <button onclick="backToCourses()" class="w-12 h-12 flex items-center justify-center rounded-2xl bg-slate-100 text-slate-400 hover:bg-slate-900 hover:text-white transition-all shadow-inner">
                                    <i class="fas fa-chevron-left text-sm"></i>
                                </button>
                                <div>
                                    <h2 class="text-2xl font-black text-slate-900 tracking-tight" id="selectedCourseTitle">학술 자산 저장소</h2>
                                    <div class="flex items-center gap-3 mt-1">
                                        <span class="px-2 py-0.5 bg-sky-50 text-sky-600 text-[10px] font-black rounded-full uppercase tracking-widest border border-sky-100/50">Asset Grid</span>
                                        <span class="text-xs font-bold text-slate-400 uppercase tracking-tight">학생 성과물 큐레이션 및 관리</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="flex items-center gap-3 w-full lg:w-auto">
                                <div class="relative flex-1 lg:flex-none lg:w-64">
                                    <i class="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 text-sm"></i>
                                    <input type="text" id="searchInput" placeholder="Search Assets..." 
                                           class="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-sky-100 outline-none transition-all text-sm font-medium tracking-tight"
                                           onkeyup="if(event.key==='Enter') loadPortfolios()">
                                </div>
                                <button onclick="openAddPortfolioModal()" class="px-6 py-4 bg-sky-600 text-white font-black text-[10px] rounded-2xl hover:bg-slate-900 transition-all uppercase tracking-widest shadow-lg shadow-sky-100 flex items-center gap-2">
                                    <i class="fas fa-plus"></i> New Asset
                                </button>
                            </div>
                        </div>

                        <!-- 필터 시퀀스 -->
                        <div class="flex gap-3 mb-8 overflow-x-auto pb-2 custom-scrollbar no-scrollbar">
                            <select id="categoryFilter" onchange="loadPortfolios()" class="px-6 py-3 bg-white border border-slate-200 rounded-xl font-black text-[10px] uppercase tracking-widest text-slate-600 focus:ring-4 focus:ring-sky-100 outline-none cursor-pointer">
                                <option value="">모든 카테고리</option>
                                <option value="3d_modeling">3D 모델링</option>
                                <option value="design">디자인</option>
                                <option value="coding">개발/코딩</option>
                                <option value="other">기타</option>
                            </select>
                            <select id="featuredFilter" onchange="loadPortfolios()" class="px-6 py-3 bg-white border border-slate-200 rounded-xl font-black text-[10px] uppercase tracking-widest text-slate-600 focus:ring-4 focus:ring-sky-100 outline-none cursor-pointer">
                                <option value="">모든 중요도</option>
                                <option value="true">우수작만 보기</option>
                            </select>
                        </div>

                        <!-- 포트폴리오 그리드 -->
                        <div id="portfoliosContainer" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            <!-- JS Load -->
                        </div>
                    </div>
                </div>
            </main>
        </div>
    </div>

    <!-- 고성능 모달: Portfolio Management -->
    <div id="portfolioModal" class="fixed inset-0 modal-blur hidden z-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            <div class="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center shadow-lg">
                        <i class="fas fa-briefcase text-sm"></i>
                    </div>
                    <div>
                        <h3 class="font-black text-slate-900 uppercase tracking-tight" id="modalTitle">성과물 등록</h3>
                        <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">포트폴리오 상세 정보 입력</p>
                    </div>
                </div>
                <button onclick="closePortfolioModal()" class="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-red-500 hover:text-white text-slate-400 transition-all">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="flex-1 overflow-y-auto p-12 custom-scrollbar">
                <form id="portfolioForm" onsubmit="handleSavePortfolio(event)" class="space-y-10">
                    <input type="hidden" id="portfolioId">
                    <input type="hidden" id="portfolioStudentId">
                    
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        <div class="space-y-8">
                            <div>
                                <label class="block text-[10px] font-black text-sky-600 uppercase tracking-widest mb-3 underline decoration-2 underline-offset-4">학생 선택</label>
                                <select id="portfolioStudentSelect" name="portfolioStudentSelect" required class="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-sky-100 outline-none transition-all font-bold text-slate-900 appearance-none">
                                    <option value="">학생을 선택하세요</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-[10px] font-black text-sky-600 uppercase tracking-widest mb-3 underline decoration-2 underline-offset-4">제목 (Label)</label>
                                <input type="text" id="portfolioTitle" name="portfolioTitle" required class="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-sky-100 outline-none transition-all font-bold text-slate-900" placeholder="제목을 입력하세요...">
                            </div>
                            <div>
                                <label class="block text-[10px] font-black text-sky-600 uppercase tracking-widest mb-3">분류 (Classification)</label>
                                <select id="portfolioCategory" name="portfolioCategory" class="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-sky-100 outline-none transition-all font-bold text-slate-900 appearance-none">
                                    <option value="3d_modeling">3D 모델링</option>
                                    <option value="design">시각 디자인</option>
                                    <option value="coding">개발/코딩</option>
                                    <option value="other">기타 성과물</option>
                                </select>
                            </div>
                        </div>
                        <div class="space-y-8">
                            <div>
                                <label class="block text-[10px] font-black text-sky-600 uppercase tracking-widest mb-3">상세 설명 (Description)</label>
                                <textarea id="portfolioDescription" name="portfolioDescription" rows="5" class="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-sky-100 outline-none transition-all font-medium text-slate-600 text-sm" placeholder="작품에 대한 기술적 설명을 입력하세요..."></textarea>
                            </div>
                            <div>
                                <label class="block text-[10px] font-black text-sky-600 uppercase tracking-widest mb-3">참조 링크 (URL)</label>
                                <input type="url" id="portfolioContentUrl" name="portfolioContentUrl" class="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-sky-100 outline-none transition-all font-medium text-slate-900" placeholder="https://external-resource-link.com">
                            </div>
                        </div>
                    </div>

                    <div class="pt-10 border-t border-slate-100">
                        <label class="block text-[10px] font-black text-sky-600 uppercase tracking-widest mb-4">대표 이미지 (썸네일)</label>
                        <div class="flex flex-col md:flex-row gap-6 items-start">
                            <div class="flex-1 w-full space-y-4">
                                <div class="flex gap-2">
                                    <input type="text" id="portfolioThumbnail" name="portfolioThumbnail" placeholder="이미지 주소를 입력하거나 업로드하세요" class="flex-1 px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-sky-100 outline-none transition-all font-medium text-slate-900">
                                    <input type="file" id="thumbnailFile" accept="image/*" class="hidden" onchange="handleThumbnailUpload(this)">
                                    <button type="button" onclick="document.getElementById('thumbnailFile').click()" class="px-8 py-4 bg-slate-900 text-white font-black text-[10px] rounded-2xl hover:bg-sky-600 transition-all uppercase tracking-widest shadow-lg">
                                        <i class="fas fa-upload mr-2"></i> 업로드
                                    </button>
                                </div>
                                <div id="thumbnailPreview" class="hidden relative group">
                                     <img src="" class="max-h-60 rounded-[2rem] border-4 border-slate-100 shadow-xl object-contain bg-slate-50">
                                     <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-[2rem] flex items-center justify-center">
                                         <span class="text-white font-black text-[10px] uppercase tracking-widest">미리보기</span>
                                     </div>
                                </div>
                            </div>
                            <div class="w-full md:w-96 space-y-4">
                                <label class="flex items-center gap-3 cursor-pointer">
                                    <input type="checkbox" id="portfolioIsFeatured" name="portfolioIsFeatured" class="w-5 h-5 rounded border-slate-300 text-yellow-500 focus:ring-yellow-400">
                                    <span class="text-[10px] font-black text-slate-700 uppercase tracking-widest">우수작 선정 (Featured)</span>
                                </label>
                                <div>
                                    <label class="block text-[10px] font-black text-purple-600 uppercase tracking-widest mb-3 underline decoration-2 underline-offset-4">강사 피드백 (멘토링)</label>
                                    <textarea id="portfolioTeacherFeedback" name="portfolioTeacherFeedback" rows="6" class="w-full px-6 py-4 bg-purple-50/30 border border-purple-100 rounded-2xl focus:ring-4 focus:ring-purple-100 outline-none transition-all font-medium text-slate-700 text-sm" placeholder="학생에게 전달할 피드백을 작성하세요..."></textarea>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
             <div class="px-12 py-8 bg-slate-50/50 border-t border-slate-100 flex justify-end gap-4">
                <button type="button" onclick="closePortfolioModal()" class="px-8 py-4 bg-white border border-slate-200 text-slate-400 font-black text-[11px] rounded-2xl uppercase tracking-widest hover:bg-slate-100 transition-all">취소</button>
                <button type="submit" form="portfolioForm" class="px-12 py-4 bg-sky-600 text-white font-black text-[11px] rounded-2xl uppercase tracking-widest hover:bg-slate-900 transition-all shadow-xl shadow-sky-100">
                    <i class="fas fa-save mr-2"></i> 성과물 저장
                </button>
            </div>
        </div>
    </div>

    <!-- Asset Detail Modal -->
    <div id="detailModal" class="fixed inset-0 modal-blur hidden z-[70] flex items-center justify-center p-4">
        <div class="bg-white rounded-[3rem] shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col md:flex-row">
            <div class="md:w-1/2 relative bg-slate-900 overflow-hidden min-h-[300px]">
                <img id="modalThumbnail" src="" class="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-[2s]">
                <div class="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
                <div class="absolute bottom-12 left-12 right-12">
                    <span id="modalCategory" class="px-3 py-1 bg-sky-500 text-white text-[10px] font-black rounded-full shadow-lg uppercase tracking-widest mb-4 inline-block">CATEGORY</span>
                    <h3 id="modalTitleDetail" class="text-4xl font-black text-white leading-tight tracking-tighter">Title</h3>
                </div>
            </div>
            <div class="md:w-1/2 flex flex-col h-full bg-white">
                <div class="p-12 overflow-y-auto custom-scrollbar flex-1">
                    <div class="flex justify-between items-start mb-12">
                        <div class="flex items-center gap-4">
                            <div class="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-white font-black shadow-xl" id="modalStudentInitial">S</div>
                            <div>
                                <h4 class="font-black text-slate-900 tracking-tight" id="modalStudentName">학생 이름</h4>
                                <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest" id="modalCourseTitle">과정 명</p>
                            </div>
                        </div>
                        <button onclick="closeDetailModal()" class="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-100 text-slate-400 hover:bg-red-500 hover:text-white transition-all">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>

                    <div class="space-y-10">
                        <div>
                            <span class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">기술 상세 설명</span>
                            <p id="modalDescription" class="text-slate-600 leading-relaxed font-medium text-sm"></p>
                        </div>
                        
                        <div id="modalTeacherFeedbackSection" class="hidden p-8 bg-sky-50 rounded-[2rem] border border-sky-100 relative overflow-hidden">
                            <div class="absolute -right-4 -bottom-4 w-20 h-20 bg-sky-200/20 rounded-full blur-2xl"></div>
                            <span class="block text-[10px] font-black text-sky-600 uppercase tracking-widest mb-3 relative z-10">강사 피드백</span>
                            <p id="modalFeedbackText" class="text-slate-700 text-sm font-bold relative z-10 italic leading-relaxed"></p>
                        </div>
                    </div>
                </div>
                <div class="p-12 bg-slate-50 border-t border-slate-100 grid grid-cols-2 gap-4">
                    <a id="modalContentLink" href="#" target="_blank" class="px-6 py-4 bg-slate-900 text-white font-black text-[10px] rounded-2xl hover:bg-sky-600 transition-all text-center uppercase tracking-widest shadow-xl">
                        소스 보기
                    </a>
                    <button id="modalFeaturedBtn" onclick="toggleFeatured()" class="px-6 py-4 bg-white border border-slate-200 text-slate-600 font-black text-[10px] rounded-2xl hover:border-yellow-400 hover:text-yellow-600 transition-all text-center uppercase tracking-widest">
                        우수작 선정
                    </button>
                    <button onclick="openEditPortfolioModal()" class="px-6 py-4 bg-white border border-slate-200 text-slate-600 font-black text-[10px] rounded-2xl hover:bg-sky-50 transition-all text-center uppercase tracking-widest">
                        정보 수정
                    </button>
                    <button onclick="deletePortfolio()" class="px-6 py-4 bg-white border border-red-100 text-red-400 font-black text-[10px] rounded-2xl hover:bg-red-500 hover:text-white transition-all text-center uppercase tracking-widest">
                        영구 삭제
                    </button>
                </div>
            </div>
        </div>
    </div>

    <script>
        let allCourses = [];
        let allPortfolios = [];
        let selectedCourseId = null;
        let currentPortfolio = null;

        document.addEventListener('DOMContentLoaded', () => {
            const userStr = localStorage.getItem('user');
            if (userStr) {
                const user = JSON.parse(userStr);
                document.getElementById('header-user-name').textContent = user.name;
            }
            loadCourses();
        });

        async function loadCourses() {
            try {
                const res = await fetch('/api/courses?limit=100', { headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') } });
                const result = await res.json();
                if (result.success) { allCourses = result.data || []; renderCourses(); }
            } catch (error) { console.error(error); }
        }

        function renderCourses() {
            const container = document.getElementById('coursesContainer');
            if (allCourses.length === 0) {
                container.innerHTML = '<div class="col-span-full py-20 text-center text-slate-400 font-black uppercase text-xs">No clusters available for curation</div>';
                return;
            }
            container.innerHTML = allCourses.map(course => {
                const idSafe = JSON.stringify(course.id);
                const raw = (course.title || '');
                const titleSafe = raw.replace(/\\\\/g, '\\\\\\\\').replace(/'/g, "\\\\'").replace(/"/g, '\\\\"');
                return '<div onclick="selectCourse(' + idSafe + ', \\'' + titleSafe + '\\')" ' +
                     'class="bento-card bg-white rounded-[2rem] p-8 border border-slate-200/60 flex flex-col justify-between cursor-pointer group shadow-sm hover:border-sky-600/30">' +
                    '<div class="flex justify-between items-start mb-6">' +
                        '<div class="w-14 h-14 rounded-2xl bg-sky-50 flex items-center justify-center text-sky-600 group-hover:bg-sky-600 group-hover:text-white transition-all duration-500 shadow-sm border border-sky-100">' +
                            '<i class="fas fa-cube text-lg font-black"></i>' +
                        '</div>' +
                        '<span class="px-3 py-1 bg-slate-50 text-slate-400 text-[10px] font-black rounded-full uppercase tracking-widest">접속 가능</span>' +
                    '</div>' +
                    '<div>' +
                        '<h3 class="text-xl font-black text-slate-900 tracking-tight group-hover:text-sky-600 transition-colors mb-2 line-clamp-2">' + course.title + '</h3>' +
                        '<div class="mt-6 flex items-center justify-between pt-6 border-t border-slate-50">' +
                             '<span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">' + (course.current_students || 0) + '명의 수강생</span>' +
                             '<div class="w-8 h-8 flex items-center justify-center rounded-xl bg-slate-50 group-hover:bg-sky-600 group-hover:text-white transition-all shadow-inner"><i class="fas fa-chevron-right text-[10px]"></i></div>' +
                        '</div>' +
                    '</div>' +
                '</div>';
            }).join('');
        }

        async function selectCourse(id, title) {
            selectedCourseId = id;
            document.getElementById('coursesSection').classList.add('hidden');
            document.getElementById('portfoliosSection').classList.remove('hidden');
            document.getElementById('selectedCourseTitle').textContent = title;
            await loadCourseStudents();
            await loadPortfolios();
        }

        function backToCourses() {
            document.getElementById('coursesSection').classList.remove('hidden');
            document.getElementById('portfoliosSection').classList.add('hidden');
        }

        async function loadCourseStudents() {
            const res = await fetch('/api/enrollments?course_id=' + selectedCourseId + '&status=approved&limit=100', { headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') } });
            const result = await res.json();
            if (result.success) {
                const select = document.getElementById('portfolioStudentSelect');
                const students = result.data || [];
                select.innerHTML = '<option value="">SELECT STUDENT NODE...</option>' + students.map(s => '<option value="' + s.user_id + '">' + s.user_name + '</option>').join('');
            }
        }

        async function loadPortfolios() {
            const cat = document.getElementById('categoryFilter').value;
            const feat = document.getElementById('featuredFilter').value;
            const search = document.getElementById('searchInput').value;
            let url = '/api/portfolios?courseId=' + selectedCourseId;
            if (cat) url += '&category=' + encodeURIComponent(cat);
            if (feat) url += '&isFeatured=' + feat;

            const res = await fetch(url, { headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') } });
            const result = await res.json();
            if (result.success) {
                allPortfolios = result.data || [];
                if(search) {
                    const s = search.toLowerCase();
                    allPortfolios = allPortfolios.filter(p => p.title?.toLowerCase().includes(s) || p.student_name?.toLowerCase().includes(s));
                }
                renderPortfolios();
            }
        }

        function renderPortfolios() {
            const container = document.getElementById('portfoliosContainer');
            if (allPortfolios.length === 0) {
                container.innerHTML = '<div class="col-span-full py-20 text-center text-slate-400 font-black uppercase text-xs">No intelligence outputs curated in this sector</div>';
                return;
            }
            container.innerHTML = allPortfolios.map(p => {
                const pidSafe = JSON.stringify(p.id);
                return '<div class="group bg-white rounded-[2.5rem] border border-slate-200/60 overflow-hidden cursor-pointer hover:shadow-2xl transition-all duration-500 flex flex-col h-full" onclick="openDetailModal(' + pidSafe + ')">' +
                    '<div class="h-48 relative overflow-hidden bg-slate-900">' +
                        '<img src="' + (p.thumbnail_url || 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=800') + '" class="w-full h-full object-cover asset-image-hover opacity-90">' +
                        '<div class="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">' +
                            '<span class="text-white text-[9px] font-black uppercase tracking-widest flex items-center gap-2"><i class="fas fa-search-plus"></i> Audit Detail</span>' +
                        '</div>' +
                        (p.is_featured ? '<div class="absolute top-4 left-4 px-3 py-1 bg-yellow-400 text-white text-[8px] font-black rounded-full shadow-lg">FEATURED</div>' : '') +
                        '<div class="absolute top-4 right-4 px-2 py-1 bg-white/90 text-[8px] font-black rounded-lg shadow-sm text-slate-800 uppercase tracking-tighter">' + (p.category || 'ASSET') + '</div>' +
                    '</div>' +
                    '<div class="p-8 flex flex-col flex-1">' +
                        '<h4 class="font-black text-slate-900 text-lg mb-1 line-clamp-1 group-hover:text-sky-600 transition-colors">' + p.title + '</h4>' +
                        '<p class="text-[9px] text-sky-600 font-black mb-4 uppercase tracking-wider">' + p.student_name + ' / ' + p.category + '</p>' +
                        '<div class="mt-auto pt-6 border-t border-slate-50 flex justify-between items-center text-slate-400">' +
                            '<div class="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center text-[10px] font-black group-hover:bg-slate-900 group-hover:text-white transition-all shadow-inner">' + (p.student_name || 'N')[0] + '</div>' +
                            '<div class="flex gap-2">' +
                                '<button onclick="event.stopPropagation(); openEditPortfolioModalById(' + pidSafe + ')" class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-sky-50 transition-colors"><i class="fas fa-edit text-xs"></i></button>' +
                                '<button onclick="event.stopPropagation(); deletePortfolioById(' + pidSafe + ')" class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 transition-colors"><i class="fas fa-trash-alt text-xs"></i></button>' +
                            '</div>' +
                        '</div>' +
                    '</div>' +
                '</div>';
            }).join('');
        }

        function openAddPortfolioModal() {
            document.getElementById('modalTitle').textContent = '새 성과물 등록';
            document.getElementById('portfolioForm').reset();
            document.getElementById('portfolioId').value = '';
            const featuredEl = document.getElementById('portfolioIsFeatured');
            if (featuredEl) featuredEl.checked = false;
            document.getElementById('thumbnailPreview').classList.add('hidden');
            document.getElementById('portfolioModal').classList.remove('hidden');
        }

        async function openEditPortfolioModalById(id) {
            const p = allPortfolios.find(x => x.id === id);
            if(!p) return;
            currentPortfolio = p;
            document.getElementById('modalTitle').textContent = '성과물 정보 수정';
            document.getElementById('portfolioId').value = p.id;
            document.getElementById('portfolioStudentSelect').value = p.student_id;
            document.getElementById('portfolioTitle').value = p.title || '';
            document.getElementById('portfolioCategory').value = p.category || '3d_modeling';
            document.getElementById('portfolioDescription').value = p.description || '';
            document.getElementById('portfolioThumbnail').value = p.thumbnail_url || '';
            document.getElementById('portfolioContentUrl').value = p.content_url || '';
            document.getElementById('portfolioTeacherFeedback').value = p.teacher_feedback || '';
            const featuredEl = document.getElementById('portfolioIsFeatured');
            if (featuredEl) featuredEl.checked = !!p.is_featured;
            if(p.thumbnail_url) {
                document.getElementById('thumbnailPreview').classList.remove('hidden');
                document.getElementById('thumbnailPreview').querySelector('img').src = p.thumbnail_url;
            }
            document.getElementById('portfolioModal').classList.remove('hidden');
        }

        function openEditPortfolioModal() { if(currentPortfolio) openEditPortfolioModalById(currentPortfolio.id); }

        function closePortfolioModal() { document.getElementById('portfolioModal').classList.add('hidden'); }

        async function handleSavePortfolio(e) {
            e.preventDefault();
            const form = e.target;
            const id = document.getElementById('portfolioId').value;
            const isFeaturedEl = document.getElementById('portfolioIsFeatured');
            const data = {
                title: form.portfolioTitle?.value ?? document.getElementById('portfolioTitle')?.value,
                description: form.portfolioDescription?.value ?? document.getElementById('portfolioDescription')?.value,
                thumbnail_url: form.portfolioThumbnail?.value ?? document.getElementById('portfolioThumbnail')?.value,
                content_url: form.portfolioContentUrl?.value ?? document.getElementById('portfolioContentUrl')?.value,
                category: form.portfolioCategory?.value ?? document.getElementById('portfolioCategory')?.value,
                course_id: selectedCourseId,
                student_id: form.portfolioStudentSelect?.value ?? document.getElementById('portfolioStudentSelect')?.value,
                teacher_feedback: form.portfolioTeacherFeedback?.value ?? document.getElementById('portfolioTeacherFeedback')?.value,
                is_featured: isFeaturedEl ? isFeaturedEl.checked : false
            };
            const res = await fetch(id ? '/api/portfolios/' + id : '/api/portfolios', {
                method: id ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('token') },
                body: JSON.stringify(data)
            });
            const result = await res.json();
            if (result.success) { alert('성공적으로 저장되었습니다.'); closePortfolioModal(); loadPortfolios(); }
            else if (result.message) alert(result.message);
        }

        async function handleThumbnailUpload(input) {
            if(!input.files[0]) return;
            const fd = new FormData(); fd.append('file', input.files[0]); fd.append('category', 'images'); fd.append('folder', 'portfolios');
            const res = await fetch('/api/upload', { method: 'POST', headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }, body: fd });
            const result = await res.json();
            if(result.success) {
                document.getElementById('portfolioThumbnail').value = result.data.url;
                document.getElementById('thumbnailPreview').classList.remove('hidden');
                document.getElementById('thumbnailPreview').querySelector('img').src = result.data.url;
            }
        }

        function openDetailModal(id) {
            const p = allPortfolios.find(x => x.id === id);
            if(!p) return;
            currentPortfolio = p;
            document.getElementById('modalThumbnail').src = p.thumbnail_url || 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=800';
            document.getElementById('modalCategory').textContent = p.category || 'ASSET';
            document.getElementById('modalTitleDetail').textContent = p.title;
            document.getElementById('modalDescription').textContent = p.description || '기술 설명이 제공되지 않았습니다.';
            document.getElementById('modalStudentName').textContent = p.student_name || '알 수 없음';
            document.getElementById('modalCourseTitle').textContent = p.course_title || '과정 정보 없음';
            document.getElementById('modalStudentInitial').textContent = (p.student_name || 'N')[0];
            const feedbackSection = document.getElementById('modalTeacherFeedbackSection');
            const feedbackText = document.getElementById('modalFeedbackText');
            if (p.teacher_feedback) {
                feedbackSection.classList.remove('hidden');
                feedbackText.textContent = p.teacher_feedback;
            } else {
                feedbackSection.classList.add('hidden');
                feedbackText.textContent = '';
            }
            document.getElementById('modalContentLink').href = p.content_url || '#';
            document.getElementById('modalFeaturedBtn').innerHTML = p.is_featured ? '우수작 해제' : '우수작 선정';
            document.getElementById('detailModal').classList.remove('hidden');
        }

        function closeDetailModal() { document.getElementById('detailModal').classList.add('hidden'); }

        async function toggleFeatured() {
            const res = await fetch('/api/portfolios/' + currentPortfolio.id + '/featured', {
                method: 'PATCH', headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('token') },
                body: JSON.stringify({ isFeatured: !currentPortfolio.is_featured })
            });
            if((await res.json()).success) { closeDetailModal(); loadPortfolios(); }
        }

        async function deletePortfolioById(id) {
            if(!confirm('이 성과물을 완전히 삭제하시겠습니까?')) return;
            const res = await fetch('/api/portfolios/' + id, { method: 'DELETE', headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') } });
            if((await res.json()).success) { alert('삭제되었습니다.'); closeDetailModal(); loadPortfolios(); }
        }

        function deletePortfolio() { if(currentPortfolio) deletePortfolioById(currentPortfolio.id); }
    </script>
</body>
</html>
`;
