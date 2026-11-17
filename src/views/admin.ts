import { hrdSidebar } from './components/hrd_sidebar';

/**
 * 종합 현황 대시보드 (/admin)
 * 디자인 방향: 훈련기관 행정실 — 그래파이트 라이트 램프, 액센트는 블루 하나(#2563eb, 글자 #1d4ed8).
 * 색은 캘린더 분류와 주 차트에만, 시그니처는 운영 과정 카드의 회차 진행선.
 */
export const adminDashboardHtml = `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>종합 현황 - 와우쓰리디홍대센터</title>
    <link rel="stylesheet" href="/static/tailwind-app.css">
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script src='https://cdn.jsdelivr.net/npm/fullcalendar@6.1.10/index.global.min.js'></script>
    <style>
        :root {
            --ink: #171717;
            --ink-2: #525252;
            --ink-3: #737373;
            --line: rgba(23, 23, 23, 0.08);
            --accent: #2563eb;
            --accent-ink: #1d4ed8;
            --mono: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
        }
        .num { font-variant-numeric: tabular-nums; }
        .mono { font-family: var(--mono); font-variant-numeric: tabular-nums; }

        /* 일정 분류 색 — 톤다운된 파스텔/소프트 필 팔레트 */
        .fc-event { cursor: pointer; border-radius: 5px; font-size: 11px; line-height: 16px; padding: 1px 5px; font-weight: 500; transition: filter 0.15s ease; }
        .fc-event:hover { filter: brightness(0.96); }
        .fc-event .fc-event-main, .fc-event .fc-event-title { color: inherit !important; }
        .fc-event-course { background-color: #eff6ff !important; border: 1px solid #bfdbfe !important; color: #1e40af !important; }
        .fc-event-facility { background-color: #ecfdf5 !important; border: 1px solid #a7f3d0 !important; color: #065f46 !important; }
        .fc-event-consultation-inquiry { background-color: #fffbeb !important; border: 1px solid #fde68a !important; color: #92400e !important; }
        .fc-event-consultation-hrd { background-color: #fef2f2 !important; border: 1px solid #fecaca !important; color: #991b1b !important; }
        .fc-event-schedule { background-color: #f1f5f9 !important; border: 1px solid #cbd5e1 !important; color: #334155 !important; }
        body.hide-course .fc-event-course { display: none !important; }
        body.hide-facility .fc-event-facility { display: none !important; }
        body.hide-consultation-inquiry .fc-event-consultation-inquiry { display: none !important; }
        body.hide-consultation-hrd .fc-event-consultation-hrd { display: none !important; }
        body.hide-general .fc-event-schedule { display: none !important; }

        /* FullCalendar 크롬을 조용하게 */
        .fc { --fc-border-color: rgba(23, 23, 23, 0.08); --fc-today-bg-color: rgba(37, 99, 235, 0.05); --fc-page-bg-color: #fff; font-size: 13px; }
        .fc .fc-toolbar-title { font-size: 15px; font-weight: 500; color: var(--ink); }
        .fc .fc-button { background: #fff; border: 1px solid var(--line); color: var(--ink); font-size: 12px; padding: 4px 10px; border-radius: 8px; box-shadow: none; text-transform: none; }
        .fc .fc-button:hover { background: #f4f4f5; }
        .fc .fc-button-primary:not(:disabled).fc-button-active, .fc .fc-button-primary:not(:disabled):active { background: var(--ink); border-color: var(--ink); color: #fff; }
        .fc .fc-button:focus, .fc .fc-button-primary:not(:disabled).fc-button-active:focus { box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.25); }
        .fc .fc-button-group > .fc-button { border-radius: 0; }
        .fc .fc-button-group > .fc-button:first-child { border-radius: 8px 0 0 8px; }
        .fc .fc-button-group > .fc-button:last-child { border-radius: 0 8px 8px 0; }
        .fc-header-toolbar { margin-bottom: 12px !important; }
        .fc .fc-col-header-cell-cushion { color: var(--ink-3); font-weight: 500; font-size: 12px; padding: 8px 4px; }
        .fc .fc-daygrid-day-number { color: var(--ink-2); font-size: 12px; font-variant-numeric: tabular-nums; padding: 6px 8px; }
        .fc .fc-day-today .fc-daygrid-day-number { color: var(--accent-ink); font-weight: 500; }

        .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #d4d4d4; border-radius: 3px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #a3a3a3; }

        .focus-ring:focus-visible { outline: none; box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.3); }
    </style>
</head>
<body class="bg-[#fafafa] font-sans text-[#171717] antialiased overflow-hidden">
    <div class="flex h-[100dvh] overflow-hidden min-h-0 min-w-0">
        <!-- 사이드바 -->
        ${hrdSidebar('dashboard')}

        <!-- 메인 -->
        <main class="flex-1 flex flex-col overflow-hidden relative min-h-0 min-w-0">
            <header class="h-16 shrink-0 bg-white border-b border-[#171717]/[0.08] px-6 lg:px-8 flex items-center justify-between gap-4">
                <div class="flex items-baseline gap-3 min-w-0">
                    <h1 class="text-xl font-medium tracking-tight">종합 현황</h1>
                    <span id="welcome-date" class="hidden sm:inline text-[13px] text-[#737373]">--</span>
                    <span id="user-badge" class="text-[12px] text-[#737373]">관리자</span>
                </div>
                <div class="flex items-center gap-4">
                    <span id="header-clock" class="hidden sm:inline mono text-[13px] text-[#737373]">--:--:--</span>
                    <a href="/" class="focus-ring h-9 px-3 inline-flex items-center gap-2 rounded-lg border border-[#171717]/[0.08] bg-white text-[13px] text-[#525252] hover:bg-[#f4f4f5] transition-colors duration-150 whitespace-nowrap">
                        <i class="fas fa-arrow-up-right-from-square text-[12px] text-[#737373]"></i><span class="hidden sm:inline">홈페이지</span>
                    </a>
                </div>
            </header>

            <div class="flex-1 overflow-y-auto custom-scrollbar">
            <div class="max-w-[1600px] mx-auto p-6 lg:p-8 space-y-8">

                <!-- 1. 핵심 지표 -->
                <section class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
                    <a href="/admin/users" class="focus-ring block rounded-2xl border border-[#171717]/[0.08] bg-white p-5 hover:bg-[#fcfcfc] transition-colors duration-150">
                        <p class="text-[13px] text-[#525252]">전체 회원</p>
                        <p class="mt-3 flex items-baseline gap-1"><span id="stat-total-students" class="num text-[28px] leading-none font-medium">-</span><span class="text-[13px] text-[#737373]">명</span></p>
                        <p class="mt-3 text-[12px] text-[#737373]">가입 기준 누적</p>
                    </a>
                    <a href="/admin/courses" class="focus-ring block rounded-2xl border border-[#171717]/[0.08] bg-white p-5 hover:bg-[#fcfcfc] transition-colors duration-150">
                        <p class="text-[13px] text-[#525252]">교육과정</p>
                        <p class="mt-3 flex items-baseline gap-1"><span id="stat-active-courses" class="num text-[28px] leading-none font-medium">-</span><span class="text-[13px] text-[#737373]">개</span></p>
                        <p class="mt-3 text-[12px] text-[#737373] num">운영 <b id="stat-c-active" class="font-medium text-[#525252]">0</b> · 모집 <b id="stat-c-recruiting" class="font-medium text-[#525252]">0</b> · 종료 <b id="stat-c-closed" class="font-medium text-[#525252]">0</b></p>
                    </a>
                    <a href="/admin/enrollments" class="focus-ring block rounded-2xl border border-[#171717]/[0.08] bg-white p-5 hover:bg-[#fcfcfc] transition-colors duration-150">
                        <p class="text-[13px] text-[#525252]">이번 달 매출</p>
                        <p class="mt-3 flex items-baseline gap-1"><span id="stat-monthly-revenue" class="num text-[28px] leading-none font-medium">-</span><span class="text-[13px] text-[#737373]">원</span></p>
                        <p class="mt-3 text-[12px] text-[#737373] num">카드 <b id="stat-rev-card" class="font-medium text-[#525252]">0</b> · 계좌 <b id="stat-rev-transfer" class="font-medium text-[#525252]">0</b> · 국비 <b id="stat-rev-gov" class="font-medium text-[#525252]">0</b></p>
                    </a>
                    <a href="/admin/inquiries" class="focus-ring block rounded-2xl border border-[#171717]/[0.08] bg-white p-5 hover:bg-[#fcfcfc] transition-colors duration-150">
                        <p class="text-[13px] text-[#525252]">온라인 문의</p>
                        <p class="mt-3 flex items-baseline gap-1"><span id="stat-new-inquiries" class="num text-[28px] leading-none font-medium">-</span><span class="text-[13px] text-[#737373]">건</span></p>
                        <p class="mt-3 text-[12px] text-[#737373] num">답변 대기 <b id="stat-inq-pending" class="font-medium text-[#1d4ed8]">0</b> · 완료 <b id="stat-inq-completed" class="font-medium text-[#525252]">0</b></p>
                    </a>
                    <a href="/admin/analytics" class="focus-ring block rounded-2xl border border-[#171717]/[0.08] bg-white p-5 hover:bg-[#fcfcfc] transition-colors duration-150">
                        <p class="text-[13px] text-[#525252]">오늘 사이트 접속</p>
                        <p class="mt-3 flex items-baseline gap-1"><span id="stat-today-pv" class="num text-[28px] leading-none font-medium">-</span><span class="text-[13px] text-[#737373]">페이지뷰</span></p>
                        <p class="mt-3 text-[12px] text-[#737373] num">방문자 <b id="stat-today-uv" class="font-medium text-[#525252]">-</b>명</p>
                    </a>
                </section>

                <!-- 2. 운영 중인 과정 -->
                <section class="space-y-4">
                    <div class="flex items-center justify-between">
                        <h2 class="text-[15px] font-medium">운영 중인 과정</h2>
                        <a href="/admin/courses/sessions" class="focus-ring rounded text-[13px] text-[#1d4ed8] hover:underline">전체 회차 보기</a>
                    </div>
                    <div id="active-sessions-grid" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                        <div class="col-span-full py-12 text-center rounded-2xl border border-dashed border-[#171717]/[0.12] bg-white text-[13px] text-[#737373]">
                            운영 중인 과정을 불러오는 중
                        </div>
                    </div>
                </section>

                <!-- 3. 일정 -->
                <section class="rounded-2xl border border-[#171717]/[0.08] bg-white p-5">
                    <div class="flex flex-wrap items-center justify-between gap-4 mb-4">
                        <div class="flex flex-wrap items-center gap-x-5 gap-y-2">
                            <button type="button" onclick="toggleCalendarSection()" class="focus-ring rounded inline-flex items-center gap-2 text-[15px] font-medium">
                                일정
                                <i id="calToggleIcon" class="fas fa-chevron-up text-[11px] text-[#737373] transition-transform duration-150"></i>
                            </button>
                            <div class="flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] text-[#525252]">
                                <label class="inline-flex items-center gap-2 cursor-pointer select-none"><input type="checkbox" checked onchange="toggleCalFilter('course')" class="rounded border-[#171717]/20 text-[#2563eb] focus:ring-[#2563eb]/30"><span class="w-2 h-2 rounded-full bg-[#60a5fa]"></span>과정</label>
                                <label class="inline-flex items-center gap-2 cursor-pointer select-none"><input type="checkbox" checked onchange="toggleCalFilter('facility')" class="rounded border-[#171717]/20 text-[#2563eb] focus:ring-[#2563eb]/30"><span class="w-2 h-2 rounded-full bg-[#34d399]"></span>시설</label>
                                <label class="inline-flex items-center gap-2 cursor-pointer select-none"><input type="checkbox" checked onchange="toggleCalFilter('consultation-inquiry')" class="rounded border-[#171717]/20 text-[#2563eb] focus:ring-[#2563eb]/30"><span class="w-2 h-2 rounded-full bg-[#fbbf24]"></span>상담</label>
                                <label class="inline-flex items-center gap-2 cursor-pointer select-none"><input type="checkbox" checked onchange="toggleCalFilter('consultation-hrd')" class="rounded border-[#171717]/20 text-[#2563eb] focus:ring-[#2563eb]/30"><span class="w-2 h-2 rounded-full bg-[#f87171]"></span>면담</label>
                                <label class="inline-flex items-center gap-2 cursor-pointer select-none"><input type="checkbox" checked onchange="toggleCalFilter('general')" class="rounded border-[#171717]/20 text-[#2563eb] focus:ring-[#2563eb]/30"><span class="w-2 h-2 rounded-full bg-[#94a3b8]"></span>일반</label>
                            </div>
                        </div>
                        <a href="/admin/schedule" class="focus-ring rounded text-[13px] text-[#1d4ed8] hover:underline">전체 일정 보기</a>
                    </div>
                    <div id="calendar-section">
                        <div id="dashboardCalendar" style="height: 600px;" class="w-full overflow-hidden transition-[height,opacity] duration-300"></div>
                    </div>
                </section>

                <!-- 4. 주 차트 + 최근 7일 접속 -->
                <section class="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <div class="lg:col-span-2 rounded-2xl border border-[#171717]/[0.08] bg-white p-5">
                        <div class="flex items-baseline justify-between gap-4 mb-4">
                            <h2 class="text-[15px] font-medium">월별 신규 회원</h2>
                            <span class="text-[12px] text-[#737373]">최근 12개월 · 이번 달 강조</span>
                        </div>
                        <div class="relative h-80">
                            <canvas id="growthChart"></canvas>
                        </div>
                    </div>
                    <div class="rounded-2xl border border-[#171717]/[0.08] bg-white p-5">
                        <div class="flex items-baseline justify-between gap-4 mb-4">
                            <h2 class="text-[15px] font-medium">최근 7일 접속</h2>
                            <span class="text-[12px] text-[#737373]">페이지뷰</span>
                        </div>
                        <ul id="website-trend-list" class="space-y-3">
                            <li class="text-[13px] text-[#737373]">불러오는 중</li>
                        </ul>
                    </div>
                </section>

                <!-- 5. 순위 목록 -->
                <section class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div class="rounded-2xl border border-[#171717]/[0.08] bg-white p-5">
                        <div class="flex items-baseline justify-between gap-4 mb-4">
                            <h2 class="text-[15px] font-medium">수강생이 많은 과정</h2>
                            <span class="text-[12px] text-[#737373]">상위 5개</span>
                        </div>
                        <ol id="popular-courses-list" class="space-y-3">
                            <li class="text-[13px] text-[#737373]">불러오는 중</li>
                        </ol>
                    </div>
                    <div class="rounded-2xl border border-[#171717]/[0.08] bg-white p-5">
                        <div class="flex items-baseline justify-between gap-4 mb-4">
                            <h2 class="text-[15px] font-medium">많이 찾은 페이지</h2>
                            <span class="text-[12px] text-[#737373]">최근 30일 · 상위 5개</span>
                        </div>
                        <ol id="top-pages-list" class="space-y-3">
                            <li class="text-[13px] text-[#737373]">불러오는 중</li>
                        </ol>
                    </div>
                </section>

                <!-- 6. 오늘의 현황 -->
                <section class="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <div class="rounded-2xl border border-[#171717]/[0.08] bg-white overflow-hidden">
                        <div class="px-5 h-14 border-b border-[#171717]/[0.08] flex items-center justify-between">
                            <h2 class="text-[15px] font-medium">오늘 출석</h2>
                            <a href="/admin/attendance" class="focus-ring rounded text-[13px] text-[#1d4ed8] hover:underline">전체 보기</a>
                        </div>
                        <div class="overflow-x-auto custom-scrollbar">
                            <table class="w-full text-[13px] text-left">
                                <thead class="text-[12px] text-[#737373]">
                                    <tr>
                                        <th class="px-5 h-10 font-medium">이름</th>
                                        <th class="px-3 h-10 font-medium">과정</th>
                                        <th class="px-3 h-10 font-medium">입실</th>
                                        <th class="px-5 h-10 font-medium">상태</th>
                                    </tr>
                                </thead>
                                <tbody id="attendanceTableBody" class="divide-y divide-[#171717]/[0.06]">
                                    <tr><td colspan="4" class="px-5 py-6 text-center text-[#737373]">불러오는 중</td></tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div class="rounded-2xl border border-[#171717]/[0.08] bg-white overflow-hidden">
                        <div class="px-5 h-14 border-b border-[#171717]/[0.08] flex items-center justify-between">
                            <h2 class="text-[15px] font-medium">시설·비품 점검</h2>
                            <div class="flex items-center gap-3 text-[13px]">
                                <a href="/admin/facilities" class="focus-ring rounded text-[#1d4ed8] hover:underline">시설</a>
                                <a href="/admin/items" class="focus-ring rounded text-[#1d4ed8] hover:underline">물품</a>
                            </div>
                        </div>
                        <div id="abnormal-status-list" class="divide-y divide-[#171717]/[0.06] max-h-80 overflow-y-auto custom-scrollbar">
                            <div class="px-5 py-6 text-center text-[13px] text-[#737373]">불러오는 중</div>
                        </div>
                    </div>
                    <div class="rounded-2xl border border-[#171717]/[0.08] bg-white overflow-hidden">
                        <div class="px-5 h-14 border-b border-[#171717]/[0.08] flex items-center justify-between">
                            <h2 class="text-[15px] font-medium">수강 승인 대기</h2>
                            <a href="/admin/enrollments" class="focus-ring rounded text-[13px] text-[#1d4ed8] hover:underline">전체 보기</a>
                        </div>
                        <div id="pending-approvals-list" class="divide-y divide-[#171717]/[0.06] max-h-80 overflow-y-auto custom-scrollbar">
                            <div class="px-5 py-6 text-center text-[13px] text-[#737373]">불러오는 중</div>
                        </div>
                    </div>
                </section>

                <!-- 7. 빠른 작업 -->
                <section class="rounded-2xl border border-[#171717]/[0.08] bg-white p-5">
                    <h2 class="text-[15px] font-medium mb-4">빠른 작업</h2>
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <button type="button" onclick="location.href='/admin/courses?action=create'" class="focus-ring h-11 px-4 inline-flex items-center gap-2.5 rounded-lg border border-[#171717]/[0.08] bg-white text-[14px] hover:bg-[#f4f4f5] transition-colors duration-150">
                            <i class="fas fa-plus w-4 text-center text-[13px] text-[#737373]"></i>과정 개설
                        </button>
                        <button type="button" onclick="location.href='/admin/students'" class="focus-ring h-11 px-4 inline-flex items-center gap-2.5 rounded-lg border border-[#171717]/[0.08] bg-white text-[14px] hover:bg-[#f4f4f5] transition-colors duration-150">
                            <i class="fas fa-user-plus w-4 text-center text-[13px] text-[#737373]"></i>훈련생 관리
                        </button>
                        <button type="button" onclick="openModal('createJobModal')" class="focus-ring h-11 px-4 inline-flex items-center gap-2.5 rounded-lg border border-[#171717]/[0.08] bg-white text-[14px] hover:bg-[#f4f4f5] transition-colors duration-150">
                            <i class="fas fa-briefcase w-4 text-center text-[13px] text-[#737373]"></i>구인정보 등록
                        </button>
                        <button type="button" onclick="location.href='/admin/posts'" class="focus-ring h-11 px-4 inline-flex items-center gap-2.5 rounded-lg border border-[#171717]/[0.08] bg-white text-[14px] hover:bg-[#f4f4f5] transition-colors duration-150">
                            <i class="fas fa-clipboard-list w-4 text-center text-[13px] text-[#737373]"></i>게시판 관리
                        </button>
                    </div>
                </section>
            </div>
            </div>
        </main>
    </div>

    <!-- 구인정보 등록 모달 -->
    <div id="createJobModal" class="fixed inset-0 bg-black/40 hidden z-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-2xl shadow-[0_8px_24px_rgba(0,0,0,0.08)] w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-[#171717]/[0.08]">
            <div class="px-6 h-14 border-b border-[#171717]/[0.08] flex justify-between items-center sticky top-0 bg-white rounded-t-2xl">
                <h3 class="text-[15px] font-medium">구인정보 등록</h3>
                <button type="button" onclick="closeModal('createJobModal')" aria-label="닫기" class="focus-ring w-8 h-8 inline-flex items-center justify-center rounded-lg text-[#737373] hover:bg-[#f4f4f5] transition-colors duration-150"><i class="fas fa-times"></i></button>
            </div>
            <div class="p-6">
                <form id="createJobForm" onsubmit="handleCreateJob(event)">
                    <div class="space-y-4">
                        <div>
                            <label class="block text-[13px] text-[#525252] mb-1.5">제목</label>
                            <input type="text" name="title" required class="focus-ring w-full h-10 px-3 border border-[#171717]/[0.12] rounded-lg text-[14px]">
                        </div>
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-[13px] text-[#525252] mb-1.5">회사명</label>
                                <input type="text" name="company" value="와우쓰리디홍대센터" class="focus-ring w-full h-10 px-3 border border-[#171717]/[0.12] rounded-lg text-[14px]">
                            </div>
                            <div>
                                <label class="block text-[13px] text-[#525252] mb-1.5">고용 형태</label>
                                <select name="job_type" class="focus-ring w-full h-10 px-3 border border-[#171717]/[0.12] rounded-lg text-[14px] bg-white">
                                    <option value="정규직">정규직</option>
                                    <option value="계약직">계약직</option>
                                    <option value="아르바이트">아르바이트</option>
                                    <option value="인턴">인턴</option>
                                </select>
                            </div>
                        </div>
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-[13px] text-[#525252] mb-1.5">근무지</label>
                                <input type="text" name="location" class="focus-ring w-full h-10 px-3 border border-[#171717]/[0.12] rounded-lg text-[14px]">
                            </div>
                            <div>
                                <label class="block text-[13px] text-[#525252] mb-1.5">급여</label>
                                <input type="text" name="salary" class="focus-ring w-full h-10 px-3 border border-[#171717]/[0.12] rounded-lg text-[14px]">
                            </div>
                        </div>
                        <div>
                            <label class="block text-[13px] text-[#525252] mb-1.5">자격 요건</label>
                            <textarea name="requirements" rows="3" class="focus-ring w-full px-3 py-2 border border-[#171717]/[0.12] rounded-lg text-[14px]"></textarea>
                        </div>
                        <div>
                            <label class="block text-[13px] text-[#525252] mb-1.5">상세 내용</label>
                            <textarea name="description" rows="5" class="focus-ring w-full px-3 py-2 border border-[#171717]/[0.12] rounded-lg text-[14px]"></textarea>
                        </div>
                    </div>
                    <div class="mt-6 flex justify-end gap-2">
                        <button type="button" onclick="closeModal('createJobModal')" class="focus-ring h-10 px-4 rounded-lg border border-[#171717]/[0.08] text-[14px] text-[#525252] hover:bg-[#f4f4f5] transition-colors duration-150">취소</button>
                        <button type="submit" class="focus-ring h-10 px-4 rounded-lg bg-[#171717] text-white text-[14px] hover:bg-[#2b2b2b] transition-colors duration-150">등록</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <!-- 공지사항 등록 모달 -->
    <div id="createPostModal" class="fixed inset-0 bg-black/40 hidden z-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-2xl shadow-[0_8px_24px_rgba(0,0,0,0.08)] w-full max-w-lg border border-[#171717]/[0.08]">
            <div class="px-6 h-14 border-b border-[#171717]/[0.08] flex justify-between items-center">
                <h3 class="text-[15px] font-medium">공지사항 작성</h3>
                <button type="button" onclick="closeModal('createPostModal')" aria-label="닫기" class="focus-ring w-8 h-8 inline-flex items-center justify-center rounded-lg text-[#737373] hover:bg-[#f4f4f5] transition-colors duration-150"><i class="fas fa-times"></i></button>
            </div>
            <div class="p-6">
                <form onsubmit="handleCreatePost(event)">
                    <div class="space-y-4">
                        <div>
                            <label class="block text-[13px] text-[#525252] mb-1.5">제목</label>
                            <input type="text" name="title" required class="focus-ring w-full h-10 px-3 border border-[#171717]/[0.12] rounded-lg text-[14px]">
                        </div>
                        <div>
                            <label class="block text-[13px] text-[#525252] mb-1.5">내용</label>
                            <textarea name="content" required rows="5" class="focus-ring w-full px-3 py-2 border border-[#171717]/[0.12] rounded-lg text-[14px]"></textarea>
                        </div>
                        <label class="inline-flex items-center gap-2 text-[14px] text-[#525252]">
                            <input type="checkbox" name="is_pinned" id="postPinned" class="rounded border-[#171717]/20 text-[#2563eb] focus:ring-[#2563eb]/30 h-4 w-4">
                            상단 고정
                        </label>
                        <div class="flex justify-end gap-2 pt-2">
                            <button type="button" onclick="closeModal('createPostModal')" class="focus-ring h-10 px-4 rounded-lg border border-[#171717]/[0.08] text-[14px] text-[#525252] hover:bg-[#f4f4f5] transition-colors duration-150">취소</button>
                            <button type="submit" class="focus-ring h-10 px-4 rounded-lg bg-[#171717] text-white text-[14px] hover:bg-[#2b2b2b] transition-colors duration-150">등록</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <!-- 일정 상세 모달 -->
    <div id="eventModal" class="fixed inset-0 bg-black/40 hidden z-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-2xl shadow-[0_8px_24px_rgba(0,0,0,0.08)] w-full max-w-md border border-[#171717]/[0.08]">
            <div class="px-6 h-14 border-b border-[#171717]/[0.08] flex justify-between items-center">
                <h3 class="text-[15px] font-medium">일정 상세</h3>
                <button type="button" onclick="closeModal('eventModal')" aria-label="닫기" class="focus-ring w-8 h-8 inline-flex items-center justify-center rounded-lg text-[#737373] hover:bg-[#f4f4f5] transition-colors duration-150"><i class="fas fa-times"></i></button>
            </div>
            <div class="p-6 space-y-4">
                <div>
                    <h4 id="modalEventName" class="text-[16px] font-medium"></h4>
                    <p id="modalTime" class="mt-1 text-[13px] text-[#737373] num"></p>
                </div>
                <div class="rounded-lg bg-[#f4f4f5] p-4 text-[13px] text-[#525252]">
                    <p id="modalDesc" class="whitespace-pre-wrap"></p>
                </div>
                <div class="flex justify-end gap-2 pt-2">
                    <button id="btnViewCourse" type="button" class="focus-ring h-10 px-4 rounded-lg text-[14px] text-[#1d4ed8] hover:bg-[#2563eb]/[0.06] transition-colors duration-150" style="display:none;">바로가기</button>
                    <button type="button" onclick="closeModal('eventModal')" class="focus-ring h-10 px-4 rounded-lg border border-[#171717]/[0.08] text-[14px] text-[#525252] hover:bg-[#f4f4f5] transition-colors duration-150">닫기</button>
                </div>
            </div>
        </div>
    </div>

    <script>
        window.logout = function() {
            if (confirm('로그아웃 하시겠습니까?')) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                location.href = '/login';
            }
        };
    </script>
    <script src="/static/admin-dashboard.js"></script>
</body>
</html>
`;
