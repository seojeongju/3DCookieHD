export const adminHrdAttendancePrintHtml = `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>월간 출석부 출력</title>
    <script src="https://cdn.tailwindcss.com"></script>
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
        .status-present { color: #166534; font-weight: bold; } /* O */
        .status-late { color: #d97706; font-weight: bold; } /* L */
        .status-early_leave { color: #d97706; font-weight: bold; } /* E (same as Late for simplicity or distinct?) */
        .status-absent { color: #dc2626; font-weight: bold; } /* X */
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
            <div class="no-print flex gap-2">
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
                <p class="text-lg font-bold">와우쓰리디홍대센터</p>
            </div>
        </div>
    </div>

    <script>
        document.addEventListener('DOMContentLoaded', async () => {
            const urlParams = new URLSearchParams(window.location.search);
            const courseId = urlParams.get('courseId');
            const year = urlParams.get('year');
            const month = urlParams.get('month');
            const courseTitle = urlParams.get('courseTitle'); // Pass title from parent to avoid extra fetch

            if (!courseId || !year || !month) {
                alert('잘못된 접근입니다.');
                window.close();
                return;
            }

            document.getElementById('yearDisplay').textContent = year;
            document.getElementById('monthDisplay').textContent = month;
            document.getElementById('courseTitle').textContent = decodeURIComponent(courseTitle || '과정명 미지정');
            document.getElementById('printDate').textContent = new Date().toLocaleString();

            await loadData(courseId, year, month);
        });

        async function loadData(courseId, year, month) {
            try {
                const response = await fetch(\`/api/hrd/attendance/monthly?courseId=\${courseId}&year=\${year}&month=\${month}&type=hrd\`);
                const result = await response.json();

                if (result.success) {
                    renderTable(result.data, parseInt(year), parseInt(month));
                } else {
                    alert('데이터를 불러오는데 실패했습니다.');
                }
            } catch (e) {
                console.error(e);
                alert('오류가 발생했습니다.');
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

                for (let i = 1; i <= daysInMonth; i++) {
                    const status = student.attendance[i];
                    let symbol = '';
                    let className = '';

                    if (status === 'present') { symbol = 'O'; className = 'status-present'; present++; }
                    else if (status === 'late') { symbol = 'L'; className = 'status-late'; late++; }
                    else if (status === 'early_leave') { symbol = 'E'; className = 'status-early_leave'; late++; }
                    else if (status === 'absent') { symbol = 'X'; className = 'status-absent'; absent++; }
                    
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
