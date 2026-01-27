
import { lmsHeaderHtml } from './components/lms_header';
export const adminLmsDashboardHtml = `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>학사관리 대시보드 - 와우쓰리디홍대센터</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script>
      tailwind.config = {
        theme: {
          extend: {
            colors: {
              primary: {
                50: '#f0f7ff', 100: '#e0effe', 200: '#baddfd', 300: '#7dbcfb', 400: '#3a9bf7',
                500: '#5b9bd5', 600: '#4a90e2', 700: '#2d5fa3', 800: '#1e4278', 900: '#132d54'
              }
            }
          }
        }
      }
    </script>
</head>
<body class="bg-gray-50">
    <!-- LMS Shared Header -->
    ${lmsHeaderHtml('dashboard')}

    <!-- 메인 컨텐츠 -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <!-- 요약 카드 -->
        <div class="grid md:grid-cols-4 gap-6 mb-8">
            <div class="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-gray-500 font-medium">오늘 출석률</h3>
                    <i class="fas fa-user-check text-blue-500 text-xl"></i>
                </div>
                <div class="flex items-end gap-2">
                    <span class="text-3xl font-bold text-gray-800" id="todayAttendanceRate">--%</span>
                    <span class="text-sm text-gray-500 mb-1" id="todayAttendanceCount">(0/0명)</span>
                </div>
            </div>
            
            <div class="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-gray-500 font-medium">진도율</h3>
                    <i class="fas fa-book-reader text-green-500 text-xl"></i>
                </div>
                <div class="flex items-end gap-2">
                    <span class="text-3xl font-bold text-gray-800" id="courseProgress">--%</span>
                    <span class="text-sm text-gray-500 mb-1" id="courseDayCount">(0/0일)</span>
                </div>
            </div>

            <div class="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-500">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-gray-500 font-medium">상담 요망</h3>
                    <i class="fas fa-exclamation-circle text-yellow-500 text-xl"></i>
                </div>
                <div class="text-3xl font-bold text-gray-800" id="counselingRequiredCount">0</div>
            </div>

            <div class="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-gray-500 font-medium">평균 성적</h3>
                    <i class="fas fa-star text-purple-500 text-xl"></i>
                </div>
                <div class="text-3xl font-bold text-gray-800" id="averageScore">--</div>
            </div>
        </div>

        <div class="grid md:grid-cols-3 gap-8">
            <!-- 왼쪽: 출결 현황 차트 -->
            <div class="md:col-span-2 bg-white rounded-lg shadow p-6">
                <h3 class="text-lg font-bold text-gray-800 mb-4">주간 출결 현황</h3>
                <canvas id="attendanceChart" height="200"></canvas>
            </div>

            <!-- 오른쪽: 오늘의 일정 및 할일 -->
            <div class="space-y-6">
                <!-- 오늘의 훈련 -->
                <div class="bg-white rounded-lg shadow p-6">
                    <h3 class="text-lg font-bold text-gray-800 mb-4">오늘의 훈련</h3>
                    <div class="space-y-3">
                        <div class="p-3 bg-gray-50 rounded border border-gray-100">
                            <div class="text-xs text-gray-500 mb-1">1교시 (09:00~09:50)</div>
                            <div class="font-medium">HTML5 구조의 이해</div>
                        </div>
                        <div class="p-3 bg-gray-50 rounded border border-gray-100">
                            <div class="text-xs text-gray-500 mb-1">2교시 (10:00~10:50)</div>
                            <div class="font-medium">시맨틱 태그 활용</div>
                        </div>
                        <div class="text-center">
                            <button class="text-sm text-purple-600 hover:text-purple-800 font-medium">
                                + 훈련일지 작성하기
                            </button>
                        </div>
                    </div>
                </div>

                <!-- 공지사항 -->
                <div class="bg-white rounded-lg shadow p-6">
                    <div class="flex justify-between items-center mb-4">
                        <h3 class="text-lg font-bold text-gray-800">과정 공지사항</h3>
                        <button class="text-xs text-gray-500 hover:text-gray-700">더보기</button>
                    </div>
                    <ul class="space-y-3 text-sm text-gray-600">
                        <li class="flex justify-between">
                            <span class="truncate pr-2">다음 주 휴강 안내</span>
                            <span class="text-gray-400 text-xs whitespace-nowrap">11.28</span>
                        </li>
                        <li class="flex justify-between">
                            <span class="truncate pr-2">프로젝트 조 편성 결과</span>
                            <span class="text-gray-400 text-xs whitespace-nowrap">11.25</span>
                        </li>
                        <li class="flex justify-between">
                            <span class="truncate pr-2">교재 배부 안내</span>
                            <span class="text-gray-400 text-xs whitespace-nowrap">11.20</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>

        <!-- NCS 진행 현황 (Full Width) -->
        <div class="mt-8 bg-white rounded-lg shadow p-6 border-t-4 border-blue-600">
            <div class="flex justify-between items-center mb-6">
                <h3 class="text-lg font-bold text-gray-800">NCS 능력단위별 이수 현황 (훈련시간 기준)</h3>
                <div class="flex gap-4 text-xs font-semibold">
                    <span class="flex items-center gap-1.5"><span class="w-3 h-3 bg-blue-500 rounded-sm"></span> 이수시간</span>
                    <span class="flex items-center gap-1.5"><span class="w-3 h-3 bg-gray-100 rounded-sm"></span> 남은시간</span>
                </div>
            </div>
            <div id="ncsProgressRows" class="space-y-5">
                <!-- JS Load -->
                <div class="py-10 text-center text-gray-400">NCS 데이터를 불러오는 중...</div>
            </div>
        </div>
    </div>

    <script>
        const courseId = window.location.pathname.split('/')[3];

        document.addEventListener('DOMContentLoaded', () => {
            loadDashboardStats();
            initChart();
            loadNcsSummary();
        });

        // loadCourseInfo removed (handled by shared header)

        async function loadDashboardStats() {
            try {
                // NCS 전체 진도율 계산
                const res = await fetch(\`/api/hrd/courses/\${courseId}/ncs-summary\`);
                const result = await res.json();
                if (result.success && result.data.length > 0) {
                    const totalTarget = result.data.reduce((sum, item) => sum + item.target_hours, 0);
                    const totalCurrent = result.data.reduce((sum, item) => sum + item.current_hours, 0);
                    const overallPercent = totalTarget > 0 ? Math.round((totalCurrent / totalTarget) * 100) : 0;
                    
                    document.getElementById('courseProgress').textContent = overallPercent + '%';
                    document.getElementById('courseDayCount').textContent = \`(\${totalCurrent}/\${totalTarget}시간)\`;
                }

                // TODO: 다른 통계들도 추후 API 연결
                document.getElementById('todayAttendanceRate').textContent = '100%';
                document.getElementById('todayAttendanceCount').textContent = '(출석부 연동 중)';
                document.getElementById('counselingRequiredCount').textContent = '0';
                document.getElementById('averageScore').textContent = '-';
            } catch (e) { console.error(e); }
        }
        function initChart() {
            const ctx = document.getElementById('attendanceChart').getContext('2d');
            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ['월', '화', '수', '목', '금'],
                    datasets: [{
                        label: '출석률 (%)',
                        data: [95, 88, 92, 96, 90],
                        backgroundColor: 'rgba(58, 155, 247, 0.6)',
                        borderColor: 'rgba(58, 155, 247, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    scales: {
                        y: {
                            beginAtZero: true,
                            max: 100
                        }
                    }
                }
            });
        }

        async function loadNcsSummary() {
            try {
                const res = await fetch(\`/api/hrd/courses/\${courseId}/ncs-summary\`);
                const result = await res.json();
                
                if (result.success) {
                    const container = document.getElementById('ncsProgressRows');
                    if (result.data.length === 0) {
                        container.innerHTML = '<div class="py-10 text-center text-gray-400">배정된 NCS 능력단위가 없습니다.</div>';
                        return;
                    }

                    container.innerHTML = result.data.map(item => {
                        const percent = item.target_hours > 0 ? (item.current_hours / item.target_hours * 100) : 0;
                        const limitedPercent = Math.min(percent, 100);
                        return \`
                            <div class="group">
                                <div class="flex justify-between text-sm mb-1.5">
                                    <span class="font-medium text-gray-700">[\${item.unit_code}] \${item.unit_name}</span>
                                    <span class="text-xs text-gray-500 font-bold">\${item.current_hours} / \${item.target_hours}시간 (\${percent.toFixed(1)}%)</span>
                                </div>
                                <div class="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                                    <div class="bg-blue-500 h-full rounded-full transition-all duration-1000" style="width: \${limitedPercent}%"></div>
                                </div>
                            </div>
                        \`;
                    }).join('');
                }
            } catch (e) { console.error(e); }
        }
    </script>
</body>
</html>
`;
