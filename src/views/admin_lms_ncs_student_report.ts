export const adminLmsNcsStudentReportHtml = `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <title>NCS 능력단위 평가 결과 통지서</title>
    <link rel="stylesheet" href="/static/tailwind-app.css">
<style>
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@100;300;400;500;700;900&display=swap');
        body { font-family: 'Noto Sans KR', sans-serif; }
        @media print {
            .no-print { display: none; }
            body { padding: 0; background: white; }
            .print-page { border: none; box-shadow: none; margin: 0; width: 100%; padding: 0; }
            .paper { margin: 0; box-shadow: none; padding: 2cm; }
        }
        .paper {
            width: 210mm;
            min-height: 297mm;
            padding: 20mm;
            margin: 10mm auto;
            background: white;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
            position: relative;
        }
        table { border-collapse: collapse; width: 100%; border: 2px solid #000; }
        th, td { border: 1px solid #000; padding: 12px 8px; text-align: center; font-size: 14px; }
        th { background-color: #f8fafc; font-weight: 700; }
        .seal {
            position: absolute;
            bottom: 80px;
            right: 80px;
            width: 80px;
            height: 80px;
            border: 3px solid rgba(220, 38, 38, 0.6);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: rgba(220, 38, 38, 0.6);
            font-weight: 900;
            font-size: 16px;
            transform: rotate(-15deg);
        }
    </style>
</head>
<body class="bg-gray-100">
    <div class="no-print p-6 flex justify-center gap-4">
        <button onclick="window.close()" class="px-6 py-2 bg-gray-500 text-white font-bold rounded-lg shadow">닫기</button>
        <button onclick="window.print()" class="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg shadow">인쇄하기 / PDF 저장</button>
    </div>

    <div class="paper print-page">
        <div class="text-center mb-16">
            <h1 class="text-4xl font-black tracking-widest underline underline-offset-8 decoration-4">NCS 능력단위 평가 결과 통지서</h1>
        </div>

        <div class="mb-10">
            <table class="!border-2">
                <tr>
                    <th style="width: 15%;">성 명</th>
                    <td style="width: 35%;" id="studentName">-</td>
                    <th style="width: 15%;">생년월일</th>
                    <td style="width: 35%; font-family: monospace;">-</td>
                </tr>
                <tr>
                    <th>훈 련 과 정</th>
                    <td colspan="3" id="courseTitle" class="text-left px-4 font-bold">-</td>
                </tr>
                <tr>
                    <th>훈 련 기 간</th>
                    <td colspan="3" id="coursePeriod" class="text-left px-4">-</td>
                </tr>
            </table>
        </div>

        <div class="mb-6">
            <h3 class="text-lg font-bold mb-3 flex items-center">
                <i class="fas fa-check-square mr-2"></i> 능력단위별 성취도 평가 결과
            </h3>
            <table>
                <thead>
                    <tr>
                        <th>코드</th>
                        <th>능력단위명</th>
                        <th>평가방법</th>
                        <th>점수</th>
                        <th>이수여부</th>
                    </tr>
                </thead>
                <tbody id="resultTbody">
                    <!-- JS Load -->
                </tbody>
            </table>
        </div>

        <div class="mb-10">
            <h3 class="text-lg font-bold mb-3 flex items-center">
                <i class="fas fa-comment-dots mr-2"></i> 종합 평가 의견
            </h3>
            <div id="generalFeedback" class="min-h-[150px] p-6 border-2 border-black text-sm leading-relaxed whitespace-pre-wrap">
                <!-- JS Load -->
            </div>
        </div>

        <div class="mt-20 text-center space-y-2">
            <p class="text-xl font-medium" id="todayDate">2025년 12월 25일</p>
            <div class="pt-10">
                <p class="text-2xl font-black">와우쓰리디홍대센터 원장 (인)</p>
            </div>
        </div>

        <div class="seal">와우<br>쓰리디</div>
    </div>

    <script>
        const pathParts = window.location.pathname.split('/');
        const studentId = pathParts[pathParts.length - 1];
        const urlParams = new URLSearchParams(window.location.search);
        const _sid = urlParams.get('session_id') || '';
        const rawCourseId = pathParts[3] || _sid;
        const courseId = _sid || rawCourseId;

        function escHtml(v) {
            return String(v == null ? '' : v)
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;');
        }

        document.addEventListener('DOMContentLoaded', async () => {
            const now = new Date();
            document.getElementById('todayDate').textContent = \`\${now.getFullYear()}년 \${now.getMonth() + 1}월 \${now.getDate()}일\`;

            try {
                let qType = urlParams.get('type') || '';
                if (!qType && window.location.pathname.includes('/lms')) qType = 'hrd';
                if (qType && qType.startsWith('hrd')) qType = 'hrd';
                const _sidQ = _sid ? '&session_id=' + encodeURIComponent(_sid) : '';
                let courseUrl = '/api/courses/' + courseId + (qType ? '?type=' + encodeURIComponent(qType) + _sidQ : (_sid ? '?session_id=' + encodeURIComponent(_sid) : ''));
                let cRes = await fetch(courseUrl);
                if (cRes.status === 404) {
                    courseUrl = '/api/courses/' + courseId + '?type=hrd' + _sidQ;
                    cRes = await fetch(courseUrl);
                }
                const cData = await cRes.json();
                if (cData.success && cData.data) {
                    document.getElementById('courseTitle').textContent = cData.data.title || '-';
                    const sDate = cData.data.start_date ? String(cData.data.start_date).split('T')[0] : '-';
                    const eDate = cData.data.end_date ? String(cData.data.end_date).split('T')[0] : '-';
                    document.getElementById('coursePeriod').textContent = \`\${sDate} ~ \${eDate}\`;
                }

                // 2. 학생 성적 및 종합 평가 의견 조회 (courseId 및 session_id 기준)
                const myResUrl = '/api/ncs/my-results?studentId=' + encodeURIComponent(studentId)
                    + (rawCourseId ? '&courseId=' + encodeURIComponent(rawCourseId) : '')
                    + (_sid ? '&session_id=' + encodeURIComponent(_sid) : '');
                const res = await fetch(myResUrl, { headers: { 'Authorization': 'Bearer ' + (localStorage.getItem('token') || '') } });
                const result = await res.json();
                const allRows = (result && result.success && Array.isArray(result.data)) ? result.data : [];

                if (allRows.length > 0) {
                    if (allRows[0].student_name) {
                        document.getElementById('studentName').textContent = allRows[0].student_name;
                    }
                    const tbody = document.getElementById('resultTbody');
                    const feedbackLines = [];

                    tbody.innerHTML = allRows.map(r => {
                        const subjLabel = (r.subject_name && r.unit_name && r.subject_name !== r.unit_name)
                            ? \`\${r.subject_name} (\${r.unit_name})\`
                            : (r.subject_name || r.unit_name || '-');
                        const fb = String(r.feedback || '').trim();
                        if (fb) {
                            feedbackLines.push(\`[\${r.subject_name || r.unit_name || '평가'}] \${fb}\`);
                        }
                        const hasScore = r.score != null && String(r.score).trim() !== '';
                        return \`
                            <tr>
                                <td class="text-[12px] font-mono">\${escHtml(r.unit_code || '-')}</td>
                                <td class="font-bold text-left px-4">\${escHtml(subjLabel)}</td>
                                <td>\${escHtml(r.method || '-')}</td>
                                <td class="font-bold">\${hasScore ? escHtml(r.score) + '점' : '-'}</td>
                                <td class="\${!hasScore ? 'text-gray-500 font-bold' : (Number(r.is_passed) === 1 ? 'text-blue-700 font-bold' : 'text-red-600 font-bold')}">
                                    \${!hasScore ? '미채점' : (Number(r.is_passed) === 1 ? '이수(Pass)' : '미이수(Fail)')}
                                </td>
                            </tr>
                        \`;
                    }).join('');

                    document.getElementById('generalFeedback').textContent = feedbackLines.length > 0
                        ? feedbackLines.join('\\n')
                        : '특이사항 없음.';
                } else {
                    document.getElementById('resultTbody').innerHTML = '<tr><td colspan="5" class="py-6 text-gray-400">등록된 평가 결과가 없습니다.</td></tr>';
                    document.getElementById('generalFeedback').textContent = '등록된 종합 평가 의견이 없습니다.';
                }

                // 3. 학생 이름 보정
                try {
                    const uRes = await fetch('/api/hrd/students/' + encodeURIComponent(studentId), {
                        headers: { 'Authorization': 'Bearer ' + (localStorage.getItem('token') || '') }
                    });
                    const uData = await uRes.json();
                    if (uData && uData.success && uData.data && uData.data.name) {
                        document.getElementById('studentName').textContent = uData.data.name;
                    }
                } catch (_) {}

            } catch (e) { console.error(e); }
        });
    </script>
</body>
</html>
`;
