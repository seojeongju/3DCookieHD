import { hrdSidebar } from './components/hrd_sidebar';

export const adminHrdHtml = () => `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>HRD 행정관리 - 와우쓰리디홍대센터</title>
    <link rel="stylesheet" href="/static/tailwind-app.css">
<link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    </head>
<body class="bg-gray-50 font-sans">
    <div class="flex h-screen overflow-hidden">
        <!-- 사이드바 -->
        ${hrdSidebar('dashboard')}

        <!-- 메인 콘텐츠 -->
        <div class="flex-1 flex flex-col overflow-hidden bg-gray-50">
            <!-- 헤더 -->
            <header class="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 shadow-sm z-10">
                <div class="flex items-center">
                    <h2 class="text-xl font-bold text-gray-800">HRD 대시보드</h2>
                    <span class="ml-4 px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">Today: 2025-12-01</span>
                </div>
                <div class="flex items-center space-x-4">
                    <button class="p-2 text-gray-400 hover:text-gray-600 transition-colors relative">
                        <i class="fas fa-bell"></i>
                        <span class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                    </button>
                    <button class="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                        <i class="fas fa-cog"></i>
                    </button>
                </div>
            </header>

            <!-- 콘텐츠 바디 -->
            <main class="flex-1 overflow-y-auto p-8">
                <!-- 요약 카드 -->
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <!-- 훈련생 수 -->
                    <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
                        <div class="flex justify-between items-start mb-4">
                            <div>
                                <p class="text-sm font-medium text-gray-500">총 훈련생</p>
                                <h3 class="text-3xl font-bold text-gray-800 mt-1"><span id="stat-students">-</span><span class="text-sm font-normal text-gray-400 ml-1">명</span></h3>
                            </div>
                            <div class="p-3 bg-blue-50 rounded-lg text-blue-600">
                                <i class="fas fa-users text-xl"></i>
                            </div>
                        </div>
                        <div class="flex items-center text-sm text-gray-400">
                            실시간 등록 인원
                        </div>
                    </div>

                    <!-- 출석률 -->
                    <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
                        <div class="flex justify-between items-start mb-4">
                            <div>
                                <p class="text-sm font-medium text-gray-500">평균 출석률</p>
                                <h3 class="text-3xl font-bold text-gray-800 mt-1"><span id="stat-attendance">-</span><span class="text-sm font-normal text-gray-400 ml-1">%</span></h3>
                            </div>
                            <div class="p-3 bg-green-50 rounded-lg text-green-600">
                                <i class="fas fa-check-circle text-xl"></i>
                            </div>
                        </div>
                        <div class="flex items-center text-sm text-gray-400">
                            최근 30일 평균
                        </div>
                    </div>

                    <!-- 진행중 과정 -->
                    <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
                        <div class="flex justify-between items-start mb-4">
                            <div>
                                <p class="text-sm font-medium text-gray-500">진행중 과정</p>
                                <h3 class="text-3xl font-bold text-gray-800 mt-1"><span id="stat-courses">-</span><span class="text-sm font-normal text-gray-400 ml-1">개</span></h3>
                            </div>
                            <div class="p-3 bg-purple-50 rounded-lg text-purple-600">
                                <i class="fas fa-book-open text-xl"></i>
                            </div>
                        </div>
                        <div class="flex items-center text-sm text-gray-400">
                            현재 운영중인 강좌
                        </div>
                    </div>

                    <!-- 행정 알림 -->
                    <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
                        <div class="flex justify-between items-start mb-4">
                            <div>
                                <p class="text-sm font-medium text-gray-500">시설/물품</p>
                                <h3 class="text-3xl font-bold text-gray-800 mt-1"><span id="stat-items">-</span><span class="text-sm font-normal text-gray-400 ml-1">건</span></h3>
                            </div>
                            <div class="p-3 bg-red-50 rounded-lg text-red-600">
                                <i class="fas fa-boxes-stacked text-xl"></i>
                            </div>
                        </div>
                        <div class="flex items-center text-sm text-gray-400">
                            관리 대상 자산
                        </div>
                    </div>
                </div>

                <!-- 메인 그리드 -->
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <!-- 최근 출석 현황 -->
                    <div class="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div class="p-6 border-b border-gray-100 flex justify-between items-center">
                            <h3 class="font-bold text-gray-800">실시간 출석 현황</h3>
                            <button class="text-sm text-blue-600 hover:text-blue-800 font-medium">전체보기</button>
                        </div>
                        <div class="p-6">
                            <div class="overflow-x-auto">
                                <table class="w-full text-sm text-left">
                                    <thead class="bg-gray-50 text-gray-500 font-medium">
                                        <tr>
                                            <th class="px-4 py-3 rounded-l-lg">이름</th>
                                            <th class="px-4 py-3">과정명</th>
                                            <th class="px-4 py-3">입실시간</th>
                                            <th class="px-4 py-3">상태</th>
                                            <th class="px-4 py-3 rounded-r-lg">비고</th>
                                        </tr>
                                    </thead>
                                    <tbody id="attendanceTableBody" class="divide-y divide-gray-100">
                                        <tr class="hover:bg-gray-50 transition-colors">
                                            <td colspan="5" class="px-4 py-6 text-center text-gray-400 italic">출석 데이터를 불러오는 중...</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <!-- 빠른 작업 & 공지사항 -->
                    <div class="space-y-8">
                        <!-- 빠른 작업 -->
                        <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            <div class="p-6 border-b border-gray-100">
                                <h3 class="font-bold text-gray-800">빠른 작업</h3>
                            </div>
                            <div class="p-6 grid grid-cols-2 gap-4">
                                <a href="/admin/students" class="p-4 bg-blue-50 rounded-xl text-blue-600 hover:bg-blue-100 transition-colors flex flex-col items-center justify-center gap-2">
                                    <i class="fas fa-user-plus text-2xl"></i>
                                    <span class="text-sm font-medium">훈련생 관리</span>
                                </a>
                                <a href="/admin/personnel" class="p-4 bg-green-50 rounded-xl text-green-600 hover:bg-green-100 transition-colors flex flex-col items-center justify-center gap-2">
                                    <i class="fas fa-chalkboard-teacher text-2xl"></i>
                                    <span class="text-sm font-medium">교강사 관리</span>
                                </a>
                                <a href="/admin/items" class="p-4 bg-purple-50 rounded-xl text-purple-600 hover:bg-purple-100 transition-colors flex flex-col items-center justify-center gap-2">
                                    <i class="fas fa-boxes text-2xl"></i>
                                    <span class="text-sm font-medium">물품 관리</span>
                                </a>
                                <a href="/admin/facilities" class="p-4 bg-orange-50 rounded-xl text-orange-600 hover:bg-orange-100 transition-colors flex flex-col items-center justify-center gap-2">
                                    <i class="fas fa-building text-2xl"></i>
                                    <span class="text-sm font-medium">시설 관리</span>
                                </a>
                            </div>
                        </div>

                        <!-- HRD 공지사항 -->
                        <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            <div class="p-6 border-b border-gray-100 flex justify-between items-center">
                                <h3 class="font-bold text-gray-800">HRD-Net 공지</h3>
                                <a href="#" class="text-xs text-gray-500 hover:text-blue-600">더보기</a>
                            </div>
                            <div class="divide-y divide-gray-100">
                                <a href="#" class="block p-4 hover:bg-gray-50 transition-colors">
                                    <div class="flex items-center gap-2 mb-1">
                                        <span class="px-1.5 py-0.5 bg-red-100 text-red-600 text-[10px] font-bold rounded">중요</span>
                                        <span class="text-xs text-gray-400">2025.12.01</span>
                                    </div>
                                    <p class="text-sm text-gray-700 font-medium line-clamp-1">2026년도 훈련과정 통합심사 일정 안내</p>
                                </a>
                                <a href="#" class="block p-4 hover:bg-gray-50 transition-colors">
                                    <div class="flex items-center gap-2 mb-1">
                                        <span class="px-1.5 py-0.5 bg-gray-100 text-gray-600 text-[10px] font-bold rounded">일반</span>
                                        <span class="text-xs text-gray-400">2025.11.28</span>
                                    </div>
                                    <p class="text-sm text-gray-700 font-medium line-clamp-1">HRD-Net 시스템 점검 안내 (12/05)</p>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    </div>

    <script>
        document.addEventListener('DOMContentLoaded', () => {
            loadStats();
            loadAttendance();
        });

        async function loadStats() {
            try {
                const response = await fetch('/api/hrd/stats');
                const result = await response.json();
                if (result.success) {
                    const { data } = result;
                    document.getElementById('stat-students').textContent = data.students;
                    document.getElementById('stat-attendance').textContent = data.attendanceRate;
                    document.getElementById('stat-courses').textContent = data.activeCourses;
                    document.getElementById('stat-items').textContent = data.items + data.facilities;
                }
            } catch (e) {
                console.error('Failed to load stats:', e);
            }
        }

        async function loadAttendance() {
            // 이번 단계에서는 학생 목록 상위 3명으로 대체하여 보여줌
            try {
                const response = await fetch('/api/hrd/students?status=active');
                const result = await response.json();
                const tbody = document.getElementById('attendanceTableBody');
                
                if (result.success && result.data.length > 0) {
                    tbody.innerHTML = result.data.slice(0, 5).map(s => 
                        '<tr class="hover:bg-gray-50 transition-colors">' +
                            '<td class="px-4 py-3 font-medium text-gray-800">' + s.name + '</td>' +
                            '<td class="px-4 py-3 text-gray-600">' + (s.course_id || '과정 미정') + '</td>' +
                            '<td class="px-4 py-3 text-gray-600">09:00</td>' +
                            '<td class="px-4 py-3"><span class="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">출석</span></td>' +
                            '<td class="px-4 py-3 text-gray-400">-</td>' +
                        '</tr>'
                    ).join('');
                } else {
                    tbody.innerHTML = '<tr><td colspan="5" class="px-4 py-10 text-center text-gray-500">출석 데이터가 없습니다.</td></tr>';
                }
            } catch (e) {
                console.error('Failed to load attendance:', e);
            }
        }
    </script>
</body>
</html>
`;
