/**
 * 사이트 접속통계 페이지 (관리자 전용)
 * - /api/analytics/access-stats (접속 요약, 트렌드, 유입 경로, 기기/OS/브라우저, 키워드, 랜딩페이지)
 * - /api/analytics/referrers (외부 유입 도메인 목록 + 페이지네이션)
 * - /api/analytics/pages (페이지별 접속 현황 + 페이지네이션 & 필터)
 * - /api/analytics/visitors (접속 사용자 목록 + 페이지네이션 & 필터)
 * - /api/analytics/logs (상세 실시간 접속 로그 + 페이지네이션 & 필터)
 */
import { hrdSidebar } from './components/hrd_sidebar';

export const adminAnalyticsHtml = (sidebar = hrdSidebar('analytics')) => `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>사이트 접속 통계 고도화 - 3D쿠키 관리자</title>
    <link rel="stylesheet" href="/static/tailwind-app.css">
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <style>
        .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f1f5f9; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 3px; }
        .tab-active { border-bottom: 3px solid #4f46e5; color: #4f46e5; font-weight: 800; }
        .tab-inactive { color: #64748b; font-weight: 600; border-bottom: 3px solid transparent; }
        .tab-inactive:hover { color: #334155; border-bottom-color: #e2e8f0; }
    </style>
</head>
<body class="bg-slate-50 font-sans text-slate-800 antialiased">
    <div class="flex h-screen overflow-hidden">
        ${sidebar}
        <div class="flex-1 flex flex-col overflow-hidden bg-slate-50">
            <!-- Header -->
            <div class="bg-white border-b border-slate-200 flex-shrink-0 shadow-sm z-10">
                <div class="px-8 py-5">
                    <div class="flex flex-wrap items-center justify-between gap-4">
                        <div>
                            <div class="flex items-center gap-3">
                                <h1 class="text-2xl font-black text-slate-900 tracking-tight">사이트 접속 통계</h1>
                                <span id="scopeBadge" class="px-3 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-700 border border-indigo-200">
                                    <i class="fas fa-user-check mr-1"></i>일반 방문자
                                </span>
                            </div>
                            <p class="text-slate-500 mt-1 text-sm font-medium">실시간 웹사이트 PV·UV, 유입 경로, 사용자 반응 및 접속 로그 분석</p>
                        </div>
                        <div class="flex items-center gap-3">
                            <!-- 스코프 선택 (Public / Bots / All) -->
                            <div class="bg-slate-100 p-1 rounded-xl border border-slate-200 flex text-xs font-bold">
                                <button type="button" onclick="setScope('public')" id="scopeBtn-public" class="px-3 py-1.5 rounded-lg transition-all bg-white text-indigo-600 shadow-sm">사람 방문</button>
                                <button type="button" onclick="setScope('bots')" id="scopeBtn-bots" class="px-3 py-1.5 rounded-lg transition-all text-slate-600 hover:text-slate-900">봇·크롤러</button>
                                <button type="button" onclick="setScope('all')" id="scopeBtn-all" class="px-3 py-1.5 rounded-lg transition-all text-slate-600 hover:text-slate-900">전체 요청</button>
                            </div>

                            <button onclick="refreshCurrentTab()" class="px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-slate-700 font-bold hover:bg-slate-50 hover:text-indigo-600 transition-all shadow-sm flex items-center gap-2 text-sm">
                                <i class="fas fa-sync-alt text-slate-400"></i>
                                <span>새로고침</span>
                            </button>
                        </div>
                    </div>
                </div>

                <!-- 탭 네비게이션 -->
                <div class="px-8 flex space-x-8 border-t border-slate-100 text-sm">
                    <button onclick="switchTab('overview')" id="tabBtn-overview" class="py-3.5 px-1 tab-active transition-all flex items-center gap-2">
                        <i class="fas fa-chart-line text-indigo-500"></i> 접속 개요
                    </button>
                    <button onclick="switchTab('traffic')" id="tabBtn-traffic" class="py-3.5 px-1 tab-inactive transition-all flex items-center gap-2">
                        <i class="fas fa-compass text-teal-500"></i> 유입 경로 분석
                    </button>
                    <button onclick="switchTab('pages')" id="tabBtn-pages" class="py-3.5 px-1 tab-inactive transition-all flex items-center gap-2">
                        <i class="fas fa-file-alt text-sky-500"></i> 페이지별 접속
                    </button>
                    <button onclick="switchTab('visitors')" id="tabBtn-visitors" class="py-3.5 px-1 tab-inactive transition-all flex items-center gap-2">
                        <i class="fas fa-users text-amber-500"></i> 접속 사용자
                    </button>
                    <button onclick="switchTab('logs')" id="tabBtn-logs" class="py-3.5 px-1 tab-inactive transition-all flex items-center gap-2">
                        <i class="fas fa-list-ul text-rose-500"></i> 상세 접속 로그
                    </button>
                </div>
            </div>

            <!-- Main Content Area -->
            <main class="flex-1 overflow-y-auto p-6 custom-scrollbar">
                <div class="max-w-7xl mx-auto space-y-6">

                    <!-- 기간 필터 공통 바 -->
                    <div class="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-4 flex flex-wrap items-center justify-between gap-4">
                        <div class="flex flex-wrap items-center gap-3">
                            <span class="text-xs font-black text-slate-400 uppercase tracking-wider flex items-center gap-1">
                                <i class="far fa-calendar-alt"></i> 조회 기간
                            </span>
                            <div class="flex flex-wrap gap-1.5">
                                <button type="button" onclick="setPeriod('today')" id="periodBtn-today" class="px-3 py-1.5 rounded-xl text-xs font-bold border border-slate-200 text-slate-600 hover:bg-slate-50 transition">오늘</button>
                                <button type="button" onclick="setPeriod('week')" id="periodBtn-week" class="px-3 py-1.5 rounded-xl text-xs font-bold border border-indigo-200 text-indigo-600 bg-indigo-50/50 hover:bg-indigo-50 transition">최근 7일</button>
                                <button type="button" onclick="setPeriod('month30')" id="periodBtn-month30" class="px-3 py-1.5 rounded-xl text-xs font-bold border border-slate-200 text-slate-600 hover:bg-slate-50 transition">최근 30일</button>
                                <button type="button" onclick="setPeriod('monthThis')" id="periodBtn-monthThis" class="px-3 py-1.5 rounded-xl text-xs font-bold border border-slate-200 text-slate-600 hover:bg-slate-50 transition">이번 달</button>
                                <button type="button" onclick="setPeriod('clear')" id="periodBtn-clear" class="px-3 py-1.5 rounded-xl text-xs font-bold border border-slate-200 text-slate-400 hover:bg-slate-50 transition">기간 해제</button>
                            </div>
                        </div>

                        <div class="flex flex-wrap items-center gap-2">
                            <input type="date" id="filterFrom" class="rounded-xl border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                            <span class="text-slate-400 text-xs font-bold">~</span>
                            <input type="date" id="filterTo" class="rounded-xl border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                            <button type="button" onclick="applyDateFilter()" class="px-4 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition shadow-sm">
                                <i class="fas fa-search mr-1"></i>조회
                            </button>
                        </div>
                    </div>

                    <!-- 요약 KPI 카드 (6 Grid) -->
                    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        <div class="bg-white p-4 rounded-2xl shadow-sm border border-slate-200/80">
                            <div class="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">총 페이지뷰(PV)</div>
                            <div class="text-2xl font-black text-slate-900" id="kpi-pv">-</div>
                            <div class="text-[11px] text-slate-400 mt-1" id="kpi-pv-sub">조회 기간 전체</div>
                        </div>
                        <div class="bg-white p-4 rounded-2xl shadow-sm border border-slate-200/80">
                            <div class="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">순 방문자(UV)</div>
                            <div class="text-2xl font-black text-indigo-600" id="kpi-uv">-</div>
                            <div class="text-[11px] text-slate-400 mt-1" id="kpi-uv-sub">고유 IP 기준</div>
                        </div>
                        <div class="bg-white p-4 rounded-2xl shadow-sm border border-slate-200/80">
                            <div class="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">외부 유입</div>
                            <div class="text-2xl font-black text-teal-600" id="kpi-external">-</div>
                            <div class="text-[11px] text-slate-400 mt-1" id="kpi-external-sub">검색·외부 링크</div>
                        </div>
                        <div class="bg-white p-4 rounded-2xl shadow-sm border border-slate-200/80">
                            <div class="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">방문 회원 수</div>
                            <div class="text-2xl font-black text-sky-600" id="kpi-members">-</div>
                            <div class="text-[11px] text-slate-400 mt-1">로그인 사용자</div>
                        </div>
                        <div class="bg-white p-4 rounded-2xl shadow-sm border border-slate-200/80">
                            <div class="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">열람 페이지 종</div>
                            <div class="text-2xl font-black text-slate-800" id="kpi-pages">-</div>
                            <div class="text-[11px] text-slate-400 mt-1">고유 URL 수</div>
                        </div>
                        <div class="bg-white p-4 rounded-2xl shadow-sm border border-slate-200/80">
                            <div class="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">봇·크롤러 감지</div>
                            <div class="text-2xl font-black text-rose-500" id="kpi-bots">-</div>
                            <div class="text-[11px] text-slate-400 mt-1">자동화 수집</div>
                        </div>
                    </div>

                    <!-- TAB 1: 접속 개요 (Overview) -->
                    <div id="tabSection-overview" class="space-y-6">
                        <!-- 일별 추이 차트 -->
                        <div class="bg-white rounded-3xl shadow-sm border border-slate-200/80 p-6">
                            <div class="flex items-center justify-between mb-4">
                                <div>
                                    <h3 class="text-base font-black text-slate-900 tracking-tight">일별 접속 추이 (PV / UV)</h3>
                                    <p class="text-xs text-slate-500 mt-0.5">선택한 날짜 범위 동안 일자별 페이지뷰와 순 방문자 트렌드를 시각화합니다.</p>
                                </div>
                                <span id="trendRangeLabel" class="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-600"></span>
                            </div>
                            <div class="h-72">
                                <canvas id="dailyTrendChart"></canvas>
                            </div>
                        </div>

                        <!-- 시간대별 & 요일별 접속 차트 -->
                        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div class="bg-white rounded-3xl shadow-sm border border-slate-200/80 p-6">
                                <h3 class="text-base font-black text-slate-900 mb-1 tracking-tight">시간대별 접속 분포 (00시~23시)</h3>
                                <p class="text-xs text-slate-500 mb-4">주요 접속이 몰리는 피크 시간대를 파악할 수 있습니다.</p>
                                <div class="h-60">
                                    <canvas id="byHourChart"></canvas>
                                </div>
                            </div>
                            <div class="bg-white rounded-3xl shadow-sm border border-slate-200/80 p-6">
                                <h3 class="text-base font-black text-slate-900 mb-1 tracking-tight">요일별 접속 분포 (일요일~토요일)</h3>
                                <p class="text-xs text-slate-500 mb-4">주중 및 주말의 방문 패턴을 비교합니다.</p>
                                <div class="h-60">
                                    <canvas id="byDayOfWeekChart"></canvas>
                                </div>
                            </div>
                        </div>

                        <!-- 사용자 환경 및 역할 분포 -->
                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <!-- 접속 기기 -->
                            <div class="bg-white rounded-3xl shadow-sm border border-slate-200/80 p-6">
                                <h4 class="text-sm font-black text-slate-900 mb-3 flex items-center justify-between">
                                    <span><i class="fas fa-mobile-alt text-indigo-500 mr-2"></i>접속 기기</span>
                                </h4>
                                <div id="deviceList" class="space-y-3 text-xs">
                                    <div class="text-slate-400">로딩 중...</div>
                                </div>
                            </div>
                            <!-- 브라우저 -->
                            <div class="bg-white rounded-3xl shadow-sm border border-slate-200/80 p-6">
                                <h4 class="text-sm font-black text-slate-900 mb-3 flex items-center justify-between">
                                    <span><i class="fab fa-chrome text-teal-500 mr-2"></i>웹 브라우저</span>
                                </h4>
                                <div id="browserList" class="space-y-3 text-xs">
                                    <div class="text-slate-400">로딩 중...</div>
                                </div>
                            </div>
                            <!-- 운영체제 OS -->
                            <div class="bg-white rounded-3xl shadow-sm border border-slate-200/80 p-6">
                                <h4 class="text-sm font-black text-slate-900 mb-3 flex items-center justify-between">
                                    <span><i class="fas fa-desktop text-sky-500 mr-2"></i>운영체제 (OS)</span>
                                </h4>
                                <div id="osList" class="space-y-3 text-xs">
                                    <div class="text-slate-400">로딩 중...</div>
                                </div>
                            </div>
                            <!-- 사용자 역할 -->
                            <div class="bg-white rounded-3xl shadow-sm border border-slate-200/80 p-6">
                                <h4 class="text-sm font-black text-slate-900 mb-3 flex items-center justify-between">
                                    <span><i class="fas fa-user-shield text-amber-500 mr-2"></i>역할별 접속</span>
                                </h4>
                                <div id="roleList" class="space-y-3 text-xs">
                                    <div class="text-slate-400">로딩 중...</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- TAB 2: 유입 경로 분석 (Traffic Sources) -->
                    <div id="tabSection-traffic" class="space-y-6 hidden">
                        <!-- 유입 채널 카테고리 카드 -->
                        <div class="bg-white rounded-3xl shadow-sm border border-slate-200/80 p-6">
                            <h3 class="text-base font-black text-slate-900 mb-1 tracking-tight">유입 채널 그룹 (Traffic Channels)</h3>
                            <p class="text-xs text-slate-500 mb-4">방문자가 홈페이지에 도달한 주요 통로 구분 (직접, 네이버/구글 검색, AI 검색, SNS, 공공 포털 등)</p>
                            <div id="channelGrid" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                                <div class="text-slate-400 text-xs col-span-full">데이터를 불러오고 있습니다...</div>
                            </div>
                        </div>

                        <!-- 🔍 검색 사이트별 유입 현황 (Search Engines & AI) -->
                        <div class="bg-white rounded-3xl shadow-sm border border-slate-200/80 p-6">
                            <div class="flex flex-wrap items-center justify-between gap-2 mb-1">
                                <div class="flex items-center gap-2">
                                    <span class="w-7 h-7 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black text-xs border border-emerald-200/60">
                                        <i class="fas fa-search"></i>
                                    </span>
                                    <h3 class="text-base font-black text-slate-900 tracking-tight">검색 사이트별 유입 현황 (Search Engines & AI)</h3>
                                </div>
                                <span class="text-xs font-semibold text-slate-400">포털 및 생성형 AI 검색엔진 집계</span>
                            </div>
                            <p class="text-xs text-slate-500 mb-4">네이버, 구글, 다음, Bing 및 ChatGPT·Perplexity 등 AI 검색을 통한 유입 분포입니다. 카드를 클릭하면 하단 리퍼러 목록이 즉시 필터링됩니다.</p>
                            <div id="searchEngineGrid" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                                <div class="text-slate-400 text-xs col-span-full">데이터를 불러오고 있습니다...</div>
                            </div>
                        </div>

                        <!-- 상세 소스 & 검색어 & 랜딩 페이지 Grid -->
                        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <!-- 상세 유입 출처 TOP -->
                            <div class="bg-white rounded-3xl shadow-sm border border-slate-200/80 p-6">
                                <h3 class="text-sm font-black text-slate-900 mb-3 flex items-center justify-between">
                                    <span><i class="fas fa-sitemap text-indigo-500 mr-2"></i>상세 유입 출처 (Sources)</span>
                                </h3>
                                <div id="sourceList" class="space-y-2.5 text-xs">
                                    <div class="text-slate-400">로딩 중...</div>
                                </div>
                            </div>

                            <!-- 유입 검색어 TOP -->
                            <div class="bg-white rounded-3xl shadow-sm border border-slate-200/80 p-6">
                                <h3 class="text-sm font-black text-slate-900 mb-3 flex items-center justify-between">
                                    <span><i class="fas fa-search text-emerald-500 mr-2"></i>유입 검색어 (Keywords TOP)</span>
                                </h3>
                                <div id="keywordList" class="space-y-2 text-xs">
                                    <div class="text-slate-400">로딩 중...</div>
                                </div>
                            </div>

                            <!-- 첫 유입 랜딩 페이지 TOP -->
                            <div class="bg-white rounded-3xl shadow-sm border border-slate-200/80 p-6">
                                <h3 class="text-sm font-black text-slate-900 mb-3 flex items-center justify-between">
                                    <span><i class="fas fa-door-open text-amber-500 mr-2"></i>주요 랜딩 페이지 TOP</span>
                                </h3>
                                <div id="landingList" class="space-y-2 text-xs">
                                    <div class="text-slate-400">로딩 중...</div>
                                </div>
                            </div>
                        </div>

                        <!-- 외부 유입 도메인(Referrers) 목록 (페이지네이션) -->
                        <div class="bg-white rounded-3xl shadow-sm border border-slate-200/80 overflow-hidden" id="referrerSectionAnchor">
                            <div class="px-8 py-6 border-b border-slate-100 space-y-4">
                                <div class="flex flex-wrap items-center justify-between gap-4">
                                    <div>
                                        <h3 class="text-base font-black text-slate-900 tracking-tight">외부 유입 도메인 / 리퍼러 목록 (Referrer Hosts)</h3>
                                        <p class="text-xs text-slate-500 mt-0.5">외부 사이트 및 검색엔진에서 연결된 호스트별 상세 접속 건수 목록입니다.</p>
                                    </div>
                                    <div class="flex items-center gap-3 text-xs">
                                        <span class="text-slate-500 font-medium">보기:</span>
                                        <select id="refSizeSelect" onchange="changeRefPageSize()" class="border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-700">
                                            <option value="10">10개씩</option>
                                            <option value="20" selected>20개씩</option>
                                            <option value="50">50개씩</option>
                                        </select>
                                    </div>
                                </div>

                                <!-- 검색엔진 전용 필터 버튼 그룹 -->
                                <div class="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
                                    <span class="text-xs font-bold text-slate-500 mr-1"><i class="fas fa-filter text-slate-400 mr-1"></i>엔진 필터:</span>
                                    <button type="button" onclick="setReferrerEngine('')" id="refEngineBtn-" class="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-900 text-white shadow-sm transition">전체 외부 유입</button>
                                    <button type="button" onclick="setReferrerEngine('search_all')" id="refEngineBtn-search_all" class="px-3 py-1.5 rounded-xl text-xs font-bold border border-slate-200 text-slate-600 hover:bg-slate-50 transition">🔍 검색 유입 전체</button>
                                    <button type="button" onclick="setReferrerEngine('naver')" id="refEngineBtn-naver" class="px-3 py-1.5 rounded-xl text-xs font-bold border border-emerald-200 text-emerald-700 hover:bg-emerald-50 transition">네이버 (Naver)</button>
                                    <button type="button" onclick="setReferrerEngine('google')" id="refEngineBtn-google" class="px-3 py-1.5 rounded-xl text-xs font-bold border border-blue-200 text-blue-700 hover:bg-blue-50 transition">구글 (Google)</button>
                                    <button type="button" onclick="setReferrerEngine('daum')" id="refEngineBtn-daum" class="px-3 py-1.5 rounded-xl text-xs font-bold border border-amber-200 text-amber-700 hover:bg-amber-50 transition">다음 (Daum)</button>
                                    <button type="button" onclick="setReferrerEngine('bing')" id="refEngineBtn-bing" class="px-3 py-1.5 rounded-xl text-xs font-bold border border-sky-200 text-sky-700 hover:bg-sky-50 transition">Bing</button>
                                    <button type="button" onclick="setReferrerEngine('ai')" id="refEngineBtn-ai" class="px-3 py-1.5 rounded-xl text-xs font-bold border border-purple-200 text-purple-700 hover:bg-purple-50 transition">🤖 AI 검색 (GPT/Perplexity 등)</button>
                                </div>
                            </div>

                            <div class="overflow-x-auto">
                                <table class="w-full text-left border-collapse text-xs">
                                    <thead>
                                        <tr class="bg-slate-50/80 text-slate-400 font-black border-b border-slate-100 uppercase tracking-wider">
                                            <th class="px-6 py-3.5">유입 도메인 (Host)</th>
                                            <th class="px-6 py-3.5">유입 채널</th>
                                            <th class="px-6 py-3.5">대표 리퍼러 URL 샘플</th>
                                            <th class="px-6 py-3.5 text-center">페이지뷰 (PV)</th>
                                            <th class="px-6 py-3.5 text-center">순 방문자 (UV)</th>
                                            <th class="px-6 py-3.5">최근 유입 일시</th>
                                        </tr>
                                    </thead>
                                    <tbody id="referrersTableBody" class="divide-y divide-slate-100">
                                        <tr><td colspan="6" class="px-6 py-8 text-center text-slate-400">데이터를 불러오고 있습니다...</td></tr>
                                    </tbody>
                                </table>
                            </div>

                            <!-- Referrers Pagination Container -->
                            <div class="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4 text-xs" id="refPagination"></div>
                        </div>
                    </div>

                    <!-- TAB 3: 페이지별 접속 (Page Analytics) -->
                    <div id="tabSection-pages" class="space-y-6 hidden">
                        <div class="bg-white rounded-3xl shadow-sm border border-slate-200/80 overflow-hidden">
                            <div class="px-8 py-6 border-b border-slate-100 space-y-4">
                                <div class="flex flex-wrap items-center justify-between gap-4">
                                    <div>
                                        <h3 class="text-base font-black text-slate-900 tracking-tight">페이지별 접속 현황</h3>
                                        <p class="text-xs text-slate-500 mt-0.5">사이트 내 각 URL 경로(Path)별 방문 조회수, 방문자 수 및 외부 유입 수입니다.</p>
                                    </div>
                                    <div class="flex items-center gap-3 text-xs">
                                        <span class="text-slate-500 font-medium">보기:</span>
                                        <select id="pagesSizeSelect" onchange="changePagesPageSize()" class="border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-700">
                                            <option value="10">10개씩</option>
                                            <option value="20" selected>20개씩</option>
                                            <option value="50">50개씩</option>
                                        </select>
                                    </div>
                                </div>

                                <!-- Filter Controls -->
                                <div class="flex flex-wrap items-center gap-3 pt-2">
                                    <div class="relative flex-1 min-w-[240px]">
                                        <i class="fas fa-search absolute left-3.5 top-2.5 text-slate-400 text-xs"></i>
                                        <input type="text" id="pagesSearchInput" onkeyup="if(event.key==='Enter') searchPages()" placeholder="URL 경로 검색 (예: /courses, /admin)..." class="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500">
                                    </div>
                                    <select id="pagesSortSelect" onchange="searchPages()" class="border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                                        <option value="pv">페이지뷰(PV) 높은 순</option>
                                        <option value="uv">순 방문자(UV) 높은 순</option>
                                        <option value="entries">외부 랜딩 유입 순</option>
                                        <option value="recent">최근 방문 순</option>
                                    </select>
                                    <button onclick="searchPages()" class="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition">
                                        검색
                                    </button>
                                </div>
                            </div>

                            <div class="overflow-x-auto">
                                <table class="w-full text-left border-collapse text-xs">
                                    <thead>
                                        <tr class="bg-slate-50/80 text-slate-400 font-black border-b border-slate-100 uppercase tracking-wider">
                                            <th class="px-6 py-3.5">URL 경로 (Path)</th>
                                            <th class="px-6 py-3.5 text-center">페이지뷰 (PV)</th>
                                            <th class="px-6 py-3.5 text-center">순 방문자 (UV)</th>
                                            <th class="px-6 py-3.5 text-center">외부 유입 (Entries)</th>
                                            <th class="px-6 py-3.5">최근 방문 일시</th>
                                        </tr>
                                    </thead>
                                    <tbody id="pagesTableBody" class="divide-y divide-slate-100">
                                        <tr><td colspan="5" class="px-6 py-8 text-center text-slate-400">데이터를 불러오고 있습니다...</td></tr>
                                    </tbody>
                                </table>
                            </div>

                            <!-- Pages Pagination Container -->
                            <div class="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4 text-xs" id="pagesPagination"></div>
                        </div>
                    </div>

                    <!-- TAB 4: 접속 사용자 (Visitors) -->
                    <div id="tabSection-visitors" class="space-y-6 hidden">
                        <div class="bg-white rounded-3xl shadow-sm border border-slate-200/80 overflow-hidden">
                            <div class="px-8 py-6 border-b border-slate-100 space-y-4">
                                <div class="flex flex-wrap items-center justify-between gap-4">
                                    <div>
                                        <h3 class="text-base font-black text-slate-900 tracking-tight">접속 사용자 목록 (Visitors)</h3>
                                        <p class="text-xs text-slate-500 mt-0.5">로그인 회원(회원 ID, 이메일) 및 비로그인 방문자(IP 주소) 단위의 접속 집계입니다.</p>
                                    </div>
                                    <div class="flex items-center gap-3 text-xs">
                                        <span class="text-slate-500 font-medium">보기:</span>
                                        <select id="visitorsSizeSelect" onchange="changeVisitorsPageSize()" class="border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-700">
                                            <option value="10">10개씩</option>
                                            <option value="20" selected>20개씩</option>
                                            <option value="50">50개씩</option>
                                        </select>
                                    </div>
                                </div>

                                <!-- Filter Controls -->
                                <div class="flex flex-wrap items-center gap-3 pt-2">
                                    <select id="visitorsKindSelect" onchange="searchVisitors()" class="border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-700">
                                        <option value="all">전체 (회원 + IP)</option>
                                        <option value="member">회원만 (로그인)</option>
                                        <option value="guest">비로그인만 (IP)</option>
                                    </select>

                                    <div class="relative flex-1 min-w-[240px]">
                                        <i class="fas fa-search absolute left-3.5 top-2.5 text-slate-400 text-xs"></i>
                                        <input type="text" id="visitorsSearchInput" onkeyup="if(event.key==='Enter') searchVisitors()" placeholder="이메일, 이름, IP 주소 검색..." class="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500">
                                    </div>

                                    <select id="visitorsSortSelect" onchange="searchVisitors()" class="border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-700">
                                        <option value="pv">페이지뷰 높은 순</option>
                                        <option value="recent">최근 접속 순</option>
                                    </select>

                                    <button onclick="searchVisitors()" class="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition">
                                        검색
                                    </button>
                                </div>
                            </div>

                            <div class="overflow-x-auto">
                                <table class="w-full text-left border-collapse text-xs">
                                    <thead>
                                        <tr class="bg-slate-50/80 text-slate-400 font-black border-b border-slate-100 uppercase tracking-wider">
                                            <th class="px-6 py-3.5">구분</th>
                                            <th class="px-6 py-3.5">식별자 (이메일 / IP)</th>
                                            <th class="px-6 py-3.5 text-center">역할</th>
                                            <th class="px-6 py-3.5">기기 / 브라우저 / OS</th>
                                            <th class="px-6 py-3.5 text-center">페이지뷰 (PV)</th>
                                            <th class="px-6 py-3.5 text-center">본 페이지 수</th>
                                            <th class="px-6 py-3.5">마지막 접속 시각</th>
                                        </tr>
                                    </thead>
                                    <tbody id="visitorsTableBody" class="divide-y divide-slate-100">
                                        <tr><td colspan="7" class="px-6 py-8 text-center text-slate-400">데이터를 불러오고 있습니다...</td></tr>
                                    </tbody>
                                </table>
                            </div>

                            <!-- Visitors Pagination Container -->
                            <div class="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4 text-xs" id="visitorsPagination"></div>
                        </div>
                    </div>

                    <!-- TAB 5: 상세 접속 로그 (Access Logs) -->
                    <div id="tabSection-logs" class="space-y-6 hidden">
                        <div class="bg-white rounded-3xl shadow-sm border border-slate-200/80 overflow-hidden">
                            <div class="px-8 py-6 border-b border-slate-100 space-y-4">
                                <div class="flex flex-wrap items-center justify-between gap-4">
                                    <div>
                                        <h3 class="text-base font-black text-slate-900 tracking-tight">상세 실시간 접속 로그 (Raw Access Logs)</h3>
                                        <p class="text-xs text-slate-500 mt-0.5">웹 요청 개별 건 단위의 시각, HTTP 메서드, 응답 상태, URL, 리퍼러 및 사용자 정보입니다.</p>
                                    </div>
                                    <div class="flex items-center gap-3 text-xs">
                                        <span class="text-slate-500 font-medium">보기:</span>
                                        <select id="logsSizeSelect" onchange="changeLogsPageSize()" class="border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-700">
                                            <option value="10">10개씩</option>
                                            <option value="20" selected>20개씩</option>
                                            <option value="50">50개씩</option>
                                            <option value="100">100개씩</option>
                                        </select>
                                    </div>
                                </div>

                                <!-- Logs Filter Bar -->
                                <div class="flex flex-wrap items-center gap-3 pt-2">
                                    <select id="logsKindSelect" onchange="searchLogs()" class="border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-700">
                                        <option value="all">전체 사용자</option>
                                        <option value="member">로그인 회원만</option>
                                        <option value="guest">비로그인만</option>
                                    </select>

                                    <select id="logsDeviceSelect" onchange="searchLogs()" class="border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-700">
                                        <option value="">전체 기기</option>
                                        <option value="PC">PC</option>
                                        <option value="모바일">모바일</option>
                                        <option value="태블릿">태블릿</option>
                                        <option value="봇">봇</option>
                                    </select>

                                    <div class="relative flex-1 min-w-[200px]">
                                        <i class="fas fa-search absolute left-3.5 top-2.5 text-slate-400 text-xs"></i>
                                        <input type="text" id="logsSearchInput" onkeyup="if(event.key==='Enter') searchLogs()" placeholder="방문 경로(URL) 검색..." class="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500">
                                    </div>

                                    <button onclick="searchLogs()" class="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition">
                                        필터 적용
                                    </button>
                                </div>
                            </div>

                            <div class="overflow-x-auto">
                                <table class="w-full text-left border-collapse text-xs">
                                    <thead>
                                        <tr class="bg-slate-50/80 text-slate-400 font-black border-b border-slate-100 uppercase tracking-wider">
                                            <th class="px-4 py-3.5">접속 시각 (KST)</th>
                                            <th class="px-4 py-3.5 text-center">상태</th>
                                            <th class="px-4 py-3.5">방문 URL 경로</th>
                                            <th class="px-4 py-3.5">유입 채널 / 출처</th>
                                            <th class="px-4 py-3.5">유입 리퍼러 (Referrer)</th>
                                            <th class="px-4 py-3.5">사용자 / IP</th>
                                            <th class="px-4 py-3.5">기기/브라우저</th>
                                        </tr>
                                    </thead>
                                    <tbody id="logsTableBody" class="divide-y divide-slate-100 font-mono text-[11px]">
                                        <tr><td colspan="7" class="px-6 py-8 text-center text-slate-400 font-sans">데이터를 불러오고 있습니다...</td></tr>
                                    </tbody>
                                </table>
                            </div>

                            <!-- Logs Pagination Container -->
                            <div class="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4 text-xs" id="logsPagination"></div>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    </div>

    <!-- Frontend Script Logic -->
    <script>
        const token = localStorage.getItem('token');

        // Global State
        const state = {
            scope: 'public',
            from: '',
            to: '',
            activeTab: 'overview',
            pages: { page: 1, size: 20, q: '', sort: 'pv' },
            referrers: { page: 1, size: 20, engine: '' },
            visitors: { page: 1, size: 20, kind: 'all', q: '', sort: 'pv' },
            logs: { page: 1, size: 20, device: '', source: '', kind: 'all', q: '' }
        };

        // Charts Instances
        let dailyTrendChartInst = null;
        let byHourChartInst = null;
        let byDayOfWeekChartInst = null;

        // Utilities
        function ymd(d) {
            const y = d.getFullYear();
            const m = String(d.getMonth() + 1).padStart(2, '0');
            const day = String(d.getDate()).padStart(2, '0');
            return y + '-' + m + '-' + day;
        }

        function escapeHtml(s) {
            if (s == null) return '';
            return String(s)
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#039;');
        }

        // Scope Switcher
        function setScope(scope) {
            state.scope = scope;
            ['public', 'bots', 'all'].forEach(function(s) {
                const btn = document.getElementById('scopeBtn-' + s);
                if (s === scope) {
                    btn.className = 'px-3 py-1.5 rounded-lg transition-all bg-white text-indigo-600 shadow-sm font-extrabold';
                } else {
                    btn.className = 'px-3 py-1.5 rounded-lg transition-all text-slate-600 hover:text-slate-900';
                }
            });

            const badge = document.getElementById('scopeBadge');
            if (scope === 'public') {
                badge.className = 'px-3 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-700 border border-indigo-200';
                badge.innerHTML = '<i class="fas fa-user-check mr-1"></i>일반 방문자';
            } else if (scope === 'bots') {
                badge.className = 'px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-700 border border-rose-200';
                badge.innerHTML = '<i class="fas fa-robot mr-1"></i>봇·크롤러';
            } else {
                badge.className = 'px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-300';
                badge.innerHTML = '<i class="fas fa-globe mr-1"></i>전체 요청';
            }

            refreshCurrentTab();
        }

        // Quick Period Buttons
        function setPeriod(p) {
            const today = new Date();
            const fromEl = document.getElementById('filterFrom');
            const toEl = document.getElementById('filterTo');

            ['today', 'week', 'month30', 'monthThis', 'clear'].forEach(function(key) {
                const btn = document.getElementById('periodBtn-' + key);
                if (!btn) return;
                if (key === p) {
                    btn.className = 'px-3 py-1.5 rounded-xl text-xs font-bold border border-indigo-200 text-indigo-600 bg-indigo-50/80 transition';
                } else {
                    btn.className = 'px-3 py-1.5 rounded-xl text-xs font-bold border border-slate-200 text-slate-600 hover:bg-slate-50 transition';
                }
            });

            if (p === 'today') {
                fromEl.value = toEl.value = ymd(today);
            } else if (p === 'week') {
                const from = new Date(today);
                from.setDate(from.getDate() - 6);
                fromEl.value = ymd(from);
                toEl.value = ymd(today);
            } else if (p === 'month30') {
                const from = new Date(today);
                from.setDate(from.getDate() - 29);
                fromEl.value = ymd(from);
                toEl.value = ymd(today);
            } else if (p === 'monthThis') {
                const from = new Date(today.getFullYear(), today.getMonth(), 1);
                fromEl.value = ymd(from);
                toEl.value = ymd(today);
            } else {
                fromEl.value = toEl.value = '';
            }

            state.from = fromEl.value;
            state.to = toEl.value;
            refreshCurrentTab();
        }

        function applyDateFilter() {
            state.from = document.getElementById('filterFrom').value;
            state.to = document.getElementById('filterTo').value;
            refreshCurrentTab();
        }

        // Tab Switching
        function switchTab(tabId) {
            state.activeTab = tabId;
            ['overview', 'traffic', 'pages', 'visitors', 'logs'].forEach(function(t) {
                const btn = document.getElementById('tabBtn-' + t);
                const section = document.getElementById('tabSection-' + t);
                if (t === tabId) {
                    btn.className = 'py-3.5 px-1 tab-active transition-all flex items-center gap-2';
                    section.classList.remove('hidden');
                } else {
                    btn.className = 'py-3.5 px-1 tab-inactive transition-all flex items-center gap-2';
                    section.classList.add('hidden');
                }
            });

            refreshCurrentTab();
        }

        async function refreshCurrentTab() {
            if (state.activeTab === 'overview') {
                await loadOverviewData();
            } else if (state.activeTab === 'traffic') {
                await loadTrafficData();
            } else if (state.activeTab === 'pages') {
                await fetchAccessStats();
                await loadPagesData();
            } else if (state.activeTab === 'visitors') {
                await fetchAccessStats();
                await loadVisitorsData();
            } else if (state.activeTab === 'logs') {
                await fetchAccessStats();
                await loadLogsData();
            }
        }

        document.addEventListener('DOMContentLoaded', function() {
            setPeriod('week');
        });

        // -------------------------------------------------------------------
        // API 1: KPI 요약 & 통계 데이터 조회 (단일 원자적 fetch로 동기화 보장)
        // -------------------------------------------------------------------
        async function fetchAccessStats() {
            try {
                let url = '/api/analytics/access-stats?scope=' + state.scope;
                if (state.from && state.to) {
                    url += '&from=' + encodeURIComponent(state.from) + '&to=' + encodeURIComponent(state.to);
                }
                const res = await fetch(url, { headers: { 'Authorization': 'Bearer ' + token } });
                if (res.status === 401) {
                    location.replace('/login?redirect=' + encodeURIComponent(location.pathname));
                    return null;
                }
                const result = await res.json();
                if (!result.success) return null;
                const d = result.data;

                // KPI 요약 카드 즉시 동기화
                const totalPv = d.totals && d.totals.pv != null ? d.totals.pv : 0;
                const totalUv = d.totals && d.totals.uv != null ? d.totals.uv : 0;
                const externalIn = d.totals && d.totals.externalIn != null ? d.totals.externalIn : 0;
                const members = d.totals && d.totals.members != null ? d.totals.members : 0;
                const pages = d.totals && d.totals.pages != null ? d.totals.pages : 0;
                const bots = d.totals && d.totals.bots != null ? d.totals.bots : 0;

                document.getElementById('kpi-pv').textContent = totalPv.toLocaleString();
                document.getElementById('kpi-uv').textContent = totalUv.toLocaleString();
                document.getElementById('kpi-external').textContent = externalIn.toLocaleString();
                document.getElementById('kpi-members').textContent = members.toLocaleString();
                document.getElementById('kpi-pages').textContent = pages.toLocaleString();
                document.getElementById('kpi-bots').textContent = bots.toLocaleString();

                const extPct = totalPv > 0 ? Math.round((externalIn / totalPv) * 100) : 0;
                document.getElementById('kpi-external-sub').textContent = '전체 PV의 ' + extPct + '%';

                window._lastAccessStats = d;
                return d;
            } catch (e) {
                console.error('fetchAccessStats error:', e);
                return null;
            }
        }

        async function loadOverviewData() {
            const d = await fetchAccessStats();
            if (!d) return;

            document.getElementById('trendRangeLabel').textContent = d.range ? (d.range.from + ' ~ ' + d.range.to) : '';

            // 일별 추이 차트 (막대 Bar 차트로 선명하게 일별 PV / UV 비교)
            const dailyTrend = d.dailyTrend || [];
            const labels = dailyTrend.map(function(t) { return (t.date || '').substring(5); });
            if (dailyTrendChartInst) dailyTrendChartInst.destroy();
            dailyTrendChartInst = new Chart(document.getElementById('dailyTrendChart').getContext('2d'), {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [
                        { label: '페이지뷰 (PV)', data: dailyTrend.map(function(t) { return t.pv || 0; }), backgroundColor: 'rgba(99, 102, 241, 0.75)', borderColor: '#4f46e5', borderWidth: 1, borderRadius: 6 },
                        { label: '순 방문자 (UV)', data: dailyTrend.map(function(t) { return t.uv || 0; }), backgroundColor: 'rgba(16, 185, 129, 0.75)', borderColor: '#10b981', borderWidth: 1, borderRadius: 6 }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { position: 'top' },
                        tooltip: {
                            callbacks: {
                                title: function(context) {
                                    const idx = context[0].dataIndex;
                                    return dailyTrend[idx] ? dailyTrend[idx].date : context[0].label;
                                }
                            }
                        }
                    },
                    scales: {
                        y: { beginAtZero: true, ticks: { precision: 0 } },
                        x: { grid: { display: false } }
                    }
                }
            });

            // 시간대별 차트
            const byHour = d.byHour || [];
            const hourLabels = Array.from({ length: 24 }, function(_, i) { return i + '시'; });
            const hourData = hourLabels.map(function(_, i) { return byHour[i] || 0; });
            if (byHourChartInst) byHourChartInst.destroy();
            byHourChartInst = new Chart(document.getElementById('byHourChart').getContext('2d'), {
                type: 'bar',
                data: {
                    labels: hourLabels,
                    datasets: [{ label: '접속 수', data: hourData, backgroundColor: 'rgba(99, 102, 241, 0.65)', borderRadius: 4 }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: { y: { beginAtZero: true, ticks: { precision: 0 } }, x: { grid: { display: false } } }
                }
            });

            // 요일별 차트
            const dowNames = ['일', '월', '화', '수', '목', '금', '토'];
            const byDow = d.byDayOfWeek || [];
            const dowData = dowNames.map(function(_, i) { return byDow[i] || 0; });
            if (byDayOfWeekChartInst) byDayOfWeekChartInst.destroy();
            byDayOfWeekChartInst = new Chart(document.getElementById('byDayOfWeekChart').getContext('2d'), {
                type: 'bar',
                data: {
                    labels: dowNames,
                    datasets: [{ label: '접속 수', data: dowData, backgroundColor: 'rgba(20, 184, 166, 0.65)', borderRadius: 4 }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: { y: { beginAtZero: true, ticks: { precision: 0 } }, x: { grid: { display: false } } }
                }
            });

            // List Render Helper
            function renderProgressList(containerId, items, colorClass) {
                if (!colorClass) colorClass = 'bg-indigo-500';
                const el = document.getElementById(containerId);
                if (!items || !items.length) {
                    el.innerHTML = '<div class="text-slate-400">데이터가 없습니다.</div>';
                    return;
                }
                const max = Math.max.apply(Math, items.map(function(i) { return i.pv || i.count || 0; })) || 1;
                el.innerHTML = items.map(function(item) {
                    const label = item.label || item.role || '기타';
                    const val = item.pv || item.count || 0;
                    const pct = Math.round((val / max) * 100);
                    return '<div>' +
                        '<div class="flex justify-between font-medium text-slate-700 mb-1">' +
                            '<span>' + escapeHtml(label === 'guest' ? '비로그인' : label) + '</span>' +
                            '<span class="font-bold text-slate-900">' + val.toLocaleString() + '건</span>' +
                        '</div>' +
                        '<div class="w-full bg-slate-100 rounded-full h-1.5">' +
                            '<div class="' + colorClass + ' h-1.5 rounded-full" style="width: ' + pct + '%"></div>' +
                        '</div>' +
                    '</div>';
                }).join('');
            }

            renderProgressList('deviceList', d.devices, 'bg-indigo-600');
            renderProgressList('browserList', d.browsers, 'bg-teal-500');
            renderProgressList('osList', d.os, 'bg-sky-500');
            renderProgressList('roleList', d.byRole, 'bg-amber-500');
        }

        // -------------------------------------------------------------------
        // API 2: 유입 경로 분석 (Traffic Sources & Referrers)
        // -------------------------------------------------------------------
        async function loadTrafficData() {
            const d = await fetchAccessStats();
            if (d) {
                // 채널 카테고리 그리드
                const channels = d.channels || [];
                const channelGrid = document.getElementById('channelGrid');
                if (channels.length === 0) {
                    channelGrid.innerHTML = '<div class="text-slate-400 text-xs">집계된 채널 데이터가 없습니다.</div>';
                } else {
                    const totalPv = (d.totals && d.totals.pv) || 1;
                    channelGrid.innerHTML = channels.map(function(c) {
                        const pct = Math.round((c.pv / totalPv) * 100);
                        return '<div class="bg-slate-50 border border-slate-200/60 p-3.5 rounded-2xl">' +
                            '<div class="text-xs font-bold text-slate-500 mb-1">' + escapeHtml(c.label) + '</div>' +
                            '<div class="text-xl font-black text-slate-900">' + c.pv.toLocaleString() + '<span class="text-xs text-slate-400 font-normal ml-1">PV</span></div>' +
                            '<div class="text-[11px] text-indigo-600 font-bold mt-1">' + pct + '% 비중 (' + c.uv.toLocaleString() + ' UV)</div>' +
                        '</div>';
                    }).join('');
                }

                // 🔍 검색 사이트별 유입 현황 그리드 (Search Engines & AI)
                const searchEngines = d.searchEngines || [];
                const searchGrid = document.getElementById('searchEngineGrid');
                if (searchEngines.length === 0) {
                    searchGrid.innerHTML = '<div class="text-slate-400 text-xs col-span-full">집계된 검색 사이트 유입 데이터가 없습니다.</div>';
                } else {
                    const totalSearchPv = searchEngines.reduce(function(acc, cur) { return acc + (cur.pv || 0); }, 0) || 1;
                    const engineMeta = {
                        '네이버': { key: 'naver', icon: 'N', bg: 'bg-emerald-50/70', text: 'text-emerald-700', border: 'border-emerald-200' },
                        '구글': { key: 'google', icon: 'G', bg: 'bg-blue-50/70', text: 'text-blue-700', border: 'border-blue-200' },
                        '다음': { key: 'daum', icon: 'D', bg: 'bg-amber-50/70', text: 'text-amber-700', border: 'border-amber-200' },
                        'Bing': { key: 'bing', icon: 'B', bg: 'bg-sky-50/70', text: 'text-sky-700', border: 'border-sky-200' },
                        'ChatGPT': { key: 'ai', icon: 'GPT', bg: 'bg-purple-50/70', text: 'text-purple-700', border: 'border-purple-200' },
                        'Perplexity': { key: 'ai', icon: 'PX', bg: 'bg-purple-50/70', text: 'text-purple-700', border: 'border-purple-200' },
                        'Claude': { key: 'ai', icon: 'CL', bg: 'bg-purple-50/70', text: 'text-purple-700', border: 'border-purple-200' },
                        'Gemini': { key: 'ai', icon: 'GM', bg: 'bg-purple-50/70', text: 'text-purple-700', border: 'border-purple-200' },
                        'Copilot': { key: 'ai', icon: 'CP', bg: 'bg-purple-50/70', text: 'text-purple-700', border: 'border-purple-200' },
                        '줌(Zum)': { key: 'search_all', icon: 'Z', bg: 'bg-cyan-50/70', text: 'text-cyan-700', border: 'border-cyan-200' },
                        '야후': { key: 'search_all', icon: 'Y', bg: 'bg-rose-50/70', text: 'text-rose-700', border: 'border-rose-200' }
                    };

                    searchGrid.innerHTML = searchEngines.map(function(s) {
                        const meta = engineMeta[s.label] || { key: 'search_all', icon: '🔍', bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-200' };
                        const pct = Math.round((s.pv / totalSearchPv) * 100);
                        return '<div onclick="filterBySearchEngineCard(\'' + meta.key + '\')" class="cursor-pointer group hover:border-indigo-500 hover:shadow-md transition-all ' + meta.bg + ' border ' + meta.border + ' p-3.5 rounded-2xl flex flex-col justify-between">' +
                            '<div>' +
                                '<div class="flex items-center justify-between mb-2">' +
                                    '<span class="font-extrabold text-xs ' + meta.text + '">' + escapeHtml(s.label) + '</span>' +
                                    '<span class="w-6 h-5 rounded-md bg-white font-black text-[10px] ' + meta.text + ' flex items-center justify-center shadow-xs border border-slate-100">' + meta.icon + '</span>' +
                                '</div>' +
                                '<div class="text-xl font-black text-slate-900">' + s.pv.toLocaleString() + '<span class="text-xs text-slate-400 font-normal ml-1">PV</span></div>' +
                                '<div class="text-[11px] font-bold ' + meta.text + ' mt-0.5">' + pct + '% 비중 (' + s.uv.toLocaleString() + ' UV)</div>' +
                            '</div>' +
                            '<div class="mt-3 pt-2 border-t border-slate-200/50 text-[10px] text-slate-500 group-hover:text-indigo-600 font-bold flex items-center justify-between transition">' +
                                '<span>리퍼러 필터</span>' +
                                '<i class="fas fa-arrow-down text-[9px] group-hover:translate-y-0.5 transition-transform"></i>' +
                            '</div>' +
                        '</div>';
                    }).join('');
                }

                // 상세 유입 소스
                const sources = (d.sources || []).slice(0, 10);
                const sourceList = document.getElementById('sourceList');
                if (sources.length === 0) {
                    sourceList.innerHTML = '<div class="text-slate-400">데이터 없음</div>';
                } else {
                    sourceList.innerHTML = sources.map(function(s, i) {
                        return '<div class="flex items-center justify-between py-1 border-b border-slate-100 last:border-0">' +
                            '<span class="truncate pr-2"><span class="font-bold text-slate-400 mr-2">' + (i+1) + '.</span>' + escapeHtml(s.label) + '</span>' +
                            '<span class="font-extrabold text-indigo-600">' + s.pv.toLocaleString() + '</span>' +
                        '</div>';
                    }).join('');
                }

                // 유입 검색어 TOP
                const keywords = (d.keywords || []).slice(0, 10);
                const keywordList = document.getElementById('keywordList');
                if (keywords.length === 0) {
                    keywordList.innerHTML = '<div class="text-slate-400">검색어 유입 데이터 없음</div>';
                } else {
                    keywordList.innerHTML = keywords.map(function(k, i) {
                        return '<div class="flex items-center justify-between py-1 border-b border-slate-100 last:border-0">' +
                            '<span class="truncate pr-2"><span class="font-bold text-slate-400 mr-2">' + (i+1) + '.</span>"' + escapeHtml(k.keyword) + '"</span>' +
                            '<span class="font-extrabold text-emerald-600">' + k.count.toLocaleString() + '회</span>' +
                        '</div>';
                    }).join('');
                }

                // 랜딩 페이지 TOP
                const landing = (d.landingPages || []).slice(0, 10);
                const landingList = document.getElementById('landingList');
                if (landing.length === 0) {
                    landingList.innerHTML = '<div class="text-slate-400">데이터 없음</div>';
                } else {
                    landingList.innerHTML = landing.map(function(l, i) {
                        return '<div class="flex items-center justify-between py-1 border-b border-slate-100 last:border-0">' +
                            '<span class="truncate pr-2 font-mono text-[11px]" title="' + escapeHtml(l.path) + '"><span class="font-bold text-slate-400 font-sans mr-2">' + (i+1) + '.</span>' + escapeHtml(l.path) + '</span>' +
                            '<span class="font-extrabold text-amber-600">' + l.pv.toLocaleString() + '</span>' +
                        '</div>';
                    }).join('');
                }
            }

            fetchReferrersList();
        }

        async function fetchReferrersList() {
            const tbody = document.getElementById('referrersTableBody');
            try {
                let url = '/api/analytics/referrers?scope=' + state.scope + '&page=' + state.referrers.page + '&size=' + state.referrers.size;
                if (state.referrers.engine) {
                    url += '&engine=' + encodeURIComponent(state.referrers.engine);
                }
                if (state.from && state.to) {
                    url += '&from=' + encodeURIComponent(state.from) + '&to=' + encodeURIComponent(state.to);
                }

                const res = await fetch(url, { headers: { 'Authorization': 'Bearer ' + token } });
                const result = await res.json();
                if (!result.success) {
                    tbody.innerHTML = '<tr><td colspan="6" class="px-6 py-8 text-center text-slate-400">데이터를 불러오지 못했습니다.</td></tr>';
                    return;
                }

                const data = result.data;
                const rows = data.rows || [];

                if (rows.length === 0) {
                    tbody.innerHTML = '<tr><td colspan="6" class="px-6 py-8 text-center text-slate-400">선택한 조건의 외부 유입 도메인 데이터가 없습니다.</td></tr>';
                } else {
                    tbody.innerHTML = rows.map(function(r) {
                        return '<tr class="hover:bg-slate-50 transition">' +
                            '<td class="px-6 py-3.5 font-bold text-slate-900">' + escapeHtml(r.host) + '</td>' +
                            '<td class="px-6 py-3.5"><span class="px-2.5 py-1 rounded-lg bg-teal-50 text-teal-700 font-bold text-[11px] border border-teal-200">' + escapeHtml(r.channel) + '</span></td>' +
                            '<td class="px-6 py-3.5 text-slate-500 font-mono text-[11px] truncate max-w-xs" title="' + escapeHtml(r.sample) + '">' + escapeHtml(r.sample || '-') + '</td>' +
                            '<td class="px-6 py-3.5 text-center font-black text-indigo-600">' + r.pv.toLocaleString() + '</td>' +
                            '<td class="px-6 py-3.5 text-center font-bold text-slate-700">' + r.uv.toLocaleString() + '</td>' +
                            '<td class="px-6 py-3.5 text-slate-400 font-mono text-[11px]">' + escapeHtml(r.lastVisit || '-') + '</td>' +
                        '</tr>';
                    }).join('');
                }

                renderPagination('refPagination', data, function(newPage) {
                    state.referrers.page = newPage;
                    fetchReferrersList();
                });
            } catch (e) {
                console.error('fetchReferrersList error:', e);
                tbody.innerHTML = '<tr><td colspan="6" class="px-6 py-8 text-center text-rose-500">데이터 로드 실패</td></tr>';
            }
        }

        function changeRefPageSize() {
            state.referrers.size = parseInt(document.getElementById('refSizeSelect').value, 10) || 20;
            state.referrers.page = 1;
            fetchReferrersList();
        }

        function setReferrerEngine(engine) {
            state.referrers.engine = engine || '';
            state.referrers.page = 1;

            ['', 'search_all', 'naver', 'google', 'daum', 'bing', 'ai'].forEach(function(key) {
                const btn = document.getElementById('refEngineBtn-' + key);
                if (!btn) return;
                if (key === state.referrers.engine) {
                    btn.className = 'px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-900 text-white shadow-sm transition';
                } else {
                    let defaultColor = 'border border-slate-200 text-slate-600 hover:bg-slate-50';
                    if (key === 'naver') defaultColor = 'border border-emerald-200 text-emerald-700 hover:bg-emerald-50';
                    else if (key === 'google') defaultColor = 'border border-blue-200 text-blue-700 hover:bg-blue-50';
                    else if (key === 'daum') defaultColor = 'border border-amber-200 text-amber-700 hover:bg-amber-50';
                    else if (key === 'bing') defaultColor = 'border border-sky-200 text-sky-700 hover:bg-sky-50';
                    else if (key === 'ai') defaultColor = 'border border-purple-200 text-purple-700 hover:bg-purple-50';
                    btn.className = 'px-3 py-1.5 rounded-xl text-xs font-bold ' + defaultColor + ' transition';
                }
            });

            fetchReferrersList();
        }

        function filterBySearchEngineCard(engineKey) {
            setReferrerEngine(engineKey);
            const anchor = document.getElementById('referrerSectionAnchor');
            if (anchor) {
                anchor.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }

        // -------------------------------------------------------------------
        // API 3: 페이지별 접속 (Pages Analytics)
        // -------------------------------------------------------------------
        async function loadPagesData() {
            const tbody = document.getElementById('pagesTableBody');
            try {
                let url = '/api/analytics/pages?scope=' + state.scope + '&page=' + state.pages.page + '&size=' + state.pages.size + '&sort=' + state.pages.sort;
                if (state.pages.q) url += '&q=' + encodeURIComponent(state.pages.q);
                if (state.from && state.to) {
                    url += '&from=' + encodeURIComponent(state.from) + '&to=' + encodeURIComponent(state.to);
                }

                const res = await fetch(url, { headers: { 'Authorization': 'Bearer ' + token } });
                const result = await res.json();
                if (!result.success) {
                    tbody.innerHTML = '<tr><td colspan="5" class="px-6 py-8 text-center text-slate-400">데이터를 불러오지 못했습니다.</td></tr>';
                    return;
                }

                const data = result.data;
                const rows = data.rows || [];

                if (rows.length === 0) {
                    tbody.innerHTML = '<tr><td colspan="5" class="px-6 py-8 text-center text-slate-400">검색 조건에 해당되는 페이지가 없습니다.</td></tr>';
                } else {
                    tbody.innerHTML = rows.map(function(r) {
                        return '<tr class="hover:bg-slate-50 transition">' +
                            '<td class="px-6 py-3.5 font-mono font-medium text-slate-800 truncate max-w-md" title="' + escapeHtml(r.path) + '">' +
                                '<a href="' + escapeHtml(r.path) + '" target="_blank" class="hover:text-indigo-600 hover:underline flex items-center gap-1.5">' +
                                    '<span>' + escapeHtml(r.path) + '</span>' +
                                    '<i class="fas fa-external-link-alt text-[10px] text-slate-400"></i>' +
                                '</a>' +
                            '</td>' +
                            '<td class="px-6 py-3.5 text-center font-black text-indigo-600">' + r.pv.toLocaleString() + '</td>' +
                            '<td class="px-6 py-3.5 text-center font-bold text-slate-700">' + r.uv.toLocaleString() + '</td>' +
                            '<td class="px-6 py-3.5 text-center font-bold text-teal-600">' + (r.entries || 0).toLocaleString() + '</td>' +
                            '<td class="px-6 py-3.5 text-slate-400 font-mono text-[11px]">' + escapeHtml(r.lastVisit || '-') + '</td>' +
                        '</tr>';
                    }).join('');
                }

                renderPagination('pagesPagination', data, function(newPage) {
                    state.pages.page = newPage;
                    loadPagesData();
                });
            } catch (e) {
                console.error('loadPagesData error:', e);
                tbody.innerHTML = '<tr><td colspan="5" class="px-6 py-8 text-center text-rose-500">데이터 로드 실패</td></tr>';
            }
        }

        function searchPages() {
            state.pages.q = document.getElementById('pagesSearchInput').value.trim();
            state.pages.sort = document.getElementById('pagesSortSelect').value;
            state.pages.page = 1;
            loadPagesData();
        }

        function changePagesPageSize() {
            state.pages.size = parseInt(document.getElementById('pagesSizeSelect').value, 10) || 20;
            state.pages.page = 1;
            loadPagesData();
        }

        // -------------------------------------------------------------------
        // API 4: 접속 사용자 (Visitors)
        // -------------------------------------------------------------------
        async function loadVisitorsData() {
            const tbody = document.getElementById('visitorsTableBody');
            try {
                let url = '/api/analytics/visitors?scope=' + state.scope + '&page=' + state.visitors.page + '&size=' + state.visitors.size + '&kind=' + state.visitors.kind + '&sort=' + state.visitors.sort;
                if (state.visitors.q) url += '&q=' + encodeURIComponent(state.visitors.q);
                if (state.from && state.to) {
                    url += '&from=' + encodeURIComponent(state.from) + '&to=' + encodeURIComponent(state.to);
                }

                const res = await fetch(url, { headers: { 'Authorization': 'Bearer ' + token } });
                const result = await res.json();
                if (!result.success) {
                    tbody.innerHTML = '<tr><td colspan="7" class="px-6 py-8 text-center text-slate-400">데이터를 불러오지 못했습니다.</td></tr>';
                    return;
                }

                const data = result.data;
                const rows = data.rows || [];

                if (rows.length === 0) {
                    tbody.innerHTML = '<tr><td colspan="7" class="px-6 py-8 text-center text-slate-400">접속 사용자 데이터가 없습니다.</td></tr>';
                } else {
                    tbody.innerHTML = rows.map(function(v) {
                        const isMember = v.userId != null;
                        const kindBadge = isMember
                            ? '<span class="px-2.5 py-1 rounded-lg bg-indigo-100 text-indigo-700 font-bold text-[11px]">로그인</span>'
                            : '<span class="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 font-bold text-[11px]">비로그인</span>';
                        
                        const who = isMember
                            ? (v.name ? (escapeHtml(v.name) + ' (' + escapeHtml(v.email) + ')') : escapeHtml(v.email || ('회원#' + v.userId)))
                            : escapeHtml(v.ip || '-');

                        const envStr = [v.device, v.browser, v.os].filter(Boolean).join(' / ') || '-';

                        return '<tr class="hover:bg-slate-50 transition">' +
                            '<td class="px-6 py-3.5">' + kindBadge + '</td>' +
                            '<td class="px-6 py-3.5 font-bold text-slate-900">' + who + '</td>' +
                            '<td class="px-6 py-3.5 text-center text-slate-600 font-medium">' + escapeHtml(v.role === 'guest' ? '비로그인' : (v.role || '-')) + '</td>' +
                            '<td class="px-6 py-3.5 text-slate-500 font-medium text-[11px]">' + escapeHtml(envStr) + '</td>' +
                            '<td class="px-6 py-3.5 text-center font-black text-indigo-600">' + v.pv.toLocaleString() + '</td>' +
                            '<td class="px-6 py-3.5 text-center font-bold text-slate-700">' + (v.pages || 0).toLocaleString() + '개</td>' +
                            '<td class="px-6 py-3.5 text-slate-400 font-mono text-[11px]">' + escapeHtml(v.lastVisit || '-') + '</td>' +
                        '</tr>';
                    }).join('');
                }

                renderPagination('visitorsPagination', data, function(newPage) {
                    state.visitors.page = newPage;
                    loadVisitorsData();
                });
            } catch (e) {
                console.error('loadVisitorsData error:', e);
                tbody.innerHTML = '<tr><td colspan="7" class="px-6 py-8 text-center text-rose-500">데이터 로드 실패</td></tr>';
            }
        }

        function searchVisitors() {
            state.visitors.kind = document.getElementById('visitorsKindSelect').value;
            state.visitors.q = document.getElementById('visitorsSearchInput').value.trim();
            state.visitors.sort = document.getElementById('visitorsSortSelect').value;
            state.visitors.page = 1;
            loadVisitorsData();
        }

        function changeVisitorsPageSize() {
            state.visitors.size = parseInt(document.getElementById('visitorsSizeSelect').value, 10) || 20;
            state.visitors.page = 1;
            loadVisitorsData();
        }

        // -------------------------------------------------------------------
        // API 5: 상세 실시간 접속 로그 (Access Logs)
        // -------------------------------------------------------------------
        async function loadLogsData() {
            const tbody = document.getElementById('logsTableBody');
            try {
                let url = '/api/analytics/logs?scope=' + state.scope + '&page=' + state.logs.page + '&size=' + state.logs.size + '&kind=' + state.logs.kind;
                if (state.logs.device) url += '&device=' + encodeURIComponent(state.logs.device);
                if (state.logs.q) url += '&q=' + encodeURIComponent(state.logs.q);
                if (state.from && state.to) {
                    url += '&from=' + encodeURIComponent(state.from) + '&to=' + encodeURIComponent(state.to);
                }

                const res = await fetch(url, { headers: { 'Authorization': 'Bearer ' + token } });
                const result = await res.json();
                if (!result.success) {
                    tbody.innerHTML = '<tr><td colspan="7" class="px-6 py-8 text-center text-slate-400 font-sans">데이터를 불러오지 못했습니다.</td></tr>';
                    return;
                }

                const data = result.data;
                const rows = data.rows || [];

                if (rows.length === 0) {
                    tbody.innerHTML = '<tr><td colspan="7" class="px-6 py-8 text-center text-slate-400 font-sans">조건에 해당되는 실시간 접속 로그가 없습니다.</td></tr>';
                } else {
                    tbody.innerHTML = rows.map(function(r) {
                        const statusClass = (r.status || 200) < 400 ? 'text-emerald-600 font-bold' : 'text-rose-600 font-bold';
                        const who = r.userId != null ? (r.name ? escapeHtml(r.name) : escapeHtml(r.email)) : escapeHtml(r.ip || '-');
                        const envStr = [r.device, r.browser].filter(Boolean).join('/');

                        return '<tr class="hover:bg-slate-50 transition">' +
                            '<td class="px-4 py-3 text-slate-500">' + escapeHtml(r.ts) + '</td>' +
                            '<td class="px-4 py-3 text-center ' + statusClass + '">' + (r.status || 200) + '</td>' +
                            '<td class="px-4 py-3 font-medium text-slate-900 truncate max-w-xs" title="' + escapeHtml(r.path) + '">' + escapeHtml(r.path) + '</td>' +
                            '<td class="px-4 py-3 text-teal-700 font-sans font-bold text-[11px]">' + escapeHtml(r.channel || '직접') + '</td>' +
                            '<td class="px-4 py-3 text-slate-400 truncate max-w-xs" title="' + escapeHtml(r.referrer) + '">' + escapeHtml(r.referrer || '-') + '</td>' +
                            '<td class="px-4 py-3 font-sans text-slate-800 font-medium">' + who + '</td>' +
                            '<td class="px-4 py-3 text-slate-500 font-sans text-[11px]">' + escapeHtml(envStr) + '</td>' +
                        '</tr>';
                    }).join('');
                }

                renderPagination('logsPagination', data, function(newPage) {
                    state.logs.page = newPage;
                    loadLogsData();
                });
            } catch (e) {
                console.error('loadLogsData error:', e);
                tbody.innerHTML = '<tr><td colspan="7" class="px-6 py-8 text-center text-rose-500 font-sans">데이터 로드 실패</td></tr>';
            }
        }

        function searchLogs() {
            state.logs.kind = document.getElementById('logsKindSelect').value;
            state.logs.device = document.getElementById('logsDeviceSelect').value;
            state.logs.q = document.getElementById('logsSearchInput').value.trim();
            state.logs.page = 1;
            loadLogsData();
        }

        function changeLogsPageSize() {
            state.logs.size = parseInt(document.getElementById('logsSizeSelect').value, 10) || 20;
            state.logs.page = 1;
            loadLogsData();
        }

        // -------------------------------------------------------------------
        // Pagination Component Helper
        // -------------------------------------------------------------------
        function renderPagination(containerId, pagedData, onPageChangeCallback) {
            const container = document.getElementById(containerId);
            if (!container || !pagedData) return;

            const page = pagedData.page || 1;
            const totalPages = pagedData.totalPages || 1;
            const total = pagedData.total || 0;
            const size = pagedData.size || 20;

            if (total === 0) {
                container.innerHTML = '<div>총 0건</div>';
                return;
            }

            const startIdx = (page - 1) * size + 1;
            const endIdx = Math.min(page * size, total);

            let startPage = Math.max(1, page - 2);
            let endPage = Math.min(totalPages, startPage + 4);
            if (endPage - startPage < 4) {
                startPage = Math.max(1, endPage - 4);
            }

            let btnHtml = '';

            // Previous button
            if (page > 1) {
                btnHtml += '<button type="button" data-page="' + (page - 1) + '" class="page-nav-btn px-2.5 py-1 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 font-bold"><i class="fas fa-chevron-left"></i></button>';
            } else {
                btnHtml += '<button disabled class="px-2.5 py-1 rounded-lg border border-slate-100 text-slate-300 cursor-not-allowed"><i class="fas fa-chevron-left"></i></button>';
            }

            // Page numbers
            for (let i = startPage; i <= endPage; i++) {
                if (i === page) {
                    btnHtml += '<button type="button" class="px-3 py-1 rounded-lg bg-indigo-600 text-white font-black shadow-sm">' + i + '</button>';
                } else {
                    btnHtml += '<button type="button" data-page="' + i + '" class="page-nav-btn px-3 py-1 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 font-bold">' + i + '</button>';
                }
            }

            // Next button
            if (page < totalPages) {
                btnHtml += '<button type="button" data-page="' + (page + 1) + '" class="page-nav-btn px-2.5 py-1 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 font-bold"><i class="fas fa-chevron-right"></i></button>';
            } else {
                btnHtml += '<button disabled class="px-2.5 py-1 rounded-lg border border-slate-100 text-slate-300 cursor-not-allowed"><i class="fas fa-chevron-right"></i></button>';
            }

            container.innerHTML = '<div class="text-slate-500 font-medium">' +
                '총 <span class="font-bold text-slate-900">' + total.toLocaleString() + '</span>건 중 ' +
                '<span class="font-bold text-slate-700">' + startIdx.toLocaleString() + ' - ' + endIdx.toLocaleString() + '</span>건 표시' +
            '</div>' +
            '<div class="flex items-center gap-1.5">' +
                btnHtml +
            '</div>';

            // Attach event listener for pagination buttons
            const btns = container.querySelectorAll('.page-nav-btn');
            btns.forEach(function(btn) {
                btn.addEventListener('click', function() {
                    const p = parseInt(btn.getAttribute('data-page'), 10);
                    if (p && onPageChangeCallback) {
                        onPageChangeCallback(p);
                    }
                });
            });
        }
    </script>
</body>
</html>
`;
