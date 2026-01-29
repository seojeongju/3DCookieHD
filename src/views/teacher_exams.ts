import { teacherSidebar } from './components/teacher_sidebar';

export const teacherExamsHtml = `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Evaluation Intelligence Hub - 3D Cookie</title>
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
        .modal-blur { backdrop-filter: blur(8px); background: rgba(15, 23, 42, 0.8); }
    </style>
</head>
<body class="bg-slate-50 font-sans text-slate-900 antialiased overflow-hidden">
    <div class="flex h-screen overflow-hidden">
        <!-- 사이드바 -->
        ${teacherSidebar('exams')}

        <div class="flex-1 flex flex-col overflow-hidden relative">
            <div class="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:32px_32px] opacity-40 pointer-events-none"></div>

            <!-- 상단 헤더 -->
            <header class="glass-header sticky top-0 z-20 px-8 py-6 flex justify-between items-center">
                <div class="flex flex-col">
                    <h1 class="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        평가 및 채점 지능
                        <span class="text-[10px] bg-purple-600 text-white px-2 py-0.5 rounded-full uppercase tracking-widest font-black">Evaluation</span>
                    </h1>
                    <p class="text-xs font-medium text-slate-500 mt-0.5 tracking-tight uppercase">Outcome Assessment & Logic Validation Engine</p>
                </div>
                <div class="flex items-center gap-4">
                    <button onclick="location.href='/teacher'" class="px-4 py-2 bg-white border border-slate-200 text-[10px] font-black rounded-xl hover:bg-slate-50 transition uppercase tracking-widest flex items-center gap-2 shadow-sm">
                        <i class="fas fa-arrow-left"></i> Dashboard
                    </button>
                    <div class="flex items-center gap-3 pl-4 border-l border-slate-200">
                        <div class="text-right flex flex-col uppercase tracking-tighter">
                            <span id="header-user-name" class="text-xs font-black text-slate-900">Instructor Name</span>
                            <span class="text-[9px] font-black text-slate-400">Validator Mode</span>
                        </div>
                    </div>
                </div>
            </header>

            <main class="flex-1 overflow-y-auto p-8 custom-scrollbar relative z-10">
                <div class="max-w-[1400px] mx-auto space-y-8">
                    
                    <!-- 1. 과정 선택 섹션 -->
                    <div id="coursesSection" class="animate-fade-in" style="animation-delay: 0.1s">
                        <div class="flex items-center gap-4 mb-8">
                            <div class="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-100">
                                <i class="fas fa-clipboard-check text-sm"></i>
                            </div>
                            <div>
                                <h2 class="text-xl font-black text-slate-800 tracking-tight">평가 대상 과정 선택</h2>
                                <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Select Academic Cluster for Outcome Validation</p>
                            </div>
                        </div>

                        <div id="coursesGrid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <!-- JS Load -->
                            <div class="col-span-full py-20 flex flex-col items-center justify-center bg-white rounded-[2.5rem] border border-dashed border-slate-200">
                                <i class="fas fa-spinner fa-spin text-3xl text-indigo-500 mb-4"></i>
                                <p class="text-slate-400 font-black text-sm uppercase tracking-widest">Loading Academic Outcome Protocols...</p>
                            </div>
                        </div>
                    </div>

                    <!-- 2. 시험 목록 섹션 (Hidden by Default) -->
                    <div id="examsSection" class="hidden animate-fade-in">
                        <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8 bg-white p-8 rounded-[2.5rem] border border-slate-200/60 shadow-sm">
                            <div class="flex items-center gap-6">
                                <button onclick="backToCourses()" class="w-12 h-12 flex items-center justify-center rounded-2xl bg-slate-100 text-slate-400 hover:bg-slate-900 hover:text-white transition-all shadow-inner">
                                    <i class="fas fa-chevron-left text-sm"></i>
                                </button>
                                <div>
                                    <h2 class="text-2xl font-black text-slate-900 tracking-tight" id="selectedCourseTitle">Cluster Evaluation Hub</h2>
                                    <div class="flex items-center gap-3 mt-1">
                                        <span class="px-2 py-0.5 bg-purple-50 text-purple-600 text-[10px] font-black rounded-full uppercase tracking-widest border border-purple-100/50">Core Metrics</span>
                                        <span class="text-xs font-bold text-slate-400">Monitoring Evaluation Scripts</span>
                                    </div>
                                </div>
                            </div>
                            
                            <button onclick="openCreateExamModal()" class="px-8 py-4 bg-indigo-600 text-white font-black text-[10px] rounded-2xl hover:bg-slate-900 transition-all uppercase tracking-widest shadow-lg shadow-indigo-100 flex items-center gap-3">
                                <i class="fas fa-plus"></i> Deploy New Evaluation
                            </button>
                        </div>

                        <!-- 시험 목록 그리드 -->
                        <div class="bg-white rounded-[2.5rem] border border-slate-200/60 shadow-xl overflow-hidden">
                            <table class="w-full text-left border-collapse">
                                <thead>
                                    <tr class="bg-slate-50/50 border-b border-slate-100">
                                        <th class="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Evaluation Script</th>
                                        <th class="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Time Parameter</th>
                                        <th class="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Execution Status</th>
                                        <th class="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Deployment Date</th>
                                        <th class="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Operational Actions</th>
                                    </tr>
                                </thead>
                                <tbody id="examsTableBody" class="divide-y divide-slate-50 text-sm">
                                    <!-- JS Load -->
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    </div>

    <!-- 3. 고성능 모달 레이어 (Create/Grade) -->
    
    <!-- 시험 출제 모달 -->
    <div id="createExamModal" class="fixed inset-0 modal-blur hidden z-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
            <div class="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-lg">
                        <i class="fas fa-terminal text-sm"></i>
                    </div>
                    <div>
                        <h3 class="font-black text-slate-900 uppercase tracking-tight" id="examModalTitle">Deploly Evaluation Script</h3>
                        <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Outcome Logic Configuration</p>
                    </div>
                </div>
                <button onclick="closeModal('createExamModal')" class="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-red-500 hover:text-white text-slate-400 transition-all">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="flex-1 overflow-y-auto p-12 custom-scrollbar">
                <form id="examForm" onsubmit="handleSaveExam(event)" class="space-y-12">
                    <input type="hidden" id="examId" name="id">
                    
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        <div class="space-y-8">
                            <div>
                                <label class="block text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-3 underline decoration-2 underline-offset-4">Script Title</label>
                                <input type="text" id="examTitle" required class="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 outline-none transition-all font-bold text-slate-900" placeholder="Enter evaluation script title...">
                            </div>
                            <div>
                                <label class="block text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-3">Operational Parameters</label>
                                <div class="grid grid-cols-2 gap-4">
                                    <div class="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                                        <span class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Time limit (Min)</span>
                                        <input type="number" id="examTimeLimit" value="60" min="1" class="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 font-black text-indigo-600 focus:ring-4 focus:ring-indigo-100 outline-none">
                                    </div>
                                    <div class="bg-slate-50 p-6 rounded-2xl border border-slate-200 flex items-center justify-between">
                                        <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active State</span>
                                        <label class="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" id="examIsActive" checked class="sr-only peer">
                                            <div class="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <label class="block text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-3 underline decoration-2 underline-offset-4">Intelligence Metadata</label>
                            <textarea id="examDescription" rows="5" class="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 outline-none transition-all font-medium text-slate-600 text-sm" placeholder="Provide operational context for this evaluation..."></textarea>
                        </div>
                    </div>

                    <div class="pt-12 border-t border-slate-100">
                        <div class="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
                            <h4 class="text-xl font-black text-slate-900 uppercase tracking-tight">Outcome Validation Blocks (Questions)</h4>
                            <div class="flex items-center gap-3">
                                <select id="questionTypeSelect" class="bg-slate-100 px-4 py-3 rounded-xl border-none font-black text-[10px] uppercase tracking-widest outline-none focus:ring-4 focus:ring-indigo-100 transition-all">
                                    <option value="multiple_choice">MULTIPLE CHOICE</option>
                                    <option value="short_answer">SHORT ANSWER</option>
                                    <option value="essay">ESSAY LOGIC</option>
                                </select>
                                <button type="button" onclick="addQuestion()" class="px-6 py-3 bg-slate-900 text-white font-black text-[10px] rounded-xl hover:bg-indigo-600 transition-all uppercase tracking-widest shadow-lg">
                                    + Add Block
                                </button>
                            </div>
                        </div>
                        <div id="questionsContainer" class="space-y-6">
                            <!-- Question Blocks Load Here -->
                        </div>
                    </div>
                </form>
            </div>
            <div class="px-12 py-8 bg-slate-50/50 border-t border-slate-100 flex justify-end items-center gap-4">
                <button type="button" onclick="closeModal('createExamModal')" class="px-8 py-4 bg-white border border-slate-200 text-slate-400 font-black text-[11px] rounded-2xl uppercase tracking-widest hover:bg-slate-100 transition-all">Abort</button>
                <button type="submit" form="examForm" class="px-12 py-4 bg-indigo-600 text-white font-black text-[11px] rounded-2xl uppercase tracking-widest hover:bg-slate-900 transition-all shadow-xl shadow-indigo-100 overflow-hidden relative group">
                    <span class="relative z-10 flex items-center gap-3"><i class="fas fa-save"></i> Execute Deployment</span>
                    <div class="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </button>
            </div>
        </div>
    </div>

    <!-- 채점 모달 (Outcome Validation) -->
    <div id="gradeModal" class="fixed inset-0 modal-blur hidden z-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
             <div class="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-lg">
                        <i class="fas fa-check-double text-sm"></i>
                    </div>
                    <div>
                        <h3 class="font-black text-slate-900 uppercase tracking-tight">Outcome Performance Validation</h3>
                        <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Manual Truth Validation Engine</p>
                    </div>
                </div>
                <button onclick="closeModal('gradeModal')" class="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-red-500 hover:text-white text-slate-400 transition-all">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div id="gradeContent" class="flex-1 overflow-y-auto p-12 custom-scrollbar bg-slate-50/20">
                <!-- Grading Content Load Here -->
            </div>
        </div>
    </div>

    <script>
        let selectedCourseId = null;
        let questionCounter = 0;
        let currentExamId = null;
        let currentSubmissionId = null;

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
                const token = localStorage.getItem('token');
                const response = await fetch('/api/courses?limit=100', {
                    headers: { 'Authorization': 'Bearer ' + token }
                });
                const result = await response.json();
                const courses = result.success ? result.data : [];
                const grid = document.getElementById('coursesGrid');
                if (courses.length === 0) {
                    grid.innerHTML = '<div class="col-span-full py-20 text-center text-slate-400 font-black uppercase text-xs">No outcome sources available for validation</div>';
                    return;
                }

                grid.innerHTML = courses.map(course => 
                    '<div onclick="selectCourse(' + course.id + ', \'' + (course.title.replace(/'/g, "\\'")) + '\')" class="bento-card bg-white rounded-[2rem] p-8 border border-slate-200/60 flex flex-col justify-between cursor-pointer group shadow-sm hover:border-purple-600/30">' +
                        '<div class="flex justify-between items-start mb-6">' +
                            '<div class="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500 shadow-sm border border-indigo-100">' +
                                '<i class="fas fa-clipboard-check text-lg"></i>' +
                            '</div>' +
                            '<span class="px-2 py-1 bg-slate-50 text-slate-400 text-[10px] font-black rounded-full uppercase tracking-widest border border-slate-100">Ready</span>' +
                        '</div>' +
                        '<div>' +
                            '<h3 class="text-xl font-black text-slate-900 tracking-tight group-hover:text-indigo-600 transition-colors mb-2 line-clamp-2">' + course.title + '</h3>' +
                            '<div class="flex items-center gap-4 mt-6">' +
                                '<div class="flex flex-col">' +
                                    '<span class="text-[9px] font-black text-slate-400 uppercase tracking-widest">Type</span>' +
                                    '<span class="text-[10px] font-black text-indigo-500 uppercase">' + (course.category || 'Standard') + '</span>' +
                                '</div>' +
                                '<div class="w-px h-6 bg-slate-100"></div>' +
                                '<div class="flex flex-col">' +
                                    '<span class="text-[9px] font-black text-slate-400 uppercase tracking-widest">Cluster Size</span>' +
                                    '<span class="text-[10px] font-black text-indigo-500 uppercase">' + (course.current_students || 0) + ' Nodes</span>' +
                                '</div>' +
                            '</div>' +
                        '</div>' +
                    '</div>'
                ).join('');
            } catch (error) { console.error(error); }
        }

        function selectCourse(courseId, courseTitle) {
            selectedCourseId = courseId;
            document.getElementById('coursesSection').classList.add('hidden');
            document.getElementById('examsSection').classList.remove('hidden');
            document.getElementById('selectedCourseTitle').textContent = courseTitle;
            loadExams();
        }

        function backToCourses() {
            selectedCourseId = null;
            document.getElementById('coursesSection').classList.remove('hidden');
            document.getElementById('examsSection').classList.add('hidden');
        }

        async function loadExams() {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('/api/exams', { headers: { 'Authorization': 'Bearer ' + token } });
                const result = await response.json();
                const exams = (result.success ? result.data : []).filter(e => e.course_id === selectedCourseId);
                const tbody = document.getElementById('examsTableBody');
                if (exams.length === 0) {
                    tbody.innerHTML = '<tr><td colspan="5" class="px-8 py-20 text-center text-slate-400 font-black uppercase text-xs">No active evaluation scripts deployed for this cluster</td></tr>';
                    return;
                }

                tbody.innerHTML = exams.map(exam => 
                    '<tr class="group hover:bg-slate-50/80 transition-all duration-300">' +
                        '<td class="px-8 py-6">' +
                            '<div class="flex items-center gap-4">' +
                                '<div class="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white font-black text-xs border border-white/10 shadow-lg">EV</div>' +
                                '<span class="text-sm font-black text-slate-900 tracking-tight group-hover:text-indigo-600 transition-colors">' + exam.title + '</span>' +
                            '</div>' +
                        '</td>' +
                        '<td class="px-6 py-6 text-xs font-bold text-slate-500 tracking-tight">' + (exam.time_limit_minutes || 60) + ' MIN DELAY</td>' +
                        '<td class="px-6 py-6 text-center">' +
                            '<span class="px-3 py-1 ' + (exam.is_active ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600') + ' text-[10px] font-black rounded-full uppercase tracking-widest">' + (exam.is_active ? 'Operational' : 'Disabled') + '</span>' +
                        '</td>' +
                        '<td class="px-6 py-6 text-xs font-bold text-slate-400 tracking-widest uppercase">' + (exam.created_at ? exam.created_at.split('T')[0] : '-') + '</td>' +
                        '<td class="px-8 py-6 text-right">' +
                             '<div class="flex justify-end gap-2">' +
                                '<button onclick="viewExamStatus(' + exam.id + ')" class="w-9 h-9 flex items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all shadow-sm" title="Performance Analysis">' +
                                    '<i class="fas fa-chart-line text-xs"></i>' +
                                '</button>' +
                                '<button onclick="editExam(' + exam.id + ')" class="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-50 text-slate-400 hover:bg-slate-900 hover:text-white transition-all shadow-sm">' +
                                    '<i class="fas fa-edit text-xs"></i>' +
                                '</button>' +
                                '<button onclick="deleteExam(' + exam.id + ')" class="w-9 h-9 flex items-center justify-center rounded-xl bg-red-50 text-red-400 hover:bg-red-500 hover:text-white transition-all shadow-sm">' +
                                    '<i class="fas fa-trash text-xs"></i>' +
                                '</button>' +
                            '</div>' +
                        '</td>' +
                    '</tr>'
                ).join('');
            } catch (error) { console.error(error); }
        }

        function openCreateExamModal() {
            currentExamId = null;
            document.getElementById('examModalTitle').textContent = 'Deploy Evaluation Script';
            document.getElementById('examForm').reset();
            document.getElementById('examId').value = '';
            document.getElementById('questionsContainer').innerHTML = '';
            questionCounter = 0;
            addQuestion();
            document.getElementById('createExamModal').classList.remove('hidden');
        }

        function addQuestion() {
            const type = document.getElementById('questionTypeSelect').value;
            const qId = 'q_' + (questionCounter++);
            const container = document.getElementById('questionsContainer');
            const qHtml = 
                '<div class="bg-white rounded-[2.5rem] p-8 border border-slate-200/60 shadow-sm relative overflow-hidden group/q" data-question-id="' + qId + '">' +
                    '<div class="flex justify-between items-center mb-8">' +
                        '<div class="flex items-center gap-4">' +
                            '<span class="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 font-black text-xs border border-slate-200 shadow-inner group-hover/q:bg-indigo-600 group-hover/q:text-white transition-all duration-500">Block #' + questionCounter + '</span>' +
                            '<span class="px-3 py-1 bg-slate-50 text-slate-400 text-[9px] font-black rounded-full uppercase tracking-widest border border-slate-100">' + type.replace('_', ' ') + '</span>' +
                        '</div>' +
                        '<button type="button" onclick="removeQuestion(\'' + qId + '\')" class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-500 hover:text-white text-slate-300 transition-all">' +
                            '<i class="fas fa-trash-alt text-[10px]"></i>' +
                        '</button>' +
                    '</div>' +
                    '<div class="space-y-6">' +
                        '<input type="hidden" class="question-type" value="' + type + '">' +
                        '<div>' +
                            '<label class="block text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-2 underline decoration-2 underline-offset-4">Logic Statement (Question text)</label>' +
                            '<textarea class="question-text w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 outline-none transition-all font-bold text-slate-900 text-sm" rows="2" placeholder="Input analytical inquiry..."></textarea>' +
                        '</div>' +
                        '<div id="options_' + qId + '" class="' + (type === 'multiple_choice' ? '' : 'hidden') + '">' +
                            '<label class="block text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-2 underline decoration-2 underline-offset-4">Logic Parameters (Options)</label>' +
                            '<textarea class="question-options w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 outline-none transition-all font-medium text-slate-600 text-sm" rows="3" placeholder="Param A\\nParam B\\nParam C..."></textarea>' +
                        '</div>' +
                        '<div class="grid grid-cols-1 md:grid-cols-2 gap-6">' +
                            '<div>' +
                                '<label class="block text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-2 underline decoration-2 underline-offset-4">True Value (Correct Answer)</label>' +
                                '<input type="text" class="question-answer w-full px-6 py-4 bg-emerald-50/30 border border-emerald-100 rounded-2xl focus:ring-4 focus:ring-emerald-100 outline-none transition-all font-black text-emerald-600 placeholder-emerald-300" placeholder="Expected true value...">' +
                            '</div>' +
                            '<div>' +
                                '<label class="block text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-2 underline decoration-2 underline-offset-4">Weight Pulse (Points)</label>' +
                                '<input type="number" class="question-points w-full px-6 py-4 bg-indigo-50/30 border border-indigo-100 rounded-2xl focus:ring-4 focus:ring-indigo-100 outline-none transition-all font-black text-indigo-600" value="5">' +
                            '</div>' +
                        '</div>' +
                    '</div>' +
                '</div>';
            container.insertAdjacentHTML('beforeend', qHtml);
        }

        function removeQuestion(id) { document.querySelector('[data-question-id="' + id + '"]').remove(); }

        function closeModal(id) { document.getElementById(id).classList.add('hidden'); }

        async function handleSaveExam(e) {
            e.preventDefault();
            // Same logic as before but with UI sync
            const questions = [];
            document.querySelectorAll('[data-question-id]').forEach(qEl => {
                const type = qEl.querySelector('.question-type').value;
                questions.push({
                    question_text: qEl.querySelector('.question-text').value,
                    question_type: type,
                    options: type === 'multiple_choice' ? qEl.querySelector('.question-options').value.split('\\n').filter(o => o.trim()) : [],
                    correct_answer: qEl.querySelector('.question-answer').value,
                    points: parseInt(qEl.querySelector('.question-points').value) || 5
                });
            });
            const data = {
                title: document.getElementById('examTitle').value,
                course_id: selectedCourseId,
                description: document.getElementById('examDescription').value,
                time_limit: parseInt(document.getElementById('examTimeLimit').value) || 60,
                is_active: document.getElementById('examIsActive').checked ? 1 : 0,
                questions
            };
            const id = document.getElementById('examId').value;
            const url = id ? '/api/exams/' + id : '/api/exams';
            const res = await fetch(url, {
                method: id ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('token') },
                body: JSON.stringify(data)
            });
            if ((await res.json()).success) { alert('Cluster Evaluation Deployed'); closeModal('createExamModal'); loadExams(); }
        }

        async function viewExamStatus(id) {
             const res = await fetch('/api/exams/' + id + '/status', { headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') } });
             const result = await res.json();
             if(!result.success) return;
             const { exam, stats, students } = result.data;
             currentExamId = id;
             
             let html = '<div class="mb-12">' +
                    '<h4 class="text-3xl font-black text-slate-900 tracking-tight mb-8">Performance Snapshot: ' + exam.title + '</h4>' +
                    '<div class="grid grid-cols-1 md:grid-cols-3 gap-6">' +
                        '<div class="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">' +
                            '<span class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Total Nodes</span>' +
                            '<span class="text-4xl font-black text-slate-900 tracking-tighter">' + stats.total_students + '</span>' +
                        '</div>' +
                        '<div class="bg-indigo-900 p-8 rounded-[2.5rem] shadow-xl text-white">' +
                            '<span class="block text-[10px] font-black text-indigo-300 uppercase tracking-widest mb-2">Sync Completed</span>' +
                            '<span class="text-4xl font-black tracking-tighter">' + stats.submitted_count + '</span>' +
                        '</div>' +
                        '<div class="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">' +
                            '<span class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Mean Accuracy</span>' +
                            '<span class="text-4xl font-black text-indigo-600 tracking-tighter">' + stats.average_score.toFixed(1) + '</span>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
                '<div class="bg-white rounded-[2.5rem] border border-slate-200/60 shadow-xl overflow-hidden">' +
                    '<table class="w-full text-left">' +
                        '<thead>' +
                            '<tr class="bg-slate-50/50 border-b border-slate-100 uppercase text-[10px] font-black text-slate-400 tracking-widest">' +
                                '<th class="px-8 py-5">Node Identity</th>' +
                                '<th class="px-6 py-5">Sync Status</th>' +
                                '<th class="px-6 py-5">Accuracy Score</th>' +
                                '<th class="px-8 py-5 text-right">Validation</th>' +
                            '</tr>' +
                        '</thead>' +
                        '<tbody class="divide-y divide-slate-50">' +
                            students.map(s => 
                                '<tr class="hover:bg-slate-50 transition-colors">' +
                                    '<td class="px-8 py-6 font-black text-slate-800 tracking-tight">' + s.name + '</td>' +
                                    '<td class="px-6 py-6">' +
                                        '<span class="px-3 py-1 ' + (s.has_submitted ? (s.status === 'graded' ? 'bg-indigo-600 text-white' : 'bg-orange-500 text-white') : 'bg-slate-100 text-slate-400') + ' text-[9px] font-black rounded-full uppercase tracking-widest">' +
                                            (s.has_submitted ? (s.status === 'graded' ? 'Validated' : 'Requires Review') : 'Pending') +
                                        '</span>' +
                                    '</td>' +
                                    '<td class="px-6 py-6 font-black text-slate-700 font-mono">' + (s.score !== null ? s.score + ' pt' : '-') + '</td>' +
                                    '<td class="px-8 py-6 text-right">' +
                                        (s.has_submitted ? '<button onclick="gradeSubmission(' + id + ', ' + s.submission_id + ', \'' + (s.name.replace(/'/g, "\\'")) + '\')" class="px-6 py-3 bg-slate-900 hover:bg-indigo-600 text-white font-black text-[9px] rounded-xl uppercase tracking-widest transition-all shadow-lg">Begin Validation</button>' : '-') +
                                    '</td>' +
                                '</tr>'
                            ).join('') +
                        '</tbody>' +
                    '</table>' +
                '</div>';
             document.getElementById('gradeContent').innerHTML = html;
             document.getElementById('gradeModal').classList.remove('hidden');
        }

        async function gradeSubmission(examId, submissionId, name) {
            const res = await fetch('/api/exams/' + examId + '/submissions/' + submissionId, { headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') } });
            const result = await res.json();
            const { questions, submission } = result.data;
            currentSubmissionId = submissionId;
            let html = '<div class="mb-12">' +
                    '<h4 class="text-3xl font-black text-slate-900 tracking-tight mb-2 underline decoration-indigo-600/30 underline-offset-8">Truth Validation: ' + name + '</h4>' +
                    '<p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-4">Sync Timestamp: ' + (submission.submitted_at || 'Unknown') + '</p>' +
                '</div>' +
                '<form id="gradeForm" onsubmit="handleGradeSubmit(event)" class="space-y-8">' +
                     questions.map((q, idx) => 
                        '<div class="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-8 group/q">' +
                            '<div class="flex justify-between items-center">' +
                                '<span class="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white font-black text-xs">#' + (idx+1) + '</span>' +
                                '<span class="px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-black rounded-full uppercase tracking-widest border border-indigo-100">' + q.question_type.toUpperCase() + '</span>' +
                            '</div>' +
                            '<div class="grid grid-cols-1 lg:grid-cols-2 gap-12">' +
                                '<div class="space-y-6">' +
                                    '<div>' +
                                        '<span class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Logic Inquiry</span>' +
                                        '<div class="p-6 bg-slate-50 rounded-2xl border border-slate-200 text-sm font-bold text-slate-900 leading-relaxed overflow-x-auto">' + q.question_text + '</div>' +
                                    '</div>' +
                                    '<div>' +
                                        '<span class="block text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-3">System Truth (Correct Answer)</span>' +
                                        '<div class="p-6 bg-emerald-50/30 rounded-2xl border border-emerald-100 text-sm font-black text-emerald-600">' + q.correct_answer + '</div>' +
                                    '</div>' +
                                '</div>' +
                                '<div class="space-y-6">' +
                                    '<div>' +
                                        '<span class="block text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-3 underline decoration-2 underline-offset-4">Node Output (Student Answer)</span>' +
                                        '<div class="p-6 bg-white rounded-2xl border-2 border-slate-200 text-sm font-black text-slate-900 leading-relaxed min-h-[140px] shadow-inner whitespace-pre-wrap">' + (q.student_answer || '(No response detected)') + '</div>' +
                                    '</div>' +
                                    (q.question_type === 'essay' ? 
                                        '<div>' +
                                            '<span class="block text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-3">Weight Validation (Max ' + q.points + ')</span>' +
                                            '<input type="number" class="question-score w-full px-6 py-4 bg-indigo-50/50 border border-indigo-100 rounded-2xl font-black text-indigo-600 text-xl outline-none focus:ring-4 focus:ring-indigo-100 transition-all" data-question-id="' + q.id + '" step="0.5" max="' + q.points + '" value="' + (q.score_awarded || 0) + '">' +
                                        '</div>'
                                     : 
                                        '<div class="flex items-center gap-4">' +
                                            '<div class="p-8 flex-1 rounded-[2rem] ' + (q.is_correct ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white') + ' shadow-xl">' +
                                                '<span class="block text-[10px] font-black uppercase tracking-[0.2em] mb-2">' + (q.is_correct ? 'Match Detected' : 'Conflict Detected') + '</span>' +
                                                '<span class="text-3xl font-black tracking-tighter">' + q.score_awarded + ' / ' + q.points + ' pt</span>' +
                                            '</div>' +
                                        '</div>'
                                    ) +
                                '</div>' +
                            '</div>' +
                        '</div>'
                     ).join('') +
                     '<div class="pt-12 flex justify-end">' +
                         '<button type="submit" class="px-12 py-5 bg-indigo-600 text-white font-black text-[12px] rounded-[2rem] uppercase tracking-widest hover:bg-slate-900 transition-all shadow-2xl shadow-indigo-100">Synchronize Truth Map</button>' +
                     '</div>' +
                '</form>';
            document.getElementById('gradeContent').innerHTML = html;
        }

        async function handleGradeSubmit(e) {
            e.preventDefault();
            const scores = {};
            document.querySelectorAll('.question-score').forEach(el => scores[el.dataset.questionId] = parseFloat(el.value) || 0);
            const res = await fetch('/api/exams/' + currentExamId + '/grade', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('token') },
                body: JSON.stringify({ submission_id: currentSubmissionId, question_scores: scores })
            });
            if((await res.json()).success) { alert('Truth Matrix Confirmed'); closeModal('gradeModal'); viewExamStatus(currentExamId); }
        }

        async function deleteExam(id) {
            if(!confirm('Permanently wipe this evaluation script from the cluster?')) return;
            const res = await fetch('/api/exams/' + id, { method: 'DELETE', headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') } });
            if((await res.json()).success) { alert('Script Terminated'); loadExams(); }
        }
    </script>
</body>
</html>
`;
