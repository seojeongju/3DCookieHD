export const adminHrdAttendancePrintHtml = `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>월간 출석부 출력</title>
    <link rel="stylesheet" href="/static/tailwind-app.css">
<style>
        @media print {
            body { -webkit-print-color-adjust: exact; }
            .no-print { display: none !important; }
            @page { size: landscape; margin: 10mm; }
        }
        .attendance-cell {
            width: 28px;
            height: 28px;
            text-align: center;
            vertical-align: middle;
            font-size: 11px;
            border: 1px solid #e5e7eb;
        }
        .status-present { color: #166534; font-weight: bold; } /* 입실 */
        .status-late { color: #d97706; font-weight: bold; font-size: 10px; } /* 지각/조퇴 */
        .status-early_leave { color: #ea580c; font-weight: bold; font-size: 10px; } /* 조퇴 */
        .status-absent { color: #dc2626; font-weight: bold; } /* 결석 */
        .status-under50 { color: #b45309; font-size: 10px; } /* 50%미만 */
    </style>
</head>
<body class="bg-gray-100 font-sans p-8">
    <div class="max-w-[297mm] mx-auto bg-white p-8 shadow-md print:shadow-none print:p-0">
        <!-- Header -->
        <div class="flex justify-between items-start mb-8">
            <div>
                <h1 class="text-3xl font-bold text-gray-900 mb-2">훈련생 출석부</h1>
                <p class="text-gray-600"><span id="yearDisplay"></span>년 <span id="monthDisplay"></span>월 | 과정명: <span id="courseTitle" class="font-bold"></span></p>
            </div>
            <div class="no-print flex flex-wrap items-center gap-2">
                <label class="text-xs font-bold text-gray-500">출력월
                    <input type="month" id="printMonthInput" class="ml-1 px-2 py-1.5 border border-gray-200 rounded-lg text-sm font-bold text-gray-800">
                </label>
                <button type="button" id="btnReloadMonth" class="px-3 py-2 bg-slate-100 text-slate-700 rounded hover:bg-slate-200 font-bold text-sm">조회</button>
                <button onclick="window.print()" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-bold">
                    <i class="fas fa-print mr-2"></i> 인쇄하기
                </button>
                <button onclick="window.close()" class="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 font-bold">
                    닫기
                </button>
            </div>
        </div>

        <!-- Table -->
        <div class="overflow-x-auto">
            <table class="w-full border-collapse text-xs border border-gray-300">
                <thead>
                    <tr class="bg-gray-100">
                        <th class="border border-gray-300 px-2 py-2 w-10 text-center">NO</th>
                        <th class="border border-gray-300 px-2 py-2 w-32 text-center">성명</th>
                        <th id="daysHeader" class="p-0 border border-gray-300 text-center">
                            <!-- Days 1-31 generated here -->
                        </th>
                        <th class="border border-gray-300 px-2 py-2 w-16 text-center text-blue-600">출석</th>
                        <th class="border border-gray-300 px-2 py-2 w-16 text-center text-orange-600">지각/조퇴</th>
                        <th class="border border-gray-300 px-2 py-2 w-16 text-center text-red-600">결석</th>
                    </tr>
                </thead>
                <tbody id="attendanceBody">
                    <!-- Data Rows -->
                </tbody>
            </table>
        </div>

        <!-- Footer -->
        <div class="mt-8 flex justify-between items-end border-t pt-8">
            <div class="text-sm text-gray-500">
                * 범례: <span class="font-bold text-green-700">O</span> (출석), <span class="font-bold text-orange-600">L/E</span> (지각/조퇴), <span class="font-bold text-red-600">X</span> (결석)<br>
                * 출력일시: <span id="printDate"></span>
            </div>
            <div class="text-right">
                <p class="text-lg font-bold" id="institution-name-display-att-footer">와우쓰리디홍대센터</p>
            </div>
        </div>
    </div>

    <script>
        let state = { courseId: null, year: null, month: null, type: 'hrd', courseTitle: '' };

        function authHeaders() {
            return { 'Authorization': 'Bearer ' + (localStorage.getItem('token') || '') };
        }

        function pad2(n) { return String(n).padStart(2, '0'); }

        function applyHeader() {
            document.getElementById('yearDisplay').textContent = state.year;
            document.getElementById('monthDisplay').textContent = state.month;
            document.getElementById('courseTitle').textContent = state.courseTitle || '과정명 미지정';
            document.getElementById('printDate').textContent = new Date().toLocaleString();
            const monthInput = document.getElementById('printMonthInput');
            if (monthInput && state.year && state.month) {
                monthInput.value = state.year + '-' + pad2(state.month);
            }
        }

        async function resolveFromSession(sessionId) {
            const res = await fetch('/api/hrd/attendance/print-form?sessionId=' + encodeURIComponent(sessionId), { headers: authHeaders() });
            const json = await res.json();
            if (!json.success || !json.data) throw new Error(json.error || '회차 정보를 불러오지 못했습니다.');
            const info = json.data.info || {};
            const days = json.data.trainingDays || [];
            const firstDate = (days[0] && days[0].date) || '';
            const period = String(info.trainingPeriod || '');
            const m = firstDate.match(/^(\\d{4})-(\\d{2})/) || period.match(/(\\d{4})[.](\\d{2})/);
            return {
                courseId: String(sessionId),
                courseTitle: info.courseTitle || '과정명 미지정',
                year: m ? m[1] : String(new Date().getFullYear()),
                month: m ? String(parseInt(m[2], 10)) : String(new Date().getMonth() + 1),
                type: 'hrd'
            };
        }

        document.addEventListener('DOMContentLoaded', async () => {
            const urlParams = new URLSearchParams(window.location.search);
            let courseId = urlParams.get('courseId') || urlParams.get('sessionId');
            let year = urlParams.get('year');
            let month = urlParams.get('month');
            let courseTitle = urlParams.get('courseTitle') ? decodeURIComponent(urlParams.get('courseTitle')) : '';
            let type = (urlParams.get('type') || '').trim().toLowerCase();
            const sessionId = urlParams.get('sessionId');

            if (!courseId) {
                alert('잘못된 접근입니다. 회차 또는 과정 정보가 필요합니다.');
                return;
            }

            try {
                if (sessionId && (!year || !month || !courseTitle)) {
                    const resolved = await resolveFromSession(sessionId);
                    courseId = resolved.courseId;
                    courseTitle = courseTitle || resolved.courseTitle;
                    year = year || resolved.year;
                    month = month || resolved.month;
                    if (!type) type = 'hrd';
                }
                if (!type && sessionId) type = 'hrd';
                if (!type) type = 'hrd';

                if (!year || !month) {
                    alert('출력할 년·월 정보가 없습니다.');
                    return;
                }

                state = { courseId: String(courseId), year: String(year), month: String(parseInt(month, 10)), type, courseTitle };
                applyHeader();
                await loadData(state.courseId, state.year, state.month, state.type);

                document.getElementById('btnReloadMonth').addEventListener('click', async () => {
                    const v = document.getElementById('printMonthInput').value;
                    if (!v) { alert('출력월을 선택하세요.'); return; }
                    const parts = v.split('-');
                    state.year = parts[0];
                    state.month = String(parseInt(parts[1], 10));
                    applyHeader();
                    await loadData(state.courseId, state.year, state.month, state.type);
                });
            } catch (e) {
                console.error(e);
                alert(e.message || '출석부 정보를 불러오지 못했습니다.');
                return;
            }

            try {
                const res = await fetch('/api/settings/institution_name');
                const result = await res.json();
                if (result.success && result.data) {
                    const el = document.getElementById('institution-name-display-att-footer');
                    if (el) el.textContent = result.data;
                }
            } catch (e) {
                console.error('Failed to fetch institution name:', e);
            }
        });

        async function loadData(courseId, year, month, type) {
            try {
                const tbody = document.getElementById('attendanceBody');
                if (tbody) tbody.innerHTML = '<tr><td colspan="40" class="text-center py-10 text-gray-400">불러오는 중…</td></tr>';
                // thead day cells may already exist from previous load — rebuild from original structure
                resetDayHeader();
                const typeQ = type ? ('&type=' + encodeURIComponent(type)) : '';
                const response = await fetch('/api/hrd/attendance/monthly?courseId=' + encodeURIComponent(courseId) +
                    '&year=' + encodeURIComponent(year) + '&month=' + encodeURIComponent(month) + typeQ,
                    { headers: authHeaders() });
                const result = await response.json();

                if (result.success) {
                    renderTable(result.data, parseInt(year, 10), parseInt(month, 10));
                } else {
                    alert(result.error || '데이터를 불러오는데 실패했습니다.');
                }
            } catch (e) {
                console.error(e);
                alert('오류가 발생했습니다.');
            }
        }

        function resetDayHeader() {
            const theadTr = document.querySelector('thead tr');
            if (!theadTr) return;
            // Keep NO, 성명, then summary cols; remove day ths
            const cells = Array.from(theadTr.children);
            cells.forEach(function(cell, idx) {
                if (idx >= 2 && idx < cells.length - 3) cell.remove();
            });
            // Ensure placeholder exists before summary cols
            let daysHeader = document.getElementById('daysHeader');
            if (!daysHeader) {
                daysHeader = document.createElement('th');
                daysHeader.id = 'daysHeader';
                daysHeader.className = 'p-0 border border-gray-300 text-center';
                const attendanceCol = theadTr.children[2];
                theadTr.insertBefore(daysHeader, attendanceCol);
            }
        }

        function renderTable(data, year, month) {
            const daysInMonth = new Date(year, month, 0).getDate();
            
            // Header
            const headerRow = document.createElement('tr');
            let headerHtml = '';
            for (let i = 1; i <= daysInMonth; i++) {
                headerHtml += \`<th class="attendance-cell bg-gray-50">\${i}</th>\`;
            }
            // Need to wrap these ths in a way that aligns with body cells? 
            // The logic above put a single th with id "daysHeader". Let's replace it.
            // Actually, we need to structure the THEAD correctly. 
            // Let's rewrite the THEAD structure dynamically or just inject into the row.
            
            const daysHeaderCell = document.getElementById('daysHeader');
            // We want to replace this SINGLE cell with 30/31 cells.
            // But HTML doesn't allow replacing a TH with multiple THs easily if colspan is not used.
            // Better to clear the TR and rebuild it, or set colspan.
            
            // Let's rebuild the specific part or use colspan?
            // "daysHeader" is a TH in the existing HTML.
            // Let's use innerHTML of the row? No, better to just generate the whole table header row script-side?
            // Let's adjust slightly:
            
            // Re-targeting the TR:
            const theadTr = document.querySelector('thead tr');
            // Remove the placeholder 'daysHeader'
            daysHeaderCell.remove();
            
            // Insert day THs at index 2
            let dayThs = [];
            for (let i = 1; i <= daysInMonth; i++) {
                const th = document.createElement('th');
                th.className = 'attendance-cell bg-gray-50';
                th.textContent = i;
                dayThs.push(th);
            }
            // Insert them before the "출석" column (which is now index 2, assuming NO, Name are 0,1)
            const attendanceCol = theadTr.children[2]; // after removing daysHeader, index 2 is "출석"
            dayThs.forEach(th => theadTr.insertBefore(th, attendanceCol));


            // Body
            const tbody = document.getElementById('attendanceBody');
            
            if (data.length === 0) {
              tbody.innerHTML = '<tr><td colspan="40" class="text-center py-10">데이터가 없습니다.</td></tr>';
              return;
            }

            tbody.innerHTML = data.map((student, index) => {
                let dayCells = '';
                let present = 0, late = 0, absent = 0;

                function fmt(t) { return t ? (''+t).substring(0, 5) : ''; }

                for (let i = 1; i <= daysInMonth; i++) {
                    const entry = student.attendance[i];
                    // API에서 객체({ status, checkIn, checkOut }) 또는 문자열(레거시) 중 하나
                    const status = entry ? (typeof entry === 'object' ? entry.status : entry) : null;
                    const checkIn = entry && typeof entry === 'object' ? fmt(entry.checkIn) : '';
                    const checkOut = entry && typeof entry === 'object' ? fmt(entry.checkOut) : '';

                    let symbol = '';
                    let className = '';

                    if (status === 'present') {
                        symbol = '○'; className = 'status-present'; present++;
                    } else if (status === 'late') {
                        // 지각: 입실시간 표시
                        symbol = '지각' + (checkIn ? '(' + checkIn + ')' : ''); className = 'status-late'; late++;
                    } else if (status === 'early_leave') {
                        // 조퇴: 퇴실시간 표시
                        symbol = '조퇴' + (checkOut ? '(' + checkOut + ')' : ''); className = 'status-early_leave'; late++;
                    } else if (status === 'late_and_early') {
                        // 지각+조퇴: 입실/퇴실시간 모두 표시
                        const timeStr = (checkIn || checkOut) ? '(' + (checkIn || '-') + '~' + (checkOut || '-') + ')' : '';
                        symbol = '지+조' + timeStr; className = 'status-late'; late++;
                    } else if (status === 'absent') {
                        symbol = 'X'; className = 'status-absent'; absent++;
                    } else if (status === 'absent_under_50') {
                        // 50%미만: 시간 있으면 표시
                        const timeStr = (checkIn || checkOut) ? '(' + (checkIn || '') + (checkOut ? '~' + checkOut : '') + ')' : '';
                        symbol = '◐' + timeStr; className = 'status-under50'; absent++;
                    } else if (status === 'public_leave') {
                        symbol = '공'; className = 'status-late';
                    }
                    
                    // Weekend check? (Optional, but good for visual)
                    const date = new Date(year, month - 1, i);
                    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
                    if (isWeekend && !symbol) {
                        className = 'bg-gray-50'; // gray out weekends if no attendance
                    }

                    dayCells += \`<td class="attendance-cell \${className}">\${symbol}</td>\`;
                }

                return \`
                    <tr>
                        <td class="border border-gray-300 px-2 py-1 text-center">\${index + 1}</td>
                        <td class="border border-gray-300 px-2 py-1 text-center font-medium">\${student.name}</td>
                        \${dayCells}
                        <td class="border border-gray-300 px-2 py-1 text-center font-bold text-gray-700">\${present}</td>
                        <td class="border border-gray-300 px-2 py-1 text-center font-bold text-gray-700">\${late}</td>
                        <td class="border border-gray-300 px-2 py-1 text-center font-bold text-gray-700">\${absent}</td>
                    </tr>
                \`;
            }).join('');
        }
    </script>
</body>
</html>
`;
