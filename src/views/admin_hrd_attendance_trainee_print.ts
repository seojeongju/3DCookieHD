/**
 * 훈련생 출결사항 출력 폼 (이미지 레이아웃 동일)
 * 회차 기준 훈련일정·수강생·출결이 자동 로드됨
 */
export const adminHrdAttendanceTraineePrintHtml = `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>훈련생 출결사항</title>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <style>
        @media print {
            body { -webkit-print-color-adjust: exact; }
            .no-print { display: none !important; }
            @page { size: landscape; margin: 10mm; }
        }
        body { font-family: "Malgun Gothic", "Apple SD Gothic Neo", sans-serif; font-size: 12px; color: #111; }
        .print-page { max-width: 297mm; margin: 0 auto; padding: 12px; }
        .title { text-align: center; font-size: 22px; font-weight: bold; margin-bottom: 16px; }
        .header-row { display: flex; justify-content: space-between; margin-bottom: 12px; }
        .header-left p, .header-right p { margin: 4px 0; }
        .header-left .label { display: inline-block; width: 80px; color: #444; }
        .header-right .label { display: inline-block; width: 72px; color: #444; }
        .legend { margin: 10px 0; padding: 8px 0; border-top: 1px solid #ddd; border-bottom: 1px solid #ddd; font-size: 11px; color: #555; }
        table.trainee-table { width: 100%; border-collapse: collapse; table-layout: fixed; }
        table.trainee-table th, table.trainee-table td { border: 1px solid #333; padding: 4px 6px; text-align: center; vertical-align: middle; }
        table.trainee-table th { background: #f5f5f5; font-weight: bold; font-size: 11px; }
        table.trainee-table .col-no { width: 36px; }
        table.trainee-table .col-name { width: 72px; }
        table.trainee-table .col-phone { width: 100px; }
        table.trainee-table .col-gubun { width: 64px; }
        table.trainee-table .col-day { width: 32px; min-width: 32px; }
        .unit-label { font-size: 10px; text-align: left; padding: 2px 4px; background: #f0f0f0; }
        .status-o { color: #166534; font-weight: bold; }
        .status-x { color: #dc2626; font-weight: bold; }
        .status-late { color: #d97706; font-size: 10px; }
    </style>
</head>
<body class="bg-gray-100">
    <div class="print-page">
        <div class="no-print" style="margin-bottom:12px; display:flex; gap:8px;">
            <button type="button" onclick="window.print()" class="px-4 py-2 bg-blue-600 text-white rounded font-bold text-sm">
                <i class="fas fa-print mr-2"></i>인쇄하기
            </button>
            <button type="button" onclick="window.close()" class="px-4 py-2 bg-gray-600 text-white rounded font-bold text-sm">닫기</button>
        </div>

        <h1 class="title">훈련생 출결사항</h1>

        <div class="header-row">
            <div class="header-left">
                <p><span class="label">훈련기관</span> <span id="info-institution"></span></p>
                <p><span class="label">훈련과정</span> <span id="info-course"></span></p>
            </div>
            <div class="header-right">
                <p><span class="label">강의실</span> <span id="info-classroom"></span></p>
                <p><span class="label">훈련시간</span> <span id="info-time"></span></p>
                <p><span class="label">훈련강사</span> <span id="info-instructors"></span></p>
                <p><span class="label">훈련기간</span> <span id="info-period"></span></p>
            </div>
        </div>

        <div class="legend">
            &larr; 결석 2/12 일 인정 / 결석2회 + 지각+조퇴 2회 까지 인정 &nbsp;|&nbsp;
            출석: ○, 결석: X, 지각(시간), 조퇴(시간)로 표기
        </div>

        <table class="trainee-table" id="traineeTable">
            <thead>
                <tr id="theadRow1"></tr>
                <tr id="theadRow2"></tr>
            </thead>
            <tbody id="tbody"></tbody>
        </table>
    </div>

    <script>
        document.addEventListener('DOMContentLoaded', async () => {
            const params = new URLSearchParams(window.location.search);
            const sessionId = params.get('sessionId') || params.get('courseId');
            if (!sessionId) {
                alert('회차 정보가 없습니다.');
                return;
            }
            await loadData(sessionId);
        });

        function formatPhone(phone) {
            if (!phone) return '-';
            const n = (phone + '').replace(/\\D/g, '');
            if (n.length >= 10) return n.replace(/(\\d{3})(\\d{3,4})(\\d{4})/, '$1-$2-$3');
            return phone;
        }

        function attendanceSymbol(status, checkInTime) {
            if (status === 'present') return '<span class="status-o">○</span>';
            if (status === 'absent') return '<span class="status-x">X</span>';
            if (status === 'late') return '<span class="status-late">지각' + (checkInTime ? '(' + (checkInTime + '').substring(0, 5) + ')' : '') + '</span>';
            if (status === 'early_leave') return '<span class="status-late">조퇴</span>';
            if (status === 'public_leave') return '공결';
            return '';
        }

        async function loadData(sessionId) {
            try {
                const res = await fetch('/api/hrd/attendance/print-form?sessionId=' + encodeURIComponent(sessionId));
                const json = await res.json();
                if (!json.success) {
                    alert(json.error || '데이터 로드 실패');
                    return;
                }
                const d = json.data;
                const { info, trainingDays, students, attendance } = d;

                document.getElementById('info-institution').textContent = info.institution || '';
                document.getElementById('info-course').textContent = info.courseTitle || '';
                document.getElementById('info-classroom').textContent = info.classroom || '';
                document.getElementById('info-time').textContent = info.trainingTime || '';
                document.getElementById('info-instructors').textContent = info.instructors || '';
                document.getElementById('info-period').textContent = info.trainingPeriod || '';

                const attendanceMap = {};
                (attendance || []).forEach(a => {
                    const key = a.enrollment_id + '_' + a.date;
                    attendanceMap[key] = { status: a.status, check_in_time: a.check_in_time };
                });

                const theadRow1 = document.getElementById('theadRow1');
                const theadRow2 = document.getElementById('theadRow2');

                theadRow1.innerHTML = '<th rowspan="2" class="col-no">번호</th><th rowspan="2" class="col-name">성명</th><th rowspan="2" class="col-phone">전화번호</th><th rowspan="2" class="col-gubun">구분</th>' +
                    trainingDays.map(day => '<th class="col-day">' + day.dayNumber + '일차</th>').join('');
                theadRow2.innerHTML = trainingDays.map(day => '<th class="col-day">' + day.dateShort + '<br><span style="font-weight:normal">' + day.dayOfWeek + '</span></th>').join('');

                const tbody = document.getElementById('tbody');
                if (students.length === 0) {
                    tbody.innerHTML = '<tr><td colspan="' + (4 + trainingDays.length) + '" style="text-align:center; padding:24px;">수강생이 없습니다.</td></tr>';
                    return;
                }

                tbody.innerHTML = students.map(st => {
                    let dayCells = '';
                    trainingDays.forEach(day => {
                        const key = st.enrollment_id + '_' + day.date;
                        const att = attendanceMap[key];
                        const sym = att ? attendanceSymbol(att.status, att.check_in_time) : '';
                        dayCells += '<td class="col-day">' + sym + '</td>';
                    });
                    return '<tr><td class="col-no">' + st.no + '</td><td class="col-name">' + (st.name || '-') + '</td><td class="col-phone">' + formatPhone(st.phone) + '</td><td class="col-gubun">' + (st.classification || '훈련생') + '</td>' + dayCells + '</tr>';
                }).join('');
            } catch (e) {
                console.error(e);
                alert('출력 데이터를 불러오는 중 오류가 발생했습니다.');
            }
        }
    </script>
</body>
</html>
`;
