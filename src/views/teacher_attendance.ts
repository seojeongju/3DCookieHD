import { teacherSidebar } from './components/teacher_sidebar';

export const teacherAttendanceHtml = `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>출결 정밀 관리 - 3D Cookie</title>
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
        input[type="time"]::-webkit-calendar-picker-indicator { filter: invert(0.5); }
    </style>
</head>
<body class="bg-slate-50 font-sans text-slate-900 antialiased overflow-hidden">
    <div class="flex h-screen overflow-hidden">
        <!-- 사이드바 -->
        ${teacherSidebar('attendance')}

        <div class="flex-1 flex flex-col overflow-hidden relative">
            <div class="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:32px_32px] opacity-40 pointer-events-none"></div>

            <!-- 상단 헤더 -->
            <header class="glass-header sticky top-0 z-20 px-8 py-6 flex justify-between items-center">
                <div class="flex flex-col">
                    <h1 class="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        출결 정밀 관리
                        <span class="text-[10px] bg-emerald-500 text-white px-2 py-0.5 rounded-full uppercase tracking-widest font-black">출결</span>
                    </h1>
                    <p class="text-xs font-medium text-slate-500 mt-0.5 tracking-tight uppercase">실시간 출결 추적 및 통계 분석</p>
                </div>
                <div class="flex items-center gap-4">
                    <button onclick="location.href='/teacher'" class="px-4 py-2 bg-white border border-slate-200 text-[10px] font-black rounded-xl hover:bg-slate-50 transition uppercase tracking-widest flex items-center gap-2 shadow-sm">
                        <i class="fas fa-arrow-left"></i> 대시보드
                    </button>
                    <div class="flex items-center gap-3 pl-4 border-l border-slate-200">
                        <div class="text-right flex flex-col uppercase tracking-tighter">
                            <span id="header-user-name" class="text-xs font-black text-slate-900">강사명</span>
                            <span class="text-[9px] font-black text-slate-400">관리 모드</span>
                        </div>
                    </div>
                </div>
            </header>

            <main class="flex-1 overflow-y-auto p-8 custom-scrollbar relative z-10">
                <div class="max-w-[1400px] mx-auto space-y-8">
                    
                    <!-- 1. 과정 선택 섹션 -->
                    <div id="coursesSection" class="animate-fade-in" style="animation-delay: 0.1s">
                        <div class="flex items-center gap-4 mb-8">
                            <div class="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-100">
                                <i class="fas fa-calendar-check text-sm"></i>
                            </div>
                            <div>
                                <h2 class="text-xl font-black text-slate-800 tracking-tight">출결 관리 대상 선택</h2>
                                <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">출결 관리할 과정을 선택하세요</p>
                            </div>
                        </div>

                        <div id="coursesContainer" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <!-- JS Load -->
                            <div class="col-span-full py-20 flex flex-col items-center justify-center bg-white rounded-[2.5rem] border border-dashed border-slate-200">
                                <i class="fas fa-circle-notch fa-spin text-3xl text-blue-500 mb-4"></i>
                                <p class="text-slate-400 font-black text-sm uppercase tracking-widest">과정 목록을 불러오는 중...</p>
                            </div>
                        </div>
                    </div>

                    <!-- 2. 출결 관리 상세 섹션 (Hidden by Default) -->
                    <div id="attendanceSection" class="hidden animate-fade-in">
                        <div class="flex flex-col lg:flex-row items-stretch gap-8 mb-8">
                            <!-- 통계 요약 카드 (Bento Style) -->
                            <div class="lg:w-1/3 bg-indigo-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl">
                                <div class="absolute -right-20 -bottom-20 w-60 h-60 bg-blue-400/20 rounded-full blur-[80px]"></div>
                                <div class="relative z-10 h-full flex flex-col justify-between">
                                    <div>
                                        <div class="flex items-center gap-3 mb-4">
                                            <div class="w-10 h-10 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center text-white">
                                                <i class="fas fa-chart-pie text-sm"></i>
                                            </div>
                                            <h3 class="font-black tracking-tight">실시간 출결 지표</h3>
                                        </div>
                                        <div class="space-y-6 mt-8">
                                            <div class="flex justify-between items-end border-b border-white/10 pb-4">
                                                <div>
                                                    <span class="block text-[10px] font-black text-indigo-300 uppercase tracking-widest mb-1">총 수강생</span>
                                                    <span class="text-4xl font-black tracking-tighter" id="stat-total">0</span>
                                                </div>
                                                <div class="text-right">
                                                    <span class="block text-[10px] font-black text-indigo-300 uppercase tracking-widest mb-1">출석률</span>
                                                    <span class="text-2xl font-black text-emerald-400" id="stat-rate">0%</span>
                                                </div>
                                            </div>
                                            <div class="grid grid-cols-2 gap-4">
                                                <div class="p-4 bg-white/5 border border-white/5 rounded-2xl">
                                                    <span class="block text-[9px] font-black text-indigo-300 uppercase tracking-widest mb-1">출석</span>
                                                    <span class="text-xl font-black" id="stat-present">0</span>
                                                </div>
                                                <div class="p-4 bg-white/5 border border-white/5 rounded-2xl">
                                                    <span class="block text-[9px] font-black text-indigo-300 uppercase tracking-widest mb-1">결석</span>
                                                    <span class="text-xl font-black text-red-400" id="stat-absent">0</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <button onclick="saveAttendance()" class="mt-8 w-full py-4 bg-white text-indigo-900 font-black text-[11px] rounded-[1.5rem] hover:bg-emerald-400 hover:text-white transition-all uppercase tracking-widest shadow-xl">
                                        출결 데이터 저장
                                    </button>
                                </div>
                            </div>

                            <!-- 필터 및 제어 센터 -->
                            <div class="flex-1 bg-white rounded-[2.5rem] border border-slate-200/60 p-8 shadow-sm flex flex-col justify-between">
                                <div class="flex flex-col md:flex-row gap-6">
                                    <div class="flex-1">
                                        <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">조회 일자</label>
                                        <div class="relative">
                                            <i class="fas fa-calendar absolute left-4 top-1/2 -translate-y-1/2 text-indigo-500"></i>
                                            <input type="date" id="attendanceDate" onchange="loadAttendance()" 
                                                   class="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 outline-none transition-all font-black text-sm text-slate-700 tracking-tight">
                                        </div>
                                    </div>
                                    <div class="flex-1">
                                        <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">출결 상태 필터</label>
                                        <div class="relative">
                                            <i class="fas fa-filter absolute left-4 top-1/2 -translate-y-1/2 text-indigo-500"></i>
                                            <select id="statusFilter" onchange="filterAttendance()" 
                                                    class="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 outline-none transition-all font-black text-sm text-slate-700 tracking-tight appearance-none">
                                                <option value="all">전체 수강생</option>
                                                <option value="present">출석</option>
                                                <option value="late">지각</option>
                                                <option value="early_leave">조퇴</option>
                                                <option value="absent">결석</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div class="mt-8 pt-8 border-t border-slate-100 flex items-center gap-6">
                                    <button onclick="backToCourses()" class="px-6 py-4 bg-slate-100 text-slate-400 font-black text-[10px] rounded-2xl hover:bg-slate-200 transition-all uppercase tracking-widest">
                                        <i class="fas fa-chevron-left mr-2"></i> 재조회
                                    </button>
                                    <div class="flex-1">
                                        <h4 id="selectedCourseTitle" class="text-lg font-black text-slate-900 tracking-tight line-clamp-1">Module Name</h4>
                                        <p class="text-[10px] font-black text-indigo-500 uppercase tracking-widest mt-0.5">학사 연동 모드</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- 데이터 시퀀스 (Grid) -->
                        <div class="bg-white rounded-[2.5rem] border border-slate-200/60 shadow-xl overflow-hidden">
                            <table class="w-full text-left border-collapse">
                                <thead>
                                    <tr class="bg-slate-50/50 border-b border-slate-100">
                                        <th class="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">수강생 정보</th>
                                        <th class="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">출결 상태</th>
                                        <th class="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">등교 시간</th>
                                        <th class="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">하교 시간</th>
                                        <th class="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">특이사항 메모</th>
                                    </tr>
                                </thead>
                                <tbody id="attendanceTableBody" class="divide-y divide-slate-50">
                                    <!-- JS Load -->
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    </div>

    <script>
        let allCourses = [];
        let attendanceData = [];
        let selectedCourseId = null;
        let selectedDate = '';

        document.addEventListener('DOMContentLoaded', () => {
            const userStr = localStorage.getItem('user');
            if (userStr) {
                const user = JSON.parse(userStr);
                document.getElementById('header-user-name').textContent = user.name;
            }
            loadCourses();
            const today = new Date().toISOString().split('T')[0];
            document.getElementById('attendanceDate').value = today;
            selectedDate = today;
        });

        async function loadCourses() {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('/api/courses?limit=100', {
                    headers: { 'Authorization': 'Bearer ' + token }
                });
                const result = await response.json();
                if (result.success) {
                    allCourses = result.data || [];
                    renderCourses();
                }
            } catch (error) { console.error(error); }
        }

        function renderCourses() {
            const container = document.getElementById('coursesContainer');
            if (allCourses.length === 0) {
                container.innerHTML = '<div class="col-span-full py-20 text-center text-slate-400 font-black uppercase text-xs">출결 관리 가능한 과정이 없습니다.</div>';
                return;
            }

            container.innerHTML = allCourses.map(course => 
                '<div onclick="selectCourse(' + course.id + ', \\\'' + ((course.title || '').replace(/'/g, "\\\\'")) + '\\\')" ' +
                     'class="bento-card bg-white rounded-[2rem] p-8 border border-slate-200/60 flex flex-col justify-between cursor-pointer group shadow-sm hover:border-indigo-600/30">' +
                    '<div class="flex justify-between items-start mb-6">' +
                        '<div class="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-500 shadow-sm border border-emerald-100">' +
                            '<i class="fas fa-satellite-dish text-lg font-black"></i>' +
                        '</div>' +
                        '<span class="px-3 py-1 bg-slate-50 text-slate-400 text-[10px] font-black rounded-full uppercase tracking-widest border border-slate-100 group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-500 transition-all">대기중</span>' +
                    '</div>' +
                    '<div>' +
                        '<h3 class="text-xl font-black text-slate-900 tracking-tight group-hover:text-indigo-600 transition-colors mb-2 line-clamp-2">' + course.title + '</h3>' +
                        '<p class="text-[11px] font-medium text-slate-400 line-clamp-2 mb-6 uppercase tracking-tight">이 과정의 실시간 출결 현황을 모니터링하고 관리합니다.</p>' +
                        
                        '<div class="flex items-center justify-between pt-6 border-t border-slate-50">' +
                            '<div class="flex items-center gap-4">' +
                                '<div class="flex flex-col">' +
                                    '<span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">현재 수강생</span>' +
                                    '<span class="text-sm font-black text-slate-700">' + (course.current_students || 0) + '</span>' +
                                '</div>' +
                            '</div>' +
                            '<div class="w-8 h-8 flex items-center justify-center rounded-xl bg-slate-50 group-hover:bg-indigo-600 group-hover:text-white transition-all">' +
                                '<i class="fas fa-chevron-right text-[10px]"></i>' +
                            '</div>' +
                        '</div>' +
                    '</div>' +
                '</div>'
            ).join('');
        }

        async function selectCourse(courseId, courseTitle) {
            selectedCourseId = courseId;
            document.getElementById('coursesSection').classList.add('hidden');
            document.getElementById('attendanceSection').classList.remove('hidden');
            document.getElementById('selectedCourseTitle').textContent = courseTitle;
            await loadAttendance();
        }

        function backToCourses() {
            selectedCourseId = null;
            document.getElementById('coursesSection').classList.remove('hidden');
            document.getElementById('attendanceSection').classList.add('hidden');
        }

        async function loadAttendance() {
            try {
                const token = localStorage.getItem('token');
                selectedDate = document.getElementById('attendanceDate').value;
                const response = await fetch('/api/hrd/attendance?courseId=' + selectedCourseId + '&date=' + selectedDate, {
                    headers: { 'Authorization': 'Bearer ' + token }
                });
                const result = await response.json();
                if (result.success) {
                    attendanceData = result.data || [];
                    renderAttendance();
                    updateStatistics();
                }
            } catch (error) { console.error(error); }
        }

        function renderAttendance() {
            const tbody = document.getElementById('attendanceTableBody');
            const statusFilter = document.getElementById('statusFilter').value;
            let filtered = attendanceData;
            if (statusFilter !== 'all') {
                filtered = attendanceData.filter(a => (a.status || 'absent') === statusFilter);
            }

            if (filtered.length === 0) {
                tbody.innerHTML = '<tr><td colspan="5" class="px-8 py-20 text-center text-slate-400 font-black uppercase text-xs">출결 데이터가 없습니다.</td></tr>';
                return;
            }

            tbody.innerHTML = filtered.map(student => {
                const status = student.status || 'absent';
                let statusStyle = 'bg-slate-100 text-slate-400';
                if(status === 'present') statusStyle = 'bg-emerald-50 text-emerald-600 border border-emerald-100';
                if(status === 'absent') statusStyle = 'bg-red-50 text-red-600 border border-red-100';
                if(status === 'late' || status === 'early_leave') statusStyle = 'bg-orange-50 text-orange-600 border border-orange-100';

                return '<tr class="group hover:bg-slate-50/80 transition-all duration-300">' +
                        '<td class="px-8 py-6">' +
                            '<div class="flex items-center gap-4">' +
                                '<div class="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-white font-black text-lg shadow-lg border border-white/10">' +
                                    (student.name || 'N')[0] +
                                '</div>' +
                                '<div class="flex flex-col">' +
                                    '<span class="text-sm font-black text-slate-900 tracking-tight group-hover:text-indigo-600 transition-colors">' + (student.name || 'Unknown') + '</span>' +
                                    '<span class="text-[10px] font-bold text-slate-400 tracking-tight">' + (student.phone || '-') + '</span>' +
                                '</div>' +
                            '</div>' +
                        '</td>' +
                        '<td class="px-6 py-6 text-center">' +
                            '<select ' +
                                'class="status-select px-4 py-2 rounded-xl border border-slate-200 font-black text-[10px] outline-none transition-all uppercase tracking-widest ' + statusStyle + '" ' +
                                'data-student-id="' + student.id + '" ' +
                                'data-enrollment-id="' + student.enrollment_id + '" ' +
                                'onchange="updateStatusColor(this)">' +
                                '<option value="present" ' + (status === 'present' ? 'selected' : '') + '>출석</option>' +
                                '<option value="late" ' + (status === 'late' ? 'selected' : '') + '>지각</option>' +
                                '<option value="early_leave" ' + (status === 'early_leave' ? 'selected' : '') + '>조퇴</option>' +
                                '<option value="absent" ' + (status === 'absent' ? 'selected' : '') + '>결석</option>' +
                            '</select>' +
                        '</td>' +
                        '<td class="px-6 py-6 text-center">' +
                            '<input type="time" class="in-time-input px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl font-black text-[10px] outline-none focus:ring-4 focus:ring-indigo-100" ' +
                                   'data-student-id="' + student.id + '" value="' + (student.in_time ? student.in_time.substring(0, 5) : '') + '">' +
                        '</td>' +
                        '<td class="px-6 py-6 text-center">' +
                            '<input type="time" class="out-time-input px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl font-black text-[10px] outline-none focus:ring-4 focus:ring-indigo-100" ' +
                                   'data-student-id="' + student.id + '" value="' + (student.out_time ? student.out_time.substring(0, 5) : '') + '">' +
                        '</td>' +
                        '<td class="px-8 py-6">' +
                            '<input type="text" class="memo-input w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none focus:ring-4 focus:ring-indigo-100 transition-all" ' +
                                   'data-student-id="' + student.id + '" value="' + (student.memo || '') + '" placeholder="특이사항 입력...">' +
                        '</td>' +
                '</tr>';
            }).join('');
        }

        function updateStatusColor(select) {
            const status = select.value;
            select.classList.remove('bg-emerald-50', 'text-emerald-600', 'bg-red-50', 'text-red-600', 'bg-orange-50', 'text-orange-600', 'bg-slate-100', 'text-slate-400');
            if(status === 'present') select.classList.add('bg-emerald-50', 'text-emerald-600', 'border-emerald-100');
            else if(status === 'late' || status === 'early_leave') select.classList.add('bg-orange-50', 'text-orange-600', 'border-orange-100');
            else if(status === 'absent') select.classList.add('bg-red-50', 'text-red-600', 'border-red-100');
            else select.classList.add('bg-slate-100', 'text-slate-400');
        }

        function filterAttendance() { renderAttendance(); updateStatistics(); }

        function updateStatistics() {
            const total = attendanceData.length;
            const present = attendanceData.filter(a => a.status === 'present' || a.status === 'late').length;
            const rate = total > 0 ? Math.round((present / total) * 100) : 0;
            document.getElementById('stat-total').textContent = total;
            document.getElementById('stat-rate').textContent = rate + '%';
            document.getElementById('stat-present').textContent = present;
            document.getElementById('stat-absent').textContent = total - present;
        }

        async function saveAttendance() {
            try {
                const token = localStorage.getItem('token');
                const attendances = [];
                document.querySelectorAll('#attendanceTableBody tr').forEach(row => {
                    const statusSelect = row.querySelector('.status-select');
                    if (statusSelect) {
                        attendances.push({
                            studentId: parseInt(statusSelect.getAttribute('data-student-id')),
                            enrollmentId: parseInt(statusSelect.getAttribute('data-enrollment-id')),
                            status: statusSelect.value,
                            inTime: row.querySelector('.in-time-input')?.value || null,
                            outTime: row.querySelector('.out-time-input')?.value || null,
                            memo: row.querySelector('.memo-input')?.value || null
                        });
                    }
                });

                const response = await fetch('/api/hrd/attendance', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
                    body: JSON.stringify({ courseId: selectedCourseId, date: selectedDate, attendances })
                });
                if ((await response.json()).success) {
                    alert('Presence Intel Synchronized Successfully');
                    await loadAttendance();
                }
            } catch (error) { console.error(error); }
        }
    </script>
</body>
</html>
`;
