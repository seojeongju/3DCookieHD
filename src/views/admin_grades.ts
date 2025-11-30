export const adminGradesHtml = `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>성적/채점 관리 - 와우쓰리디홍대센터</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
</head>
<body class="bg-gray-50 font-sans">
    <div class="flex h-screen overflow-hidden">
        <!-- 사이드바 -->
        <aside class="w-64 bg-white border-r border-gray-200 flex flex-col z-20">
            <div class="h-16 flex items-center px-6 border-b border-gray-200">
                <img src="/static/logo.png" alt="WOW 3D" class="h-8 w-auto mr-2">
                <span class="font-bold text-gray-800 tracking-tight">관리자 시스템</span>
            </div>
            <div class="flex-1 overflow-y-auto py-4">
                <nav class="px-4 space-y-6">
                    <div>
                        <a href="/admin" class="flex items-center px-4 py-2.5 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                            <i class="fas fa-home w-5 h-5 mr-3 text-gray-400"></i>
                            대시보드
                        </a>
                    </div>
                    <div>
                        <h3 class="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">학사 관리</h3>
                        <ul class="space-y-1">
                            <li><a href="/admin/courses" class="flex items-center px-4 py-2.5 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"><i class="fas fa-book w-5 h-5 mr-3 text-gray-400"></i>교육과정 관리</a></li>
                            <li><a href="/admin/students" class="flex items-center px-4 py-2.5 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"><i class="fas fa-users w-5 h-5 mr-3 text-gray-400"></i>수강생 관리</a></li>
                            <li><a href="/admin/exams" class="flex items-center px-4 py-2.5 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"><i class="fas fa-file-alt w-5 h-5 mr-3 text-gray-400"></i>시험/문제 관리</a></li>
                            <li>
                                <a href="/admin/grades" class="flex items-center px-4 py-2.5 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg transition-colors">
                                    <i class="fas fa-chart-line w-5 h-5 mr-3 text-blue-500"></i>
                                    성적/채점 관리
                                </a>
                            </li>
                        </ul>
                    </div>
                </nav>
            </div>
        </aside>

        <!-- 메인 컨텐츠 -->
        <main class="flex-1 overflow-y-auto bg-gray-50">
            <header class="bg-white shadow-sm sticky top-0 z-10">
                <div class="px-8 py-4 flex justify-between items-center">
                    <h1 class="text-2xl font-bold text-gray-800">성적/채점 관리</h1>
                    <div class="flex items-center space-x-4">
                        <span class="px-3 py-1 bg-blue-100 text-blue-600 text-xs font-bold rounded-full">LMS</span>
                        <a href="/" class="text-gray-500 hover:text-primary-600 transition"><i class="fas fa-external-link-alt mr-1"></i> 사이트 바로가기</a>
                    </div>
                </div>
            </header>

            <div class="p-8 max-w-7xl mx-auto">
                <!-- 상단 필터 -->
                <div class="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6 flex flex-wrap gap-4 items-center">
                    <div class="relative flex-1 min-w-[200px]">
                        <input type="text" id="searchInput" placeholder="학생 이름 또는 시험 제목 검색..." class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                        <i class="fas fa-search absolute left-3 top-3 text-gray-400"></i>
                    </div>
                    <select id="courseFilter" class="pl-4 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                        <option value="">전체 과정</option>
                    </select>
                    <button onclick="loadGrades()" class="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition">
                        <i class="fas fa-sync-alt mr-1"></i> 새로고침
                    </button>
                </div>

                <!-- 성적 목록 테이블 -->
                <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">학생 정보</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">과정명</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">시험 제목</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">점수</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">제출일시</th>
                                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">상태</th>
                            </tr>
                        </thead>
                        <tbody id="gradeList" class="bg-white divide-y divide-gray-200">
                            <tr>
                                <td colspan="6" class="px-6 py-10 text-center text-gray-500">
                                    <i class="fas fa-spinner fa-spin mr-2"></i> 데이터를 불러오는 중...
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </main>
    </div>

    <script>
        document.addEventListener('DOMContentLoaded', () => {
            loadGrades();
            loadCoursesForFilter();
        });

        async function loadGrades() {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('/api/exams/results', {
                    headers: { 'Authorization': 'Bearer ' + token }
                });
                const results = await response.json();
                
                const tbody = document.getElementById('gradeList');
                if (results.length === 0) {
                    tbody.innerHTML = '<tr><td colspan="6" class="px-6 py-10 text-center text-gray-500">제출된 성적 데이터가 없습니다.</td></tr>';
                    return;
                }

                tbody.innerHTML = results.map(r => {
                    const scorePercent = (r.score / r.total_points) * 100;
                    let badgeClass = 'bg-gray-100 text-gray-800';
                    let statusText = '완료';
                    
                    if (scorePercent >= 80) {
                        badgeClass = 'bg-green-100 text-green-800';
                        statusText = '우수';
                    } else if (scorePercent < 60) {
                        badgeClass = 'bg-red-100 text-red-800';
                        statusText = '재시험 필요';
                    }

                    return \`
                        <tr class="hover:bg-gray-50">
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="flex items-center">
                                    <div class="flex-shrink-0 h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                                        \${r.student_name.charAt(0)}
                                    </div>
                                    <div class="ml-4">
                                        <div class="text-sm font-medium text-gray-900">\${r.student_name}</div>
                                        <div class="text-sm text-gray-500">\${r.student_email}</div>
                                    </div>
                                </div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">\${r.course_title || '-'}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">\${r.exam_title}</td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="text-sm text-gray-900 font-bold">\${r.score} / \${r.total_points}</div>
                                <div class="text-xs text-gray-500">(\${scorePercent.toFixed(1)}%)</div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                \${new Date(r.submitted_at).toLocaleString()}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-right">
                                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full \${badgeClass}">
                                    \${statusText}
                                </span>
                            </td>
                        </tr>
                    \`;
                }).join('');
            } catch (error) {
                console.error('Error:', error);
                document.getElementById('gradeList').innerHTML = '<tr><td colspan="6" class="px-6 py-10 text-center text-red-500">데이터 로드 실패</td></tr>';
            }
        }

        async function loadCoursesForFilter() {
            try {
                const response = await fetch('/api/courses');
                const result = await response.json();
                if (result.success) {
                    const select = document.getElementById('courseFilter');
                    result.data.forEach(course => {
                        const option = document.createElement('option');
                        option.value = course.id;
                        option.textContent = course.title;
                        select.appendChild(option);
                    });
                }
            } catch (e) {
                console.error(e);
            }
        }
    </script>
</body>
</html>
`;
