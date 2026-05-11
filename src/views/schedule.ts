import { navigationHtml } from './components/navigation';

export const scheduleHtml = `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>개강 일정표 - 와우쓰리디홍대센터</title>
    <link rel="stylesheet" href="/static/tailwind-app.css">
<link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <style>
      .calendar-day {
        min-height: 120px;
        transition: all 0.2s;
      }
      .calendar-day:hover {
        background-color: #f0f7ff;
        transform: scale(1.02);
      }
      .schedule-item {
        font-size: 0.75rem;
        padding: 0.25rem 0.5rem;
        margin-bottom: 0.25rem;
        border-radius: 0.25rem;
        cursor: pointer;
        transition: all 0.2s;
      }
      .schedule-item:hover {
        transform: translateX(2px);
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      }
      .schedule-badge {
        display: inline-block;
        padding: 0.125rem 0.375rem;
        font-size: 0.625rem;
        border-radius: 0.25rem;
        font-weight: 600;
      }
    </style>
</head>
<body class="bg-gray-50">
    <!-- 네비게이션 -->
    ${navigationHtml('schedule')}


    <!-- 헤더 -->
    <section class="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-12">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 class="text-4xl font-bold mb-4">
                <i class="fas fa-calendar-alt mr-3"></i>전체 개강 일정표
            </h1>
            <p class="text-xl text-white/90">
                모든 과정의 일정을 한눈에 확인하세요
            </p>
        </div>
    </section>

    <!-- 메인 컨텐츠 -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <!-- 달력 컨트롤 -->
        <div class="bg-white rounded-lg shadow-md p-6 mb-8">
            <div class="flex items-center justify-between mb-6">
                <button onclick="changeMonth(-1)" class="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition">
                    <i class="fas fa-chevron-left"></i> 이전 달
                </button>
                <h2 id="currentMonth" class="text-2xl font-bold text-gray-800"></h2>
                <button onclick="changeMonth(1)" class="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition">
                    다음 달 <i class="fas fa-chevron-right"></i>
                </button>
            </div>

            <!-- 필터 -->
            <div class="flex flex-wrap gap-3 mb-6">
                <button onclick="filterSchedules('all')" class="filter-btn active px-4 py-2 rounded-full bg-primary-600 text-white text-sm font-medium">
                    전체
                </button>
                <button onclick="filterSchedules('통합과정')" class="filter-btn px-4 py-2 rounded-full bg-gray-100 text-gray-700 text-sm font-medium hover:bg-gray-200">
                    통합과정
                </button>
                <button onclick="filterSchedules('단기과정')" class="filter-btn px-4 py-2 rounded-full bg-gray-100 text-gray-700 text-sm font-medium hover:bg-gray-200">
                    단기과정
                </button>
            </div>

            <!-- 달력 -->
            <div class="grid grid-cols-7 gap-2">
                <!-- 요일 헤더 -->
                <div class="text-center font-bold py-3 bg-red-50 text-red-600 rounded">일</div>
                <div class="text-center font-bold py-3 bg-gray-50">월</div>
                <div class="text-center font-bold py-3 bg-gray-50">화</div>
                <div class="text-center font-bold py-3 bg-gray-50">수</div>
                <div class="text-center font-bold py-3 bg-gray-50">목</div>
                <div class="text-center font-bold py-3 bg-gray-50">금</div>
                <div class="text-center font-bold py-3 bg-blue-50 text-blue-600 rounded">토</div>
                
                <!-- 달력 날짜 -->
                <div id="calendarGrid" class="col-span-7 grid grid-cols-7 gap-2">
                    <!-- JavaScript로 동적 생성 -->
                </div>
            </div>
        </div>

        <!-- 테이블 형태 리스트 -->
        <div class="bg-white rounded-lg shadow-md overflow-hidden">
            <div class="px-6 py-4 bg-gray-50 border-b border-gray-200">
                <h3 class="text-xl font-bold text-gray-800">
                    <i class="fas fa-list mr-2"></i>전체 일정 목록
                </h3>
            </div>
            <div class="overflow-x-auto">
                <table class="w-full">
                    <thead class="bg-gray-100 border-b border-gray-200">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">분류</th>
                            <th class="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">대상</th>
                            <th class="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">과정명</th>
                            <th class="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">회차</th>
                            <th class="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">기간</th>
                            <th class="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">시간</th>
                            <th class="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">요일</th>
                            <th class="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">모집인원</th>
                        </tr>
                    </thead>
                    <tbody id="scheduleTableBody" class="bg-white divide-y divide-gray-200">
                        <!-- JavaScript로 동적 생성 -->
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <!-- 스케줄 상세 모달 -->
    <div id="scheduleModal" class="hidden fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div class="p-6">
                <div class="flex items-start justify-between mb-4">
                    <h3 id="modalTitle" class="text-2xl font-bold text-gray-800"></h3>
                    <button onclick="closeModal()" class="text-gray-400 hover:text-gray-600">
                        <i class="fas fa-times text-2xl"></i>
                    </button>
                </div>
                <div id="modalContent" class="space-y-4">
                    <!-- JavaScript로 동적 생성 -->
                </div>
                <div class="mt-6 flex gap-3">
                    <button onclick="closeModal()" class="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition">
                        닫기
                    </button>
                    <button class="flex-1 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition">
                        수강 신청하기
                    </button>
                </div>
            </div>
        </div>
    </div>

    <script>
      const API_BASE = '/api';
      let currentYear = new Date().getFullYear();
      let currentMonth = new Date().getMonth() + 1;
      let allSchedules = [];
      let currentFilter = 'all';

      // 달력 데이터 로드
      async function loadSchedules() {
        try {
          const response = await fetch(\`\${API_BASE}/schedules/calendar/\${currentYear}/\${currentMonth}\`);
          const result = await response.json();
          
          if (result.success) {
            allSchedules = result.data;
            renderCalendar();
            renderTable();
          }
        } catch (error) {
          console.error('Error loading schedules:', error);
        }
      }

      // 달력 렌더링
      function renderCalendar() {
        const firstDay = new Date(currentYear, currentMonth - 1, 1);
        const lastDay = new Date(currentYear, currentMonth, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        document.getElementById('currentMonth').textContent = \`\${currentYear}년 \${currentMonth}월\`;

        let html = '';

        // 이전 달 빈 칸
        for (let i = 0; i < startingDayOfWeek; i++) {
          html += '<div class="calendar-day bg-gray-50 rounded border border-gray-200 p-2"></div>';
        }

        // 현재 달 날짜
        for (let day = 1; day <= daysInMonth; day++) {
          const dateStr = \`\${currentYear}-\${String(currentMonth).padStart(2, '0')}-\${String(day).padStart(2, '0')}\`;
          const daySchedules = allSchedules.filter(s => {
            const start = new Date(s.start_date);
            const end = new Date(s.end_date);
            const current = new Date(dateStr);
            return current >= start && current <= end;
          }).filter(s => currentFilter === 'all' || s.category === currentFilter);

          const isToday = new Date().toDateString() === new Date(dateStr).toDateString();

          html += \`
            <div class="calendar-day bg-white rounded border border-gray-200 p-2 \${isToday ? 'ring-2 ring-primary-500' : ''}">
              <div class="font-bold text-sm mb-1 \${isToday ? 'text-primary-600' : 'text-gray-700'}">\${day}</div>
              <div class="space-y-1">
                \${daySchedules.slice(0, 3).map(s => \`
                  <div onclick="goToCourseDetail('\${s.course_name}')" class="schedule-item bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded p-1.5 cursor-pointer transition shadow-sm mb-1">
                    <div class="font-bold text-xs text-blue-900 truncate mb-1">\${s.course_name}</div>
                    <div class="flex items-center text-xs text-blue-800 mb-0.5">
                        <i class="far fa-clock mr-1.5 text-blue-600 text-[0.7rem]"></i>
                        <span>\${s.start_time || ''} ~ \${s.end_time || ''}</span>
                    </div>
                    <div class="flex items-center text-xs text-gray-600">
                        <i class="far fa-calendar-check mr-1.5 text-gray-400 text-[0.7rem]"></i>
                        <span>\${s.days_of_week ? s.days_of_week : '-'}</span>
                    </div>
                  </div>
                \`).join('')}
                \${daySchedules.length > 3 ? \`<div class="text-xs text-gray-500 text-center">+\${daySchedules.length - 3}개 더보기</div>\` : ''}
              </div>
            </div>
          \`;
        }

        document.getElementById('calendarGrid').innerHTML = html;
      }

      // 테이블 렌더링
      function renderTable() {
        const filteredSchedules = currentFilter === 'all' 
          ? allSchedules 
          : allSchedules.filter(s => s.category === currentFilter);

        const html = filteredSchedules.map(s => \`
          <tr class="hover:bg-gray-50 cursor-pointer" onclick="goToCourseDetail('\${s.course_name}')">
            <td class="px-6 py-4 whitespace-nowrap">
              <span class="schedule-badge bg-primary-100 text-primary-800">\${s.category}</span>
            </td>
            <td class="px-6 py-4 text-sm text-gray-600">\${s.target_audience}</td>
            <td class="px-6 py-4">
              <div class="text-sm font-medium text-gray-900">\${s.course_name}</div>
            </td>
            <td class="px-6 py-4 text-sm text-gray-600">\${s.session_number || '-'}회차</td>
            <td class="px-6 py-4 text-sm text-gray-600">
              \${s.start_date} ~ \${s.end_date}
            </td>
            <td class="px-6 py-4 text-sm text-gray-600">
              \${s.start_time || ''} ~ \${s.end_time || ''}
            </td>
            <td class="px-6 py-4 text-sm text-gray-600">\${s.days_of_week || '-'}</td>
            <td class="px-6 py-4 text-sm text-gray-600">\${s.max_students || '-'}명</td>
          </tr>
        \`).join('');

        document.getElementById('scheduleTableBody').innerHTML = html || \`
          <tr>
            <td colspan="8" class="px-6 py-8 text-center text-gray-500">
              일정이 없습니다.
            </td>
          </tr>
        \`;
      }

      // 월 변경
      function changeMonth(delta) {
        currentMonth += delta;
        if (currentMonth > 12) {
          currentMonth = 1;
          currentYear++;
        } else if (currentMonth < 1) {
          currentMonth = 12;
          currentYear--;
        }
        loadSchedules();
      }

      // 필터링
      function filterSchedules(category) {
        currentFilter = category;
        
        const buttons = document.querySelectorAll('.filter-btn');
        buttons.forEach(btn => {
          btn.classList.remove('active', 'bg-primary-600', 'text-white');
          btn.classList.add('bg-gray-100', 'text-gray-700');
        });
        
        event.target.classList.add('active', 'bg-primary-600', 'text-white');
        event.target.classList.remove('bg-gray-100', 'text-gray-700');

        renderCalendar();
        renderTable();
      }

      // 과정 상세로 이동
      window.goToCourseDetail = function(courseName) {
        console.log('Navigating to course:', courseName);
        if (!courseName) return;
        // 과정명으로 검색하여 이동
        location.href = '/courses?search=' + encodeURIComponent(courseName);
      }

      // 스케줄 상세 보기 (사용 안함)
      async function showScheduleDetail(id) {
        try {
          const response = await fetch(\`\${API_BASE}/schedules/\${id}\`);
          const result = await response.json();
          
          if (result.success) {
            const s = result.data;
            document.getElementById('modalTitle').textContent = s.course_name;
            document.getElementById('modalContent').innerHTML = \`
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <p class="text-sm text-gray-500 mb-1">분류</p>
                  <p class="font-medium">\${s.category}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500 mb-1">대상</p>
                  <p class="font-medium">\${s.target_audience}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500 mb-1">회차</p>
                  <p class="font-medium">\${s.session_number || '-'}회차</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500 mb-1">모집인원</p>
                  <p class="font-medium">\${s.max_students || '-'}명</p>
                </div>
                <div class="col-span-2">
                  <p class="text-sm text-gray-500 mb-1">교육기간</p>
                  <p class="font-medium">\${s.start_date} ~ \${s.end_date}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500 mb-1">교육시간</p>
                  <p class="font-medium">\${s.start_time || ''} ~ \${s.end_time || ''}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500 mb-1">교육요일</p>
                  <p class="font-medium">\${s.days_of_week || '-'}</p>
                </div>
              </div>
            \`;
            document.getElementById('scheduleModal').classList.remove('hidden');
          }
        } catch (error) {
          console.error('Error loading schedule detail:', error);
        }
      }

      // 모달 닫기
      function closeModal() {
        document.getElementById('scheduleModal').classList.add('hidden');
      }

      // 페이지 로드
      document.addEventListener('DOMContentLoaded', () => {
        loadSchedules();
      });
    </script>
</body>
</html>
`;
