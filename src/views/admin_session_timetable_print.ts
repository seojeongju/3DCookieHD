
import { hrdSidebar } from './components/hrd_sidebar';

/**
 * 훈련세부시간표 출력 화면 (Standard Print View)
 */
export function adminSessionTimetablePrintHtml(sessionId: number): string {
    return `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>훈련세부시간표 출력</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        @page { size: A4 landscape; margin: 10mm; }
        body { font-family: 'Malgun Gothic', 'Pretendard', sans-serif; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        @media print {
            .no-print { display: none !important; }
            table { page-break-inside: auto; }
            tr { page-break-inside: avoid; page-break-after: auto; }
            thead { display: table-header-group; }
            tfoot { display: table-footer-group; }
            .page-break { page-break-before: always; }
        }
        table, th, td { border: 1px solid #000; border-collapse: collapse; }
        th, td { padding: 4px 6px; text-align: center; font-size: 11px; }
        th { background-color: #f3f4f6; font-weight: bold; }
    </style>
</head>
<body class="p-8 max-w-[1100px] mx-auto bg-white">

    <!-- Controls -->
    <div class="no-print fixed top-0 left-0 right-0 bg-slate-800 text-white p-4 flex justify-between items-center shadow-lg z-50">
        <h1 class="font-bold text-lg">훈련세부시간표 출력 미리보기</h1>
        <div class="flex gap-2">
            <button onclick="window.print()" class="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded font-bold transition flex items-center gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
                인쇄하기
            </button>
            <button onclick="window.close()" class="bg-slate-600 hover:bg-slate-500 px-4 py-2 rounded font-bold transition">닫기</button>
        </div>
    </div>
    
    <div class="no-print h-16"></div>

    <!-- Content -->
    <div id="loading" class="text-center py-20 text-slate-500">데이터를 불러오는 중입니다...</div>
    
    <div id="content" class="hidden space-y-8">
        <!-- Header Info -->
        <div class="border-b-2 border-black pb-4">
            <h1 class="text-2xl font-bold text-center mb-6 underline decoration-double underline-offset-4">훈 련 세 부 시 간 표</h1>
            
            <table class="w-full border-none mb-4">
                <tr class="border-none">
                    <th class="border w-32 bg-slate-100">훈련과정명</th>
                    <td class="border text-left px-4 font-bold text-lg" colspan="3" id="courseName">-</td>
                </tr>
                <tr class="border-none">
                    <th class="border bg-slate-100">훈련기간</th>
                    <td class="border text-left px-4" id="trainingPeriod">-</td>
                    <th class="border bg-slate-100 w-24">회차</th>
                    <td class="border w-24" id="sessionNumber">-</td>
                </tr>
                <tr class="border-none">
                    <th class="border bg-slate-100">훈련기관명</th>
                    <td class="border text-left px-4">와우쓰리디홍대센터</td>
                    <th class="border bg-slate-100">총 시간</th>
                    <td class="border" id="totalHours">-</td>
                </tr>
            </table>
        </div>

        <!-- Timetable List -->
        <div>
            <table class="w-full">
                <thead>
                    <tr>
                        <th class="w-12">순번</th>
                        <th class="w-24">훈련일자</th>
                        <th class="w-12">요일</th>
                        <th class="w-12">교시</th>
                        <th class="w-24">시간</th>
                        <th>교과목명</th>
                        <th class="w-28">직종</th>
                        <th class="w-40">능력/요소단위 코드</th>
                        <th class="w-20">담당교사</th>
                        <th class="w-20">장소</th>
                        <th class="w-12">비고</th>
                    </tr>
                </thead>
                <tbody id="timetableBody">
                    <!-- Dynamic Rows -->
                </tbody>
            </table>
        </div>
        
        <div class="text-center mt-8 text-xs text-slate-500">
            * 본 시간표는 훈련 운영 상황에 따라 변경될 수 있습니다.
        </div>
        
        <div class="mt-8 text-right">
            <span class="font-bold text-lg">와우쓰리디홍대센터장 (인)</span>
        </div>
    </div>

    <script>
        (function() {
            const sessionId = ${sessionId};
            const token = localStorage.getItem('token');
            const headers = token ? { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' };
            const days = ['일', '월', '화', '수', '목', '금', '토'];

            async function init() {
                try {
                    // Fetch Data
                    const [sRes, tRes, rRes, cRes] = await Promise.all([
                        fetch('/api/course-sessions/public/' + sessionId),
                        fetch('/api/course-sessions/' + sessionId + '/timetable', { headers }),
                        fetch('/api/course-sessions/' + sessionId + '/timetable/resources', { headers }),
                        fetch('/api/course-sessions/' + sessionId + '/timetable/config', { headers })
                    ]);

                    if (!sRes.ok || !tRes.ok) throw new Error('Failed to load data');

                    const sJson = await sRes.json();
                    const tJson = await tRes.json();
                    const rJson = await rRes.json();
                    const cJson = await cRes.json();

                    const session = sJson.data || {};
                    const timetable = tJson.data || [];
                    const resources = rJson.data || { subjects: [], instructors: [] };
                    const configs = cJson.data || [];

                    render(session, timetable, resources, configs);

                } catch (e) {
                    console.error(e);
                    document.getElementById('loading').textContent = '데이터를 불러오는데 실패했습니다.';
                }
            }

            function render(session, timetable, resources, configs) {
                // Render Header
                document.getElementById('courseName').textContent = session.course_name || '';
                document.getElementById('trainingPeriod').textContent = (session.training_start_date || '') + ' ~ ' + (session.training_end_date || '');
                document.getElementById('sessionNumber').textContent = (session.session_number || '') + '회차';
                document.getElementById('totalHours').textContent = (session.total_hours || 0) + '시간';

                // Render Table
                const tbody = document.getElementById('timetableBody');
                
                // Sort by Date then Period
                timetable.sort((a, b) => {
                    if (a.training_date !== b.training_date) return a.training_date.localeCompare(b.training_date);
                    return a.period_number - b.period_number;
                });

                // Filter out excluded
                const filtered = timetable.filter(t => !t.is_excluded && t.subject_id);
                
                if (filtered.length === 0) {
                    tbody.innerHTML = '<tr><td colspan="11" class="py-8 text-slate-400">등록된 시간표 데이터가 없습니다.</td></tr>';
                } else {
                    let html = '';
                    let count = 1;
                    
                    filtered.forEach((t) => {
                        const d = new Date(t.training_date);
                        const dayName = days[d.getDay()];
                        const subject = resources.subjects.find(s => s.id === t.subject_id) || { name: '-', ncs_classification_code: '-', main_job_name: '', main_job_code: '', ability_units_json: '' };
                        const instructor = resources.instructors.find(i => i.id === t.instructor_id) || { name: '미정' };
                        
                        const jobLine = (subject.main_job_name || subject.main_job_code) 
                            ? (subject.main_job_name || '') + (subject.main_job_code ? ' (' + subject.main_job_code + ')' : '') 
                            : '-';
                        
                        let codeParts = [];
                        if (subject.ncs_classification_code) codeParts.push(subject.ncs_classification_code);
                        try {
                            const aUnits = subject.ability_units_json ? JSON.parse(subject.ability_units_json) : [];
                            if (aUnits.length > 0 && typeof aUnits[0] === 'object' && aUnits[0].code) codeParts.push(aUnits[0].code);
                            if (aUnits[0] && aUnits[0].elements && aUnits[0].elements.length > 0) {
                                const el = aUnits[0].elements[0];
                                const elCode = typeof el === 'object' && el.code ? String(el.code) : '';
                                if (elCode) codeParts.push(elCode);
                            }
                        } catch (e) {}
                        const codeLine = codeParts.length ? codeParts.join(' › ') : '-';
                        
                        let timeRange = '-';
                        const cfg = configs.find(c => c.period_number === t.period_number);
                        if (cfg) {
                            timeRange = \`\${cfg.start_time} ~ \${cfg.end_time}\`;
                        }

                        html += \`
                            <tr>
                                <td>\${count++}</td>
                                <td>\${t.training_date}</td>
                                <td class="\${dayName === '일' ? 'text-red-600 font-bold' : (dayName === '토' ? 'text-blue-600 font-bold' : '')}">\${dayName}</td>
                                <td>\${t.period_number}교시</td>
                                <td>\${timeRange}</td>
                                <td class="text-left px-2">\${subject.name || '-'}</td>
                                <td class="text-left px-2 text-[10px]">\${jobLine}</td>
                                <td class="text-left px-2 text-[10px] font-mono">\${codeLine}</td>
                                <td>\${instructor.name}</td>
                                <td>\${t.location || session.location || '-'}</td>
                                <td></td>
                            </tr>
                        \`;
                    });
                    
                    tbody.innerHTML = html;
                }

                document.getElementById('loading').classList.add('hidden');
                document.getElementById('content').classList.remove('hidden');
            }

            init();
        })();
    </script>
</body>
</html>
    `;
}
