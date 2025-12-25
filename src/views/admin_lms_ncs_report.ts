export const adminLmsNcsReportHtml = `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <title>NCS 능력단위 평가 결과 집계표</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        @media print {
            .no-print { display: none; }
            body { padding: 0; background: white; }
            .print-page { border: none; box-shadow: none; margin: 0; width: 100%; }
        }
        table { border-collapse: collapse; width: 100%; }
        th, td { border: 1px solid #000; padding: 8px; text-align: center; font-size: 12px; }
        th { background-color: #f3f4f6; }
    </style>
</head>
<body class="bg-gray-100 p-8">
    <div class="max-w-4xl mx-auto bg-white p-10 shadow-lg print-page">
        <div class="flex justify-between items-center mb-8 no-print">
            <h1 class="text-xl font-bold">NCS 평가 결과 집계표 (미리보기)</h1>
            <button onclick="window.print()" class="px-6 py-2 bg-blue-600 text-white font-bold rounded shadow">인쇄하기 / PDF 저장</button>
        </div>

        <div class="text-center mb-10">
            <h1 class="text-3xl font-black underline decoration-double underline-offset-8">NCS 능력단위 평가 결과 집계표</h1>
        </div>

        <div class="mb-6 grid grid-cols-2 gap-4 border p-4 rounded-lg bg-gray-50">
            <div class="text-sm"><strong>과정명:</strong> <span id="courseTitle">-</span></div>
            <div class="text-sm"><strong>훈련기간:</strong> <span id="coursePeriod">-</span></div>
            <div class="text-sm"><strong>출력일자:</strong> <span id="printDate">-</span></div>
            <div class="text-sm"><strong>확인자:</strong> (인)</div>
        </div>

        <table class="mb-10">
            <thead>
                <tr>
                    <th rowspan="2" style="width: 50px;">연번</th>
                    <th rowspan="2" style="width: 100px;">성명</th>
                    <th id="unitHeaders" colspan="1">능력단위별 성취도 (이수여부)</th>
                    <th rowspan="2" style="width: 80px;">평균</th>
                    <th rowspan="2" style="width: 100px;">최종판정</th>
                </tr>
                <tr id="unitSubHeaders">
                    <!-- JS Load: Units -->
                </tr>
            </thead>
            <tbody id="reportTbody">
                <!-- JS Load: Students & Results -->
            </tbody>
        </table>

        <div class="mt-20 text-center">
            <p class="text-lg font-bold">위와 같이 NCS 능력단위별 평가 결과를 보고합니다.</p>
            <div class="mt-10 text-xl font-black">와우쓰리디홍대센터 귀하</div>
        </div>
    </div>

    <script>
        const courseId = window.location.pathname.split('/')[3];
        
        document.addEventListener('DOMContentLoaded', async () => {
            document.getElementById('printDate').textContent = new Date().toLocaleDateString('ko-KR', { year:'numeric', month:'long', day:'numeric' });
            
            try {
                // 1. 과정 정보
                const cRes = await fetch(\`/api/courses/\${courseId}\`);
                const cData = await cRes.json();
                if (cData.success) {
                    document.getElementById('courseTitle').textContent = cData.data.title;
                    document.getElementById('coursePeriod').textContent = \`\${cData.data.start_date.split('T')[0]} ~ \${cData.data.end_date.split('T')[0]}\`;
                }

                // 2. 능력단위 정보
                const uRes = await fetch(\`/api/ncs/plans?courseId=\${courseId}\`);
                const uData = await uRes.json();
                const plans = uData.data || [];
                
                const unitHeaders = document.getElementById('unitHeaders');
                unitHeaders.colSpan = plans.length;
                
                const unitSubHeaders = document.getElementById('unitSubHeaders');
                unitSubHeaders.innerHTML = plans.map(p => \`<th class="text-[10px]">\${p.unit_name}<br>(\${p.unit_code})</th>\`).join('');

                // 3. 학생별 결과 집계
                // 모든 계획에 대한 결과를 병렬로 가져옴 (성능 최적화는 추후 API 개선)
                const resultsMap = {}; // studentId -> { planId -> result }
                const students = [];

                for (const plan of plans) {
                    const rRes = await fetch(\`/api/ncs/evaluations/\${plan.id}\`);
                    const rData = await rRes.json();
                    if (rData.success) {
                        rData.data.forEach(row => {
                            if (!resultsMap[row.student_id]) {
                                resultsMap[row.student_id] = {};
                                students.push({ id: row.student_id, name: row.name });
                            }
                            resultsMap[row.student_id][plan.id] = row;
                        });
                    }
                }

                const tbody = document.getElementById('reportTbody');
                tbody.innerHTML = students.map((s, idx) => {
                    let totalScore = 0;
                    let count = 0;
                    let isAllPassed = true;

                    const cells = plans.map(p => {
                        const res = resultsMap[s.id][p.id];
                        if (res && res.score !== null) {
                            totalScore += res.score;
                            count++;
                            if (!res.is_passed) isAllPassed = false;
                            return \`<td class="\${res.is_passed ? '' : 'text-red-600 font-bold'}">\${res.score} (\${res.is_passed ? 'P' : 'F'})</td>\`;
                        }
                        isAllPassed = false;
                        return '<td>-</td>';
                    });

                    const avg = count > 0 ? (totalScore / count).toFixed(1) : '-';

                    return \`
                        <tr>
                            <td>\${idx + 1}</td>
                            <td class="font-bold">\${s.name}</td>
                            \${cells.join('')}
                            <td class="bg-gray-50">\${avg}</td>
                            <td class="font-bold \${isAllPassed ? 'text-blue-600' : 'text-red-600'}">\${isAllPassed ? '이수완료' : '미이수'}</td>
                        </tr>
                    \`;
                }).join('');

            } catch (e) { console.error(e); }
        });
    </script>
</body>
</html>
`;
