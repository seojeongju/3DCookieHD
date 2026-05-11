import { hrdSidebar } from './components/hrd_sidebar';

export const adminExamResultsHtml = (sidebar = hrdSidebar('exams')) => `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>시험 결과 관리 - 와우쓰리디홍대센터</title>
    <link rel="stylesheet" href="/static/tailwind-app.css">
<link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
</head>
<body class="bg-gray-50 font-sans">
    <div class="flex h-screen overflow-hidden">
        ${sidebar}

        <main class="flex-1 overflow-y-auto bg-gray-50">
            <header class="bg-white shadow-sm sticky top-0 z-10">
                <div class="px-8 py-4 flex justify-between items-center">
                    <h1 class="text-2xl font-bold text-gray-800">시험 결과 및 채점 관리</h1>
                    <button onclick="history.back()" class="text-gray-500 hover:text-gray-700">
                        <i class="fas fa-arrow-left mr-2"></i> 목록으로
                    </button>
                </div>
            </header>

            <div class="p-8 max-w-7xl mx-auto">
                <div id="loading" class="text-center py-20">
                    <i class="fas fa-spinner fa-spin text-4xl text-blue-500"></i>
                    <p class="mt-4 text-gray-600">데이터를 불러오는 중입니다...</p>
                </div>

                <div id="content" class="hidden space-y-6">
                    <!-- 시험 정보 및 통계 -->
                    <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                        <div class="flex justify-between items-start mb-6">
                            <div>
                                <h2 class="text-xl font-bold text-gray-900" id="examTitle">-</h2>
                                <p class="text-gray-500 mt-1" id="examCourse">-</p>
                            </div>
                            <span id="examActiveBadge" class="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-600">
                                -
                            </span>
                        </div>
                        
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div class="bg-blue-50 rounded-lg p-4 border border-blue-100">
                                <p class="text-sm text-blue-600 font-medium mb-1">총 수강생</p>
                                <p class="text-2xl font-bold text-blue-900" id="statTotalStudents">0명</p>
                            </div>
                            <div class="bg-green-50 rounded-lg p-4 border border-green-100">
                                <p class="text-sm text-green-600 font-medium mb-1">응시 완료</p>
                                <p class="text-2xl font-bold text-green-900" id="statSubmitted">0명</p>
                            </div>
                            <div class="bg-purple-50 rounded-lg p-4 border border-purple-100">
                                <p class="text-sm text-purple-600 font-medium mb-1">평균 점수</p>
                                <p class="text-2xl font-bold text-purple-900" id="statAverage">0점</p>
                            </div>
                        </div>
                    </div>

                    <!-- 수강생 목록 -->
                    <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div class="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                            <h3 class="font-bold text-gray-800">수강생 응시 현황</h3>
                            <div class="text-sm text-gray-500">
                                <span class="w-3 h-3 inline-block rounded-full bg-green-500 mr-1"></span>제출완료
                                <span class="w-3 h-3 inline-block rounded-full bg-gray-300 mr-1 ml-3"></span>미응시
                            </div>
                        </div>
                        <table class="min-w-full divide-y divide-gray-200">
                            <thead class="bg-gray-50">
                                <tr>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">이름</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">연락처/이메일</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">상태</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">제출일시</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">점수</th>
                                    <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">관리</th>
                                </tr>
                            </thead>
                            <tbody id="studentList" class="bg-white divide-y divide-gray-200">
                                <!-- JS 로드 -->
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </main>
    </div>

    <script>
        const examId = window.location.pathname.split('/')[3]; // /admin/exams/{id}/results

        document.addEventListener('DOMContentLoaded', () => {
            loadExamStatus();
        });

        async function loadExamStatus() {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch('/api/exams/' + examId + '/status', {
                    headers: { 'Authorization': 'Bearer ' + token }
                });
                const result = await res.json();
                
                if (result.success) {
                    renderData(result.data);
                } else {
                    alert('데이터 로드 실패: ' + result.error);
                }
            } catch (e) {
                console.error(e);
                alert('오류 발생');
            } finally {
                document.getElementById('loading').classList.add('hidden');
                document.getElementById('content').classList.remove('hidden');
            }
        }

        function renderData(data) {
            const { exam, stats, students } = data;

            // 기본 정보
            document.getElementById('examTitle').textContent = exam.title;
            document.getElementById('examCourse').textContent = '과정 ID: ' + exam.course_id; // course_title이 API에 없으면 ID라도 표시 (JOIN 필요시 API 수정 권장)
            document.getElementById('examActiveBadge').textContent = exam.is_active ? '진행중' : '종료';
            document.getElementById('examActiveBadge').className = \`px-3 py-1 rounded-full text-sm font-medium \${exam.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}\`;

            // 통계
            document.getElementById('statTotalStudents').textContent = stats.total_students + '명';
            document.getElementById('statSubmitted').textContent = stats.submitted_count + '명';
            document.getElementById('statAverage').textContent = stats.average_score + '점';

            // 목록
            const tbody = document.getElementById('studentList');
            if (students.length === 0) {
                tbody.innerHTML = '<tr><td colspan="6" class="px-6 py-8 text-center text-gray-500">등록된 수강생이 없습니다.</td></tr>';
                return;
            }

            tbody.innerHTML = students.map(s => {
                const statusClass = s.has_submitted 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800';
                const statusText = s.has_submitted ? '제출완료' : '미응시';
                const scoreDisplay = s.has_submitted ? (s.score + '점') : '-';
                const dateDisplay = s.submitted_at ? new Date(s.submitted_at).toLocaleString() : '-';

                return \`
                    <tr class="hover:bg-gray-50">
                        <td class="px-6 py-4 whitespace-nowrap">
                            <div class="font-medium text-gray-900">\${s.name}</div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div>\${s.phone}</div>
                            <div class="text-xs">\${s.email}</div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full \${statusClass}">
                                \${statusText}
                            </span>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">\${dateDisplay}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">\${scoreDisplay}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            \${s.has_submitted 
                                ? \`<button onclick="alert('상세 채점 기능 개발 중 (ID: \${s.submission_id})')" class="text-blue-600 hover:text-blue-900">답안 보기</button>\` 
                                : '<span class="text-gray-400">응시 전</span>'}
                        </td>
                    </tr>
                \`;
            }).join('');
        }
    </script>
</body>
</html>
`;
