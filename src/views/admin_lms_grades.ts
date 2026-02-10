import { lmsHeaderHtml } from './components/lms_header';
import { hrdSidebar } from './components/hrd_sidebar';

export const adminLmsGradesHtml = `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>성적 관리 - 와우쓰리디홍대센터</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <style>
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 2px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
    </style>
</head>
<body class="bg-gray-50 overflow-hidden">
    <div class="flex h-screen overflow-hidden">
        ${hrdSidebar('courses')}
        
        <div class="flex-1 flex flex-col overflow-hidden relative min-w-0">
            <div class="flex-1 overflow-y-auto custom-scrollbar">
                ${lmsHeaderHtml('grades')}

    <!-- 서브 헤더 -->
    <div class="bg-white border-b border-gray-200 sticky top-[6.5rem] z-30">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div class="flex justify-between items-center">
                <h2 class="text-xl font-bold text-gray-800">종합 성적표</h2>
                <div class="flex gap-2">
                    <button onclick="exportGrades()" class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center shadow-sm">
                        <i class="fas fa-file-excel mr-2"></i> 엑셀 다운로드
                    </button>
                    <button onclick="calculateFinal()" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center shadow-sm">
                        <i class="fas fa-calculator mr-2"></i> 수료 처리
                    </button>
                </div>
            </div>
        </div>
    </div>

    <!-- 메인 컨텐츠 -->
    <main class="flex-1 max-w-full mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 overflow-x-auto">
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 min-w-max">
            <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                    <tr id="tableHeader">
                        <!-- JS로 동적 생성됨 -->
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky left-0 bg-gray-50 z-10 border-r border-gray-200">학생 정보</th>
                        <!-- 시험 컬럼들 -->
                        <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">총점</th>
                        <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">평균</th>
                        <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">석차</th>
                    </tr>
                </thead>
                <tbody id="gradeList" class="bg-white divide-y divide-gray-200">
                    <tr>
                        <td colspan="10" class="px-6 py-10 text-center text-gray-500">
                            <i class="fas fa-spinner fa-spin mr-2"></i> 성적 데이터를 불러오는 중...
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </main>

    <script>
        const courseId = window.location.pathname.split('/')[3];
        let currentData = null;

        document.addEventListener('DOMContentLoaded', () => {
            loadGrades();
        });

        async function loadGrades() {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('/api/courses/' + courseId + '/grades', {
                    headers: { 'Authorization': 'Bearer ' + token }
                });
                const result = await response.json();
                
                if (!result.success) {
                    alert('데이터 로드 실패');
                    return;
                }

                currentData = result.data;
                renderTable(result.data);

            } catch (error) {
                console.error('Error:', error);
                document.getElementById('gradeList').innerHTML = '<tr><td colspan="10" class="px-6 py-10 text-center text-red-500">데이터 로드 실패</td></tr>';
            }
        }

        function renderTable(data) {
            const { exams, students } = data;
            const theadRow = document.getElementById('tableHeader');
            
            // 1. 헤더 구성
            let headerHtml = '<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky left-0 bg-gray-50 z-10 border-r border-gray-200 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">학생 정보</th>';
            
            exams.forEach(exam => {
                headerHtml += \`<th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50 min-w-[150px]">
                    \${exam.title}<br>
                    <span class="text-xs font-normal text-gray-400">(\${exam.total_points || 0}점)</span>
                </th>\`;
            });
            
            headerHtml += '<th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50 border-l border-gray-200">총점</th>';
            headerHtml += '<th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">평균</th>';
            headerHtml += '<th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">석차</th>';
            
            theadRow.innerHTML = headerHtml;

            // 2. 바디 구성
            const tbody = document.getElementById('gradeList');
            
            if (students.length === 0) {
                tbody.innerHTML = '<tr><td colspan="' + (exams.length + 4) + '" class="px-6 py-10 text-center text-gray-500">등록된 수강생이 없습니다.</td></tr>';
                return;
            }

            tbody.innerHTML = students.map(std => {
                let statusBadge = '<span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">재학</span>';
                // 수료 조건 로직은 추후 고도화 (예: 평균 60 이상, 출석 80 이상)

                let cells = '';
                exams.forEach(exam => {
                    const score = std.scores[exam.id];
                    let scoreHtml = '-';
                    if (score !== null) {
                        const percent = (score / (exam.total_points || 100)) * 100;
                        const scoreColor = percent < 60 ? 'text-red-500 font-bold' : 'text-gray-900';
                        scoreHtml = \`<span class="\${scoreColor}">\${score}</span>\`;
                    }
                    cells += \`<td class="px-6 py-4 whitespace-nowrap text-center text-sm">\${scoreHtml}</td>\`;
                });

                return \`
                    <tr class="hover:bg-gray-50 transition">
                        <td class="px-6 py-4 whitespace-nowrap sticky left-0 bg-white z-10 border-r border-gray-200 group-hover:bg-gray-50">
                            <div class="flex items-center">
                                <div class="flex-shrink-0 h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                                    \${std.name.charAt(0)}
                                </div>
                                <div class="ml-4">
                                    <div class="text-sm font-medium text-gray-900">\${std.name}</div>
                                    <div class="text-xs text-gray-500">\${std.email}</div>
                                </div>
                            </div>
                        </td>
                        \${cells}
                        <td class="px-6 py-4 whitespace-nowrap text-center text-sm font-bold text-gray-900 border-l border-gray-200">\${std.totalScore}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-center text-sm font-medium text-blue-600">\${std.average}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">\${std.rank}위</td>
                    </tr>
                \`;
            }).join('');
        }

        function exportGrades() {
            if (!currentData) return;
            // CSV 생성 로직
            const { exams, students } = currentData;
            let csvContent = "data:text/csv;charset=utf-8,\uFEFF"; // BOM 추가
            
            // 헤더
            let header = ["이름", "이메일", "연락처"];
            exams.forEach(e => header.push(e.title + "(" + (e.total_points||0) + "점)"));
            header.push("총점", "평균", "석차");
            csvContent += header.join(",") + "\\n";

            // 데이터
            students.forEach(std => {
                let row = [\`"\${std.name}"\`, \`"\${std.email}"\`, \`"\${std.phone}"\`]; // CSV injection 방지 위해 따옴표
                exams.forEach(e => row.push(std.scores[e.id] !== null ? std.scores[e.id] : ""));
                row.push(std.totalScore, std.average, std.rank);
                csvContent += row.join(",") + "\\n";
            });

            const encodedUri = encodeURI(csvContent);
            const link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", "성적표_과정" + courseId + ".csv");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }

        function calculateFinal() {
            alert('수료 기준에 따른 자동 판정 기능은 준비 중입니다.');
        }
    </script>
            </div>
        </div>
    </div>
</body>
</html>
`;
