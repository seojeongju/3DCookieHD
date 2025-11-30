
export const studentExamListHtml = `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>시험 목록 - 와우쓰리디홍대센터</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <script>
      tailwind.config = {
        theme: {
          extend: {
            colors: {
              primary: {
                50: '#f0f7ff',
                100: '#e0effe',
                200: '#baddfd',
                300: '#7dbcfb',
                400: '#3a9bf7',
                500: '#5b9bd5',
                600: '#4a90e2',
                700: '#2d5fa3',
                800: '#1e4278',
                900: '#132d54'
              }
            }
          }
        }
      }
    </script>
</head>
<body class="bg-gray-50">
    <!-- 네비게이션 -->
    <nav class="bg-white shadow-md sticky top-0 z-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between items-center h-16">
                <div class="flex items-center">
                    <a href="/" class="flex items-center gap-2">
                        <img src="/static/logo.png" alt="WOW 3D" class="h-8 w-auto">
                        <span class="font-bold text-gray-800">LMS</span>
                    </a>
                </div>
                <div class="flex items-center space-x-4">
                    <a href="/dashboard" class="text-gray-600 hover:text-primary-600 font-medium">
                        <i class="fas fa-home mr-1"></i> 대시보드
                    </a>
                </div>
            </div>
        </div>
    </nav>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="mb-8">
            <h1 class="text-2xl font-bold text-gray-800">나의 시험 목록</h1>
            <p class="text-gray-600 mt-1">응시 가능한 시험과 지난 시험 결과를 확인하세요.</p>
        </div>

        <div class="bg-white rounded-lg shadow overflow-hidden">
            <div class="p-6 border-b border-gray-200">
                <h2 class="text-lg font-bold text-gray-800" id="courseTitle">과정명 로딩중...</h2>
            </div>
            
            <div class="divide-y divide-gray-200" id="examList">
                <div class="p-8 text-center text-gray-500">
                    <i class="fas fa-spinner fa-spin mr-2"></i> 시험 목록을 불러오는 중...
                </div>
            </div>
        </div>
    </div>

    <script>
        const courseId = window.location.pathname.split('/')[2]; // /courses/:id/exams

        document.addEventListener('DOMContentLoaded', () => {
            loadCourseInfo();
            loadExams();
        });

        async function loadCourseInfo() {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(\`/api/courses/\${courseId}\`, {
                    headers: { 'Authorization': 'Bearer ' + token }
                });
                const result = await response.json();
                if (result.success) {
                    document.getElementById('courseTitle').textContent = result.data.title;
                }
            } catch (error) {
                console.error('Error:', error);
            }
        }

        async function loadExams() {
            try {
                const token = localStorage.getItem('token');
                // 학생용 시험 목록 조회 API (응시 여부 포함)
                const response = await fetch(\`/api/cbt/student/exams?course_id=\${courseId}\`, {
                    headers: { 'Authorization': 'Bearer ' + token }
                });
                const result = await response.json();
                
                const list = document.getElementById('examList');
                
                if (result.success && result.data.length > 0) {
                    list.innerHTML = result.data.map(exam => {
                        const now = new Date();
                        const startTime = new Date(exam.start_time);
                        const endTime = new Date(exam.end_time);
                        
                        let statusBadge = '';
                        let actionButton = '';
                        
                        if (exam.submission_status === 'submitted') {
                            statusBadge = '<span class="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">응시 완료</span>';
                            actionButton = \`<button onclick="viewResult(\${exam.id})" class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm">결과 보기</button>\`;
                        } else if (now < startTime) {
                            statusBadge = '<span class="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">대기중</span>';
                            actionButton = '<button disabled class="px-4 py-2 bg-gray-100 text-gray-400 rounded-lg text-sm cursor-not-allowed">응시 불가</button>';
                        } else if (now > endTime) {
                            statusBadge = '<span class="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">마감됨</span>';
                            actionButton = '<button disabled class="px-4 py-2 bg-gray-100 text-gray-400 rounded-lg text-sm cursor-not-allowed">기간 만료</button>';
                        } else {
                            statusBadge = '<span class="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">응시 가능</span>';
                            actionButton = \`<button onclick="startExam(\${exam.id})" class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm font-bold">시험 응시하기</button>\`;
                        }

                        return \`
                            <div class="p-6 flex items-center justify-between hover:bg-gray-50 transition">
                                <div>
                                    <div class="flex items-center gap-2 mb-1">
                                        <span class="text-xs font-bold text-purple-600 uppercase tracking-wide">\${getExamTypeName(exam.type)}</span>
                                        \${statusBadge}
                                    </div>
                                    <h3 class="text-lg font-bold text-gray-900 mb-1">\${exam.title}</h3>
                                    <div class="text-sm text-gray-500 space-y-1">
                                        <p><i class="far fa-clock w-5"></i> 제한시간: \${exam.time_limit_minutes}분</p>
                                        <p><i class="far fa-calendar-alt w-5"></i> 기간: \${startTime.toLocaleString()} ~ \${endTime.toLocaleString()}</p>
                                    </div>
                                </div>
                                <div>
                                    \${actionButton}
                                </div>
                            </div>
                        \`;
                    }).join('');
                } else {
                    list.innerHTML = '<div class="p-12 text-center text-gray-500">등록된 시험이 없습니다.</div>';
                }
            } catch (error) {
                console.error('Error:', error);
                document.getElementById('examList').innerHTML = '<div class="p-12 text-center text-red-500">오류가 발생했습니다.</div>';
            }
        }

        function getExamTypeName(type) {
            const types = { midterm: '중간평가', final: '기말평가', mock: '모의고사', practice: '연습문제' };
            return types[type] || type;
        }

        function startExam(examId) {
            if (confirm('시험을 시작하시겠습니까?\\n시험이 시작되면 타이머가 작동하며 중단할 수 없습니다.')) {
                window.location.href = \`/exams/\${examId}/take\`;
            }
        }

        function viewResult(examId) {
            alert('결과 보기 기능은 준비중입니다.');
        }
    </script>
</body>
</html>
`;
