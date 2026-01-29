import { teacherSidebar } from './components/teacher_sidebar';

export const teacherProfileHtml = `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Identity Core Management - 3D Cookie</title>
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
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        .glass-header { background: rgba(255, 255, 255, 0.8); backdrop-filter: blur(12px); border-bottom: 1px solid rgba(226, 232, 240, 0.6); }
        .profile-card { transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); }
        .modal-blur { backdrop-filter: blur(12px); background: rgba(15, 23, 42, 0.8); }
        .tab-btn { transition: all 0.3s ease; position: relative; }
        .tab-btn.active { color: #5b9bd5; }
        .tab-btn.active::after { content: ''; position: absolute; bottom: -1px; left: 0; right: 0; height: 3px; background: #5b9bd5; border-radius: 3px 3px 0 0; }
    </style>
</head>
<body class="bg-slate-50 font-sans text-slate-900 antialiased overflow-hidden">
    <div class="flex h-screen overflow-hidden">
        <!-- 사이드바 -->
        ${teacherSidebar('profile')}

        <div class="flex-1 flex flex-col overflow-hidden relative">
            <div class="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:32px_32px] opacity-40 pointer-events-none"></div>

            <!-- 상단 헤더 -->
            <header class="glass-header sticky top-0 z-20 px-8 py-6 flex justify-between items-center">
                <div class="flex flex-col">
                    <h1 class="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        교강사 인적 지능
                        <span class="text-[10px] bg-slate-900 text-white px-2 py-0.5 rounded-full uppercase tracking-widest font-black">Identity Core</span>
                    </h1>
                    <p class="text-xs font-medium text-slate-500 mt-0.5 tracking-tight uppercase">Instructor Profile & Intellectual Asset Management</p>
                </div>
                <div class="flex items-center gap-4">
                    <button onclick="location.href='/teacher'" class="px-4 py-2 bg-white border border-slate-200 text-[10px] font-black rounded-xl hover:bg-slate-50 transition uppercase tracking-widest flex items-center gap-2 shadow-sm">
                        <i class="fas fa-arrow-left"></i> Dashboard
                    </button>
                    <div class="flex items-center gap-3 pl-4 border-l border-slate-200">
                        <div class="text-right flex flex-col uppercase tracking-tighter">
                            <span id="header-user-name" class="text-xs font-black text-slate-900">Instructor Name</span>
                            <span class="text-[9px] font-black text-slate-400">Admin/Edit Mode</span>
                        </div>
                    </div>
                </div>
            </header>

            <main class="flex-1 overflow-y-auto p-8 custom-scrollbar relative z-10">
                <div class="max-w-6xl mx-auto space-y-8">
                    <form id="profileForm" onsubmit="handleSaveProfile(event)" class="space-y-8 animate-fade-in">
                        
                        <!-- Identity Section -->
                        <div class="bg-white rounded-[2.5rem] border border-slate-200/60 shadow-xl overflow-hidden">
                            <div class="bg-slate-900 px-10 py-12 flex flex-col md:flex-row gap-8 items-center md:items-start text-white relative overflow-hidden">
                                <div class="absolute top-0 right-0 w-64 h-64 bg-slate-800 rounded-full blur-3xl opacity-50 -mr-10 -mt-10"></div>
                                
                                <div class="relative group cursor-pointer" onclick="document.getElementById('pImageFile').click()">
                                    <div class="w-40 h-40 rounded-[2.5rem] bg-slate-800 border-4 border-slate-700 overflow-hidden relative shadow-2xl flex items-center justify-center">
                                        <i class="fas fa-user-tie text-6xl text-slate-600" id="pImagePlaceholder"></i>
                                        <img id="pImagePreview" src="" class="w-full h-full object-cover hidden">
                                        <div class="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                                            <i class="fas fa-camera text-xl"></i>
                                            <span class="text-[9px] font-black uppercase tracking-widest">Update Identity</span>
                                        </div>
                                    </div>
                                    <input type="hidden" name="profile_image" id="pImageUrl">
                                    <input type="file" id="pImageFile" accept="image/*" class="hidden" onchange="handlePImage(this)">
                                </div>

                                <div class="flex-1 space-y-6 relative z-10">
                                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label class="block text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Legal Name</label>
                                            <input type="text" name="name" id="pName" required class="w-full bg-slate-800/50 border border-slate-700 rounded-2xl px-6 py-4 text-white font-black outline-none focus:ring-2 focus:ring-slate-600 transition tracking-tight">
                                        </div>
                                        <div>
                                            <label class="block text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Staff Position</label>
                                            <input type="text" name="position" id="pPosition" class="w-full bg-slate-800/50 border border-slate-700 rounded-2xl px-6 py-4 text-white font-bold outline-none focus:ring-2 focus:ring-slate-600 transition tracking-tight" placeholder="e.g. Senior Instructor">
                                        </div>
                                        <div>
                                            <label class="block text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Communication Endpoint (Email)</label>
                                            <input type="email" name="email" id="pEmail" required class="w-full bg-slate-800/50 border border-slate-700 rounded-2xl px-6 py-4 text-slate-300 font-medium outline-none focus:ring-2 focus:ring-slate-600 transition tracking-tight">
                                        </div>
                                        <div>
                                            <label class="block text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Signal Line (Phone)</label>
                                            <input type="text" name="phone" id="pPhone" required class="w-full bg-slate-800/50 border border-slate-700 rounded-2xl px-6 py-4 text-slate-300 font-medium outline-none focus:ring-2 focus:ring-slate-600 transition tracking-tight">
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="p-10 bg-white grid grid-cols-1 md:grid-cols-3 gap-8 border-b border-slate-100">
                                <div>
                                    <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Sector Specialization</label>
                                    <input type="text" name="subject" id="pSubject" class="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-black text-slate-800 outline-none focus:ring-4 focus:ring-slate-100 transition" placeholder="e.g. 3D Modeling, Architecture">
                                </div>
                                <div>
                                    <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Deployment Date</label>
                                    <input type="date" name="joined_at" id="pJoined" class="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-black text-slate-800 outline-none focus:ring-4 focus:ring-slate-100 transition">
                                </div>
                                <div>
                                    <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Classification</label>
                                    <select name="type" id="pType" class="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-black text-slate-800 outline-none focus:ring-4 focus:ring-slate-100 transition appearance-none cursor-pointer">
                                        <option value="full">FULL PERFORMANCE</option>
                                        <option value="part">PART-TIME OPERATION</option>
                                        <option value="external">EXTERNAL CLUSTER</option>
                                    </select>
                                </div>
                            </div>

                            <!-- Tabs System -->
                            <div class="bg-white px-10 border-b border-slate-100">
                                <div class="flex items-center gap-10 overflow-x-auto no-scrollbar">
                                    <button type="button" data-tab="education" id="tabEducation" class="tab-btn active px-2 py-6 text-[11px] font-black uppercase tracking-widest flex items-center gap-2">
                                        <i class="fas fa-graduation-cap text-xs"></i> Academic & Career
                                    </button>
                                    <button type="button" data-tab="certifications" id="tabCertifications" class="tab-btn px-2 py-6 text-[11px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                                        <i class="fas fa-certificate text-xs"></i> Credentials
                                    </button>
                                    <button type="button" data-tab="training" id="tabTraining" class="tab-btn px-2 py-6 text-[11px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                                        <i class="fas fa-chalkboard-teacher text-xs"></i> Maintenance
                                    </button>
                                    <button type="button" data-tab="teaching" id="tabTeaching" class="tab-btn px-2 py-6 text-[11px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                                        <i class="fas fa-book-open text-xs"></i> Session Logs
                                    </button>
                                </div>
                            </div>

                            <div class="p-10 min-h-[400px] bg-slate-50/30">
                                <!-- Content: Education & Career -->
                                <div id="contentEducation" class="space-y-12">
                                    <div class="space-y-6">
                                        <div class="flex items-center justify-between">
                                            <h5 class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                                                <i class="fas fa-university text-blue-500"></i> Academic Records
                                            </h5>
                                            <button type="button" onclick="openEducationModal()" class="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition shadow-lg">
                                                + Academic Entry
                                            </button>
                                        </div>
                                        <div id="educationContainer" class="grid grid-cols-1 md:grid-cols-2 gap-4"></div>
                                    </div>
                                    <div class="space-y-6 pt-12 border-t border-slate-100">
                                        <div class="flex items-center justify-between">
                                            <h5 class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                                                <i class="fas fa-briefcase text-purple-500"></i> Industrial Career
                                            </h5>
                                            <button type="button" onclick="openCareerModal()" class="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-purple-600 transition shadow-lg">
                                                + Career Entry
                                            </button>
                                        </div>
                                        <div id="careerContainer" class="grid grid-cols-1 md:grid-cols-2 gap-4"></div>
                                    </div>
                                </div>

                                <!-- Content: Certifications -->
                                <div id="contentCertifications" class="hidden space-y-6">
                                    <div class="flex items-center justify-between">
                                        <h5 class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                                            <i class="fas fa-certificate text-orange-500"></i> Validated Credentials
                                        </h5>
                                        <button type="button" onclick="openCertificationModal()" class="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-orange-600 transition shadow-lg">
                                            + Certificate
                                        </button>
                                    </div>
                                    <div id="certificationsContainer" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"></div>
                                </div>

                                <!-- Content: Training -->
                                <div id="contentTraining" class="hidden space-y-6">
                                    <div class="flex items-center justify-between">
                                        <h5 class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                                            <i class="fas fa-sync text-emerald-500"></i> Intellectual Maintenance
                                        </h5>
                                        <button type="button" onclick="openTrainingModal()" class="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 transition shadow-lg">
                                            + Maintenance Log
                                        </button>
                                    </div>
                                    <div id="trainingContainer" class="grid grid-cols-1 md:grid-cols-2 gap-4"></div>
                                </div>

                                <!-- Content: Teaching -->
                                <div id="contentTeaching" class="hidden space-y-6">
                                    <div class="flex items-center justify-between">
                                        <h5 class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                                            <i class="fas fa-history text-indigo-500"></i> Professional Session History
                                        </h5>
                                        <button type="button" onclick="openTeachingHistoryModal()" class="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition shadow-lg">
                                            + Session Log
                                        </button>
                                    </div>
                                    <div id="teachingHistoryContainer" class="space-y-4"></div>
                                </div>
                            </div>

                            <!-- Footer Actions -->
                            <div class="p-10 bg-slate-50 border-t border-slate-100 flex justify-end gap-4">
                                <button type="button" onclick="location.href='/teacher'" class="px-8 py-4 bg-white border border-slate-200 text-slate-400 font-black text-[11px] rounded-2xl uppercase tracking-widest hover:bg-slate-100 transition-all">Discard Changes</button>
                                <button type="submit" class="px-12 py-4 bg-slate-900 text-white font-black text-[11px] rounded-2xl uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl shadow-slate-200">
                                    <i class="fas fa-save mr-2"></i> Commit Identity Sync
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    </div>

    <!-- Modals (Simplified Design consistent with other pages) -->
    
    <!-- Academic Modal -->
    <div id="educationModal" class="fixed inset-0 modal-blur hidden z-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <div class="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h3 class="font-black text-slate-800 uppercase tracking-tight" id="educationModalTitle">Academic Entry</h3>
                <button onclick="closeEducationModal()" class="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-red-500 hover:text-white text-slate-400 transition-all"><i class="fas fa-times"></i></button>
            </div>
            <div class="p-10 overflow-y-auto">
                <form id="educationForm" onsubmit="handleSaveEducation(event)" class="space-y-6">
                    <input type="hidden" id="educationModalId">
                    <div>
                        <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Institution Name</label>
                        <input type="text" id="educationModalSchool" required class="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-slate-100 outline-none transition font-bold">
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Major / Sector</label>
                            <input type="text" id="educationModalMajor" class="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-slate-100 outline-none transition font-bold">
                        </div>
                        <div>
                            <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Degree Level</label>
                            <select id="educationModalDegree" class="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-slate-100 outline-none transition font-black appearance-none">
                                <option value="">SELECT LEVEL</option>
                                <option value="고등학교">HIGH SCHOOL</option>
                                <option value="전문대학">ASSOCIATE</option>
                                <option value="학사">BACHELOR</option>
                                <option value="석사">MASTER</option>
                                <option value="박사">DOCTORATE</option>
                            </select>
                        </div>
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Incept Date</label>
                            <input type="date" id="educationModalStartDate" class="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-slate-100 outline-none transition font-bold">
                        </div>
                        <div>
                            <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Terminal Date</label>
                            <input type="date" id="educationModalEndDate" class="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-slate-100 outline-none transition font-bold">
                        </div>
                    </div>
                    <button type="submit" class="w-full py-4 bg-slate-900 text-white font-black text-[11px] rounded-2xl uppercase tracking-widest hover:bg-blue-600 transition-all">Save Academic Vector</button>
                </form>
            </div>
        </div>
    </div>

    <!-- Career Modal -->
    <div id="careerModal" class="fixed inset-0 modal-blur hidden z-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <div class="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h3 class="font-black text-slate-800 uppercase tracking-tight" id="careerModalTitle">Career Entry</h3>
                <button onclick="closeCareerModal()" class="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-red-500 hover:text-white text-slate-400 transition-all"><i class="fas fa-times"></i></button>
            </div>
            <div class="p-10 overflow-y-auto">
                <form id="careerForm" onsubmit="handleSaveCareer(event)" class="space-y-6">
                    <input type="hidden" id="careerModalId">
                    <div>
                        <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Organization Name</label>
                        <input type="text" id="careerModalCompany" required class="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-slate-100 outline-none transition font-bold">
                    </div>
                    <div>
                        <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Role / Position</label>
                        <input type="text" id="careerModalPosition" class="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-slate-100 outline-none transition font-bold">
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Join Date</label>
                            <input type="date" id="careerModalStartDate" class="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-slate-100 outline-none transition font-bold">
                        </div>
                        <div>
                            <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Exit Date</label>
                            <input type="date" id="careerModalEndDate" class="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-slate-100 outline-none transition font-bold">
                        </div>
                    </div>
                    <button type="submit" class="w-full py-4 bg-slate-900 text-white font-black text-[11px] rounded-2xl uppercase tracking-widest hover:bg-purple-600 transition-all">Save Career Vector</button>
                </form>
            </div>
        </div>
    </div>

    <!-- Certification Modal -->
    <div id="certificationModal" class="fixed inset-0 modal-blur hidden z-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <div class="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h3 class="font-black text-slate-800 uppercase tracking-tight" id="certModalTitle">Credential Entry</h3>
                <button onclick="closeCertificationModal()" class="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-red-500 hover:text-white text-slate-400 transition-all"><i class="fas fa-times"></i></button>
            </div>
            <div class="p-10 overflow-y-auto">
                <form id="certificationForm" onsubmit="handleSaveCertification(event)" class="space-y-6">
                    <input type="hidden" id="certModalId">
                    <input type="hidden" id="certModalFileUrls" value="[]">
                    <div>
                        <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Credential Name</label>
                        <input type="text" id="certModalName" required class="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-slate-100 outline-none transition font-bold">
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Issue Date</label>
                            <input type="date" id="certModalIssueDate" class="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-slate-100 outline-none transition font-bold">
                        </div>
                        <div>
                            <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Expiration Date</label>
                            <input type="date" id="certModalExpiryDate" class="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-slate-100 outline-none transition font-bold">
                        </div>
                    </div>
                    <div>
                        <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Verification Artifacts (Files)</label>
                        <input type="file" id="certModalFileInput" multiple class="hidden" onchange="/* Handle in JS */">
                        <button type="button" onclick="document.getElementById('certModalFileInput').click()" class="w-full py-4 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 font-bold hover:border-blue-400 hover:text-blue-500 transition-all text-sm mb-4">
                            <i class="fas fa-cloud-upload-alt mr-2"></i> Upload Verification Documents
                        </button>
                        <div id="certModalFileList" class="space-y-2"></div>
                    </div>
                    <button type="submit" class="w-full py-4 bg-slate-900 text-white font-black text-[11px] rounded-2xl uppercase tracking-widest hover:bg-orange-600 transition-all">Save Credential Vector</button>
                </form>
            </div>
        </div>
    </div>

    <!-- Maintenance (Training) Modal -->
    <div id="trainingModal" class="fixed inset-0 modal-blur hidden z-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <div class="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h3 class="font-black text-slate-800 uppercase tracking-tight" id="trainingModalTitle">Maintenance Entry</h3>
                <button onclick="closeTrainingModal()" class="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-red-500 hover:text-white text-slate-400 transition-all"><i class="fas fa-times"></i></button>
            </div>
            <div class="p-10 overflow-y-auto">
                <form id="trainingForm" onsubmit="handleSaveTraining(event)" class="space-y-6">
                    <input type="hidden" id="trainingModalId">
                    <div>
                        <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Maintenance Module Name</label>
                        <input type="text" id="trainingModalName" required class="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-slate-100 outline-none transition font-bold">
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Unit Hours</label>
                            <input type="number" id="trainingModalHours" class="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-slate-100 outline-none transition font-bold">
                        </div>
                        <div>
                            <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Incept Date</label>
                            <input type="date" id="trainingModalStartDate" class="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-slate-100 outline-none transition font-bold">
                        </div>
                    </div>
                    <button type="submit" class="w-full py-4 bg-slate-900 text-white font-black text-[11px] rounded-2xl uppercase tracking-widest hover:bg-emerald-600 transition-all">Save Maintenance Vector</button>
                </form>
            </div>
        </div>
    </div>

    <!-- Teaching History Modal -->
    <div id="teachingHistoryModal" class="fixed inset-0 modal-blur hidden z-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <div class="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h3 class="font-black text-slate-800 uppercase tracking-tight" id="teachingModalTitle">Session Log Entry</h3>
                <button onclick="closeTeachingHistoryModal()" class="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-red-500 hover:text-white text-slate-400 transition-all"><i class="fas fa-times"></i></button>
            </div>
            <div class="p-10 overflow-y-auto">
                <form id="teachingHistoryForm" onsubmit="handleSaveTeachingHistory(event)" class="space-y-6">
                    <input type="hidden" id="teachingModalId">
                    <div>
                        <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Module Designation</label>
                        <input type="text" id="teachingModalCourseName" required class="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-slate-100 outline-none transition font-bold">
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Incept Date</label>
                            <input type="date" id="teachingModalStartDate" class="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-slate-100 outline-none transition font-bold">
                        </div>
                        <div>
                            <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Terminal Date</label>
                            <input type="date" id="teachingModalEndDate" class="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-slate-100 outline-none transition font-bold">
                        </div>
                    </div>
                    <button type="submit" class="w-full py-4 bg-slate-900 text-white font-black text-[11px] rounded-2xl uppercase tracking-widest hover:bg-indigo-600 transition-all">Save Session Log Vector</button>
                </form>
            </div>
        </div>
    </div>

    <script>
        let education = [];
        let career = [];
        let certifications = [];
        let training = [];
        let teachingHistory = [];
        let currentUserId = null;
        let currentProfileTab = 'education';

        // State Manager for Modals
        let currentEducationIndex = null;
        let currentCareerIndex = null;
        let currentCertIndex = null;
        let currentTrainingIndex = null;
        let currentTeachingIndex = null;

        document.addEventListener('DOMContentLoaded', () => {
            checkLogin();
            loadProfileData();
            setupTabListeners();
        });

        function checkLogin() {
            const userStr = localStorage.getItem('user');
            if (!userStr) { location.href = '/login'; return; }
            const user = JSON.parse(userStr);
            currentUserId = parseInt(user.id);
            document.getElementById('header-user-name').textContent = user.name;
        }

        async function loadProfileData() {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch('/api/hrd/personnel', { headers: { 'Authorization': 'Bearer ' + token } });
                const result = await res.json();
                if (result.success) {
                    const myData = result.data.find(p => parseInt(p.id) === currentUserId);
                    if (myData) populateForm(myData);
                }
            } catch (error) { console.error(error); }
        }

        function populateForm(data) {
            document.getElementById('pName').value = data.name || '';
            document.getElementById('pEmail').value = data.email || '';
            document.getElementById('pPhone').value = data.phone || '';
            document.getElementById('pPosition').value = data.position || '';
            document.getElementById('pSubject').value = data.subject || '';
            document.getElementById('pType').value = data.type || 'full';
            if(data.joined_at) document.getElementById('pJoined').value = data.joined_at.split('T')[0];
            
            if (data.profile_image) {
                document.getElementById('pImagePreview').src = data.profile_image;
                document.getElementById('pImagePreview').classList.remove('hidden');
                document.getElementById('pImagePlaceholder').classList.add('hidden');
                document.getElementById('pImageUrl').value = data.profile_image;
            }

            education = data.education ? (typeof data.education === 'string' ? JSON.parse(data.education) : data.education) : [];
            career = data.career ? (typeof data.career === 'string' ? JSON.parse(data.career) : data.career) : [];
            certifications = data.certifications ? (typeof data.certifications === 'string' ? JSON.parse(data.certifications) : data.certifications) : [];
            training = data.training_history ? (typeof data.training_history === 'string' ? JSON.parse(data.training_history) : data.training_history) : [];
            teachingHistory = data.teaching_history ? (typeof data.teaching_history === 'string' ? JSON.parse(data.teaching_history) : data.teaching_history) : [];

            refreshTabContent();
        }

        function setupTabListeners() {
            document.querySelectorAll('[data-tab]').forEach(btn => {
                btn.onclick = () => {
                    const tab = btn.dataset.tab;
                    currentProfileTab = tab;
                    document.querySelectorAll('.tab-btn').forEach(b => {
                        b.classList.remove('active');
                        b.classList.add('text-slate-400');
                    });
                    btn.classList.add('active');
                    btn.classList.remove('text-slate-400');
                    
                    ['education', 'certifications', 'training', 'teaching'].forEach(t => {
                        document.getElementById('content' + t.charAt(0).toUpperCase() + t.slice(1)).classList.add('hidden');
                    });
                    document.getElementById('content' + tab.charAt(0).toUpperCase() + tab.slice(1)).classList.remove('hidden');
                    refreshTabContent();
                };
            });
        }

        function refreshTabContent() {
            if(currentProfileTab === 'education') { renderEducation(); renderCareer(); }
            else if(currentProfileTab === 'certifications') renderCertifications();
            else if(currentProfileTab === 'training') renderTraining();
            else if(currentProfileTab === 'teaching') renderTeachingHistory();
        }

        // Education Logic
        window.openEducationModal = (idx = null) => {
            currentEducationIndex = idx;
            const form = document.getElementById('educationForm');
            form.reset();
            if(idx !== null) {
                const e = education[idx];
                document.getElementById('educationModalId').value = e.id || '';
                document.getElementById('educationModalSchool').value = e.school || '';
                document.getElementById('educationModalMajor').value = e.major || '';
                document.getElementById('educationModalDegree').value = e.degree || '';
                if(e.start_date) document.getElementById('educationModalStartDate').value = e.start_date.split('T')[0];
                if(e.end_date) document.getElementById('educationModalEndDate').value = e.end_date.split('T')[0];
            }
            document.getElementById('educationModal').classList.remove('hidden');
        };
        window.closeEducationModal = () => document.getElementById('educationModal').classList.add('hidden');
        window.handleSaveEducation = (e) => {
            e.preventDefault();
            const data = {
                id: document.getElementById('educationModalId').value || 'edu_' + Date.now(),
                school: document.getElementById('educationModalSchool').value,
                major: document.getElementById('educationModalMajor').value,
                degree: document.getElementById('educationModalDegree').value,
                start_date: document.getElementById('educationModalStartDate').value,
                end_date: document.getElementById('educationModalEndDate').value
            };
            if(currentEducationIndex !== null) education[currentEducationIndex] = data;
            else education.push(data);
            closeEducationModal(); renderEducation();
        };
        function renderEducation() {
            const container = document.getElementById('educationContainer');
            container.innerHTML = education.map((e, idx) => 
                '<div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex justify-between items-start group hover:border-blue-300 transition-all">' +
                    '<div>' +
                        '<h6 class="font-black text-slate-800 tracking-tight">' + e.school + '</h6>' +
                        '<p class="text-[10px] font-bold text-slate-400 uppercase mt-1">' + e.major + ' / ' + e.degree + '</p>' +
                    '</div>' +
                    '<div class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">' +
                        '<button type="button" onclick="openEducationModal(' + idx + ')" class="w-8 h-8 rounded-lg bg-slate-50 text-slate-400 hover:bg-slate-900 hover:text-white transition-all"><i class="fas fa-edit text-[10px]"></i></button>' +
                        '<button type="button" onclick="deleteEducation(' + idx + ')" class="w-8 h-8 rounded-lg bg-red-50 text-red-400 hover:bg-red-500 hover:text-white transition-all"><i class="fas fa-trash text-[10px]"></i></button>' +
                    '</div>' +
                '</div>'
            ).join('');
        }
        window.deleteEducation = (idx) => { if(confirm('Purge this academic record?')) { education.splice(idx,1); renderEducation(); } };

        // Career Logic
        window.openCareerModal = (idx = null) => {
            currentCareerIndex = idx;
            const form = document.getElementById('careerForm');
            form.reset();
            if(idx !== null) {
                const c = career[idx];
                document.getElementById('careerModalId').value = c.id || '';
                document.getElementById('careerModalCompany').value = c.company || '';
                document.getElementById('careerModalPosition').value = c.position || '';
                if(c.start_date) document.getElementById('careerModalStartDate').value = c.start_date.split('T')[0];
                if(c.end_date) document.getElementById('careerModalEndDate').value = c.end_date.split('T')[0];
            }
            document.getElementById('careerModal').classList.remove('hidden');
        };
        window.closeCareerModal = () => document.getElementById('careerModal').classList.add('hidden');
        window.handleSaveCareer = (e) => {
            e.preventDefault();
            const data = {
                id: document.getElementById('careerModalId').value || 'car_' + Date.now(),
                company: document.getElementById('careerModalCompany').value,
                position: document.getElementById('careerModalPosition').value,
                start_date: document.getElementById('careerModalStartDate').value,
                end_date: document.getElementById('careerModalEndDate').value
            };
            if(currentCareerIndex !== null) career[currentCareerIndex] = data;
            else career.push(data);
            closeCareerModal(); renderCareer();
        };
        function renderCareer() {
            const container = document.getElementById('careerContainer');
            container.innerHTML = career.map((c, idx) => 
                '<div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex justify-between items-start group hover:border-purple-300 transition-all">' +
                    '<div>' +
                        '<h6 class="font-black text-slate-800 tracking-tight">' + c.company + '</h6>' +
                        '<p class="text-[10px] font-bold text-slate-400 uppercase mt-1">' + c.position + '</p>' +
                    '</div>' +
                    '<div class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">' +
                        '<button type="button" onclick="openCareerModal(' + idx + ')" class="w-8 h-8 rounded-lg bg-slate-50 text-slate-400 hover:bg-slate-900 hover:text-white transition-all"><i class="fas fa-edit text-[10px]"></i></button>' +
                        '<button type="button" onclick="deleteCareer(' + idx + ')" class="w-8 h-8 rounded-lg bg-red-50 text-red-400 hover:bg-red-500 hover:text-white transition-all"><i class="fas fa-trash text-[10px]"></i></button>' +
                    '</div>' +
                '</div>'
            ).join('');
        }
        window.deleteCareer = (idx) => { if(confirm('Purge this career record?')) { career.splice(idx,1); renderCareer(); } };

        // Certification Logic
        window.openCertificationModal = (idx = null) => {
            currentCertIndex = idx;
            document.getElementById('certificationForm').reset();
            document.getElementById('certModalFileList').innerHTML = '';
            if(idx !== null) {
                const c = certifications[idx];
                document.getElementById('certModalId').value = c.id || '';
                document.getElementById('certModalName').value = c.name || '';
                if(c.issue_date) document.getElementById('certModalIssueDate').value = c.issue_date.split('T')[0];
                if(c.expiry_date) document.getElementById('certModalExpiryDate').value = c.expiry_date.split('T')[0];
                document.getElementById('certModalFileUrls').value = JSON.stringify(c.file_urls || []);
            }
            document.getElementById('certificationModal').classList.remove('hidden');
        };
        window.closeCertificationModal = () => document.getElementById('certificationModal').classList.add('hidden');
        window.handleSaveCertification = async (e) => {
            e.preventDefault();
            const fileInput = document.getElementById('certModalFileInput');
            let fileUrls = JSON.parse(document.getElementById('certModalFileUrls').value);
            if (fileInput.files.length > 0) {
                for (let f of fileInput.files) {
                    const fd = new FormData(); fd.append('file', f); fd.append('category', 'documents');
                    const res = await fetch('/api/upload', { method: 'POST', headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }, body: fd });
                    const r = await res.json();
                    if(r.success) fileUrls.push({ url: r.data.url, name: f.name });
                }
            }
            const data = {
                id: document.getElementById('certModalId').value || 'cert_' + Date.now(),
                name: document.getElementById('certModalName').value,
                issue_date: document.getElementById('certModalIssueDate').value,
                expiry_date: document.getElementById('certModalExpiryDate').value,
                file_urls: fileUrls
            };
            if(currentCertIndex !== null) certifications[currentCertIndex] = data;
            else certifications.push(data);
            closeCertificationModal(); renderCertifications();
        };
        function renderCertifications() {
            const container = document.getElementById('certificationsContainer');
            container.innerHTML = certifications.map((c, idx) => 
                '<div class="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm hover:border-orange-300 transition-all group">' +
                    '<div class="flex justify-between items-start mb-4">' +
                        '<div class="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center"><i class="fas fa-certificate text-xs"></i></div>' +
                        '<div class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">' +
                            '<button type="button" onclick="openCertificationModal(' + idx + ')" class="w-7 h-7 rounded-lg bg-slate-50 text-slate-400 hover:bg-slate-900 transition-all"><i class="fas fa-edit text-[9px]"></i></button>' +
                            '<button type="button" onclick="deleteCertification(' + idx + ')" class="w-7 h-7 rounded-lg bg-red-50 text-red-400 hover:bg-red-500 transition-all"><i class="fas fa-trash text-[9px]"></i></button>' +
                        '</div>' +
                    '</div>' +
                    '<h6 class="font-black text-slate-800 tracking-tight">' + c.name + '</h6>' +
                    '<p class="text-[9px] font-bold text-slate-400 uppercase mt-1 tracking-widest">' + (c.issue_date?.split('T')[0] || 'N/A') + '</p>' +
                    (c.file_urls?.length ? '<div class="mt-4 pt-4 border-t border-slate-50 flex gap-2 overflow-x-auto no-scrollbar">' + c.file_urls.map(f => '<a href="' + f.url + '" target="_blank" class="px-3 py-1 bg-slate-50 rounded-lg text-[8px] font-black text-slate-400 hover:bg-slate-900 hover:text-white transition-all uppercase tracking-tighter">Document</a>').join('') + '</div>' : '') +
                '</div>'
            ).join('');
        }
        window.deleteCertification = (idx) => { if(confirm('Purge this credential?')) { certifications.splice(idx,1); renderCertifications(); } };

        // Maintenance (Training) Logic
        window.openTrainingModal = (idx = null) => {
            currentTrainingIndex = idx;
            document.getElementById('trainingForm').reset();
            if(idx !== null) {
                const t = training[idx];
                document.getElementById('trainingModalId').value = t.id || '';
                document.getElementById('trainingModalName').value = t.name || '';
                document.getElementById('trainingModalHours').value = t.hours || '';
                if(t.start_date) document.getElementById('trainingModalStartDate').value = t.start_date.split('T')[0];
            }
            document.getElementById('trainingModal').classList.remove('hidden');
        };
        window.closeTrainingModal = () => document.getElementById('trainingModal').classList.add('hidden');
        window.handleSaveTraining = (e) => {
            e.preventDefault();
            const data = {
                id: document.getElementById('trainingModalId').value || 'tr_' + Date.now(),
                name: document.getElementById('trainingModalName').value,
                hours: document.getElementById('trainingModalHours').value,
                start_date: document.getElementById('trainingModalStartDate').value
            };
            if(currentTrainingIndex !== null) training[currentTrainingIndex] = data;
            else training.push(data);
            closeTrainingModal(); renderTraining();
        };
        function renderTraining() {
            const container = document.getElementById('trainingContainer');
            container.innerHTML = training.map((t, idx) => 
                '<div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex justify-between items-center group hover:border-emerald-300 transition-all">' +
                    '<div class="flex items-center gap-4">' +
                        '<div class="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black text-xs">' + t.hours + 'H</div>' +
                        '<div>' +
                            '<h6 class="font-black text-slate-800 tracking-tight">' + t.name + '</h6>' +
                            '<p class="text-[9px] font-bold text-slate-400 mt-0.5">' + (t.start_date?.split('T')[0] || 'N/A') + '</p>' +
                        '</div>' +
                    '</div>' +
                    '<div class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">' +
                         '<button type="button" onclick="openTrainingModal(' + idx + ')" class="w-8 h-8 rounded-lg bg-slate-50 text-slate-400 hover:bg-slate-900 transition-all"><i class="fas fa-edit text-[10px]"></i></button>' +
                         '<button type="button" onclick="deleteTraining(' + idx + ')" class="w-8 h-8 rounded-lg bg-red-50 text-red-400 hover:bg-red-500 transition-all"><i class="fas fa-trash text-[10px]"></i></button>' +
                    '</div>' +
                '</div>'
            ).join('');
        }
        window.deleteTraining = (idx) => { if(confirm('Purge this maintenance log?')) { training.splice(idx,1); renderTraining(); } };

        // Teaching History Logic
        window.openTeachingHistoryModal = (idx = null) => {
            currentTeachingIndex = idx;
            document.getElementById('teachingHistoryForm').reset();
            if(idx !== null) {
                const h = teachingHistory[idx];
                document.getElementById('teachingModalId').value = h.id || '';
                document.getElementById('teachingModalCourseName').value = h.course_name || '';
                if(h.start_date) document.getElementById('teachingModalStartDate').value = h.start_date.split('T')[0];
                if(h.end_date) document.getElementById('teachingModalEndDate').value = h.end_date.split('T')[0];
            }
            document.getElementById('teachingHistoryModal').classList.remove('hidden');
        };
        window.closeTeachingHistoryModal = () => document.getElementById('teachingHistoryModal').classList.add('hidden');
        window.handleSaveTeachingHistory = (e) => {
            e.preventDefault();
            const data = {
                id: document.getElementById('teachingModalId').value || 'teach_' + Date.now(),
                course_name: document.getElementById('teachingModalCourseName').value,
                start_date: document.getElementById('teachingModalStartDate').value,
                end_date: document.getElementById('teachingModalEndDate').value
            };
            if(currentTeachingIndex !== null) teachingHistory[currentTeachingIndex] = data;
            else teachingHistory.push(data);
            closeTeachingHistoryModal(); renderTeachingHistory();
        };
        function renderTeachingHistory() {
            const container = document.getElementById('teachingHistoryContainer');
            container.innerHTML = teachingHistory.map((h, idx) => 
                '<div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between group hover:border-indigo-300 transition-all">' +
                    '<div class="flex items-center gap-6">' +
                        '<div class="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center"><i class="fas fa-book-open text-sm"></i></div>' +
                        '<div>' +
                            '<h6 class="font-black text-slate-800 tracking-tight text-lg">' + h.course_name + '</h6>' +
                            '<div class="flex items-center gap-3 mt-1">' +
                                '<span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">' + (h.start_date?.split('T')[0] || '-') + ' ~ ' + (h.end_date?.split('T')[0] || '-') + '</span>' +
                                '<span class="px-2 py-0.5 bg-slate-100 text-[8px] font-black text-slate-500 rounded-full">HISTORICAL LOG</span>' +
                            '</div>' +
                        '</div>' +
                    '</div>' +
                    '<div class="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">' +
                         '<button type="button" onclick="openTeachingHistoryModal(' + idx + ')" class="px-4 py-2 bg-slate-50 text-slate-400 hover:bg-slate-900 hover:text-white rounded-xl text-[10px] font-black uppercase transition-all">Modify</button>' +
                         '<button type="button" onclick="deleteTeachingHistory(' + idx + ')" class="px-4 py-2 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-xl text-[10px] font-black uppercase transition-all">Purge</button>' +
                    '</div>' +
                '</div>'
            ).join('');
        }
        window.deleteTeachingHistory = (idx) => { if(confirm('Purge this session log?')) { teachingHistory.splice(idx,1); renderTeachingHistory(); } };

        // Profile Save Logic
        async function handlePImage(input) {
            if(!input.files[0]) return;
            const fd = new FormData(); fd.append('file', input.files[0]); fd.append('category', 'images'); fd.append('folder', 'profiles');
            const res = await fetch('/api/upload', { method: 'POST', headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }, body: fd });
            const result = await res.json();
            if(result.success) {
                document.getElementById('pImagePreview').src = result.data.url;
                document.getElementById('pImagePreview').classList.remove('hidden');
                document.getElementById('pImagePlaceholder').classList.add('hidden');
                document.getElementById('pImageUrl').value = result.data.url;
            }
        }

        window.handleSaveProfile = async (e) => {
            e.preventDefault();
            const data = {
                name: e.target.name.value,
                email: e.target.email.value,
                phone: e.target.phone.value,
                position: e.target.position.value,
                subject: e.target.subject.value,
                type: e.target.type.value,
                joined_at: e.target.joined_at.value,
                profile_image: e.target.profile_image.value,
                education: JSON.stringify(education),
                career: JSON.stringify(career),
                certifications: JSON.stringify(certifications),
                training_history: JSON.stringify(training),
                teaching_history: JSON.stringify(teachingHistory)
            };
            const res = await fetch('/api/hrd/personnel/' + currentUserId, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('token') },
                body: JSON.stringify(data)
            });
            if((await res.json()).success) {
                alert('Identity Core Synchronized');
                const user = JSON.parse(localStorage.getItem('user'));
                user.name = data.name; user.profile_image = data.profile_image;
                localStorage.setItem('user', JSON.stringify(user));
                location.reload();
            }
        };
    </script>
</body>
</html>
`;
