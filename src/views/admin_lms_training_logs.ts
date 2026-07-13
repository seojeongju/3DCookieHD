
import { lmsHeaderHtml } from './components/lms_header';
import { LMS_SHELL_COLUMN_CLASS, LMS_SHELL_ROOT_CLASS, lmsFixedHeaderBlock, lmsScrollMainOpen } from './components/lms_page_shell';
import { hrdSidebar } from './components/hrd_sidebar';

export const adminLmsTrainingLogsHtml = (sidebar: string = hrdSidebar('courses')) => `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>훈련일지 관리 - 교육행정 시스템</title>
    <link rel="stylesheet" href="/static/tailwind-app.css">
<link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <style>
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 2px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }

        /* 훈련일지 모달 — 모바일 시트 & 폼 가독성 */
        #logModal { overscroll-behavior: contain; -webkit-overflow-scrolling: touch; }
        .log-modal-inner { padding-bottom: env(safe-area-inset-bottom, 0px); }

        @media (max-width: 767px) {
            .training-log-paper { padding: 0.75rem !important; border-width: 1px; border-radius: 0.75rem; }
            .training-log-print-badge { font-size: 9px; padding: 2px 6px; }
            .training-log-approval-mini { display: none !important; }
            .training-log-info-table { display: block; width: 100%; border: 0; }
            .training-log-info-table tbody { display: block; }
            .training-log-info-table tr {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 0;
                margin-bottom: 0.5rem;
                border: 1px solid #1f2937;
                border-radius: 0.5rem;
                overflow: hidden;
            }
            .training-log-info-table td {
                display: block;
                padding: 0.45rem 0.55rem !important;
                font-size: 11px;
                border: none !important;
                border-bottom: 1px solid #e5e7eb !important;
                text-align: left !important;
                word-break: break-word;
            }
            .training-log-info-table td.bg-gray-100 {
                font-weight: 800;
                font-size: 10px;
                color: #374151;
                background: #f3f4f6 !important;
            }
            .training-log-info-table tr td:nth-child(odd) { border-right: 1px solid #e5e7eb !important; }
            .training-log-info-table tr td:nth-last-child(-n+2) { border-bottom: none !important; }

            .training-log-attendance-table tr {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 0;
                border: 1px solid #1f2937;
                border-radius: 0.5rem;
                overflow: hidden;
            }
            .training-log-attendance-table td {
                border: none !important;
                border-bottom: 1px solid #e5e7eb !important;
                border-right: 1px solid #e5e7eb !important;
                min-height: 44px;
                padding: 0 !important;
            }
            .training-log-attendance-table td:nth-child(2n) { border-right: none !important; }
            .training-log-attendance-table tr td:nth-last-child(-n+2) { border-bottom: none !important; }
            .training-log-attendance-table input { min-height: 44px; font-size: 15px; }

            .training-log-schedule-table thead { display: none; }
            .training-log-schedule-table tbody tr {
                display: block;
                margin-bottom: 0.75rem;
                border: 1px solid #1f2937;
                border-radius: 0.75rem;
                overflow: hidden;
                background: #fff;
                scroll-margin-top: 5rem;
                box-shadow: 0 1px 3px rgb(0 0 0 / 0.06);
            }
            .training-log-schedule-table tbody td {
                display: grid;
                grid-template-columns: 5.25rem minmax(0, 1fr);
                gap: 0.25rem 0.65rem;
                align-items: center;
                padding: 0.55rem 0.65rem !important;
                border: none !important;
                border-bottom: 1px solid #f1f5f9 !important;
                width: 100% !important;
                min-width: 0 !important;
            }
            .training-log-schedule-table tbody td:last-child { border-bottom: none !important; }
            .training-log-schedule-table tbody td::before {
                content: attr(data-label);
                font-size: 10px;
                font-weight: 800;
                color: #64748b;
                letter-spacing: 0.04em;
                line-height: 1.2;
            }
            .training-log-schedule-table tbody td:first-child {
                display: block;
                text-align: center;
                padding: 0.6rem !important;
                background: linear-gradient(135deg, #eef2ff 0%, #f8fafc 100%);
                font-size: 13px;
                font-weight: 900;
                color: #4338ca;
                letter-spacing: 0.02em;
                border-bottom: 1px solid #e0e7ff !important;
            }
            .training-log-schedule-table tbody td:first-child::before { display: none; content: none; }
            .training-log-schedule-table tbody td input {
                width: 100%;
                min-width: 0;
                font-size: 15px;
                padding-top: 0.55rem;
                padding-bottom: 0.55rem;
            }

            .training-log-footer-note-table tr { display: flex; flex-wrap: wrap; }
            .training-log-footer-note-table td:first-child {
                flex: 0 0 100%;
                border-bottom: 1px solid #1f2937 !important;
            }
            .training-log-footer-note-table td:not(:first-child) { flex: 1; min-width: 0; }

            .training-log-special-table td.bg-gray-50 { min-width: 5rem; }
            .training-log-special-table input,
            .training-log-special-table textarea { font-size: 15px !important; min-height: 44px; }
            .training-log-special-table textarea#logContent { min-height: 6rem; }

        }
    </style>
</head>
<body class="bg-gray-50 overflow-hidden">
    <div class="${LMS_SHELL_ROOT_CLASS}">
        ${sidebar}
        
        <div class="${LMS_SHELL_COLUMN_CLASS}">
            ${lmsFixedHeaderBlock(lmsHeaderHtml('training-logs', 'hrd'))}
            ${lmsScrollMainOpen()}

    <!-- 서브 헤더 (훈련일지 전용) -->
     <div class="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <h1 class="text-xl font-bold text-gray-800">훈련일지 관리</h1>
            <div class="flex flex-wrap gap-2 items-center">
                <button onclick="openLogModal()" class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center shadow-sm">
                    <i class="fas fa-pen-nib mr-2"></i> 오늘 일지 작성
                </button>
            </div>
        </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <!-- 일지 목록: 필터 · 보기 모드 -->
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-5 mb-4 space-y-4">
            <div class="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
                <div class="flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:items-end">
                    <div>
                        <label for="logFilterStart" class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">시작일</label>
                        <input type="date" id="logFilterStart" class="border border-gray-200 rounded-lg px-3 py-2 text-sm font-bold text-gray-800 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-full sm:w-auto min-w-[10rem]">
                    </div>
                    <div>
                        <label for="logFilterEnd" class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">종료일</label>
                        <input type="date" id="logFilterEnd" class="border border-gray-200 rounded-lg px-3 py-2 text-sm font-bold text-gray-800 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-full sm:w-auto min-w-[10rem]">
                    </div>
                    <div class="flex gap-2">
                        <button type="button" onclick="applyLogDateFilter()" class="px-4 py-2 bg-indigo-600 text-white text-xs font-black rounded-lg hover:bg-indigo-700 transition shadow-sm uppercase tracking-wider">조회</button>
                        <button type="button" onclick="clearLogDateFilter()" class="px-4 py-2 bg-gray-100 text-gray-700 text-xs font-black rounded-lg hover:bg-gray-200 transition uppercase tracking-wider">전체 기간</button>
                    </div>
                </div>
                <div>
                    <span class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">목록 표시</span>
                    <div class="inline-flex rounded-xl border border-gray-200 p-1 bg-gray-50/80" role="group" aria-label="목록 표시 방식">
                        <button type="button" id="logViewBtnSimple" onclick="setTrainingLogViewMode('simple')" class="px-3 py-2 text-xs font-black rounded-lg transition uppercase tracking-tight bg-white text-indigo-700 shadow-sm">간단 목록</button>
                        <button type="button" id="logViewBtnGrouped" onclick="setTrainingLogViewMode('grouped')" class="px-3 py-2 text-xs font-black rounded-lg transition uppercase tracking-tight text-gray-500 hover:text-gray-800">일자·교시별</button>
                    </div>
                </div>
            </div>
            <p class="text-xs text-gray-500 leading-relaxed"><span class="font-bold text-gray-600">일자별</span>은 기간 조회로 묶어 보고, <span class="font-bold text-gray-600">교시별</span>은 같은 화면에서 1~8교시 내용을 나란히 확인할 수 있습니다.</p>
        </div>

        <div id="logSimpleTableWrap" class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden overflow-x-auto mb-4">
            <table class="w-full text-left border-collapse min-w-[560px]">
                <thead class="bg-gray-50/50 border-b">
                    <tr>
                        <th class="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider w-32">일자</th>
                        <th class="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">훈련 주제 및 내용</th>
                        <th class="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider w-28 text-center">작성자</th>
                        <th class="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider w-20 text-center">시간</th>
                        <th class="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider w-24"></th>
                    </tr>
                </thead>
                <tbody id="logTableBody" class="divide-y divide-gray-50">
                    <!-- JS Load -->
                </tbody>
            </table>
        </div>

        <div id="logGroupedCardsWrap" class="hidden space-y-4 mb-4">
            <!-- JS: 일자·교시별 카드 -->
        </div>
        
        <!-- Pagination Controls -->
        <div id="paginationControls" class="flex justify-center flex-wrap gap-2 mb-8"></div>
    </div>

    <!-- 일지 등록 모달 -->
    <!-- 일지 등록 모달 -->
    <!-- 일지 등록 모달 -->
    <div id="logModal" class="fixed inset-0 bg-black/60 hidden z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4 backdrop-blur-sm overflow-y-auto overflow-x-hidden">
        <div class="log-modal-inner bg-white shadow-2xl w-full max-w-full sm:max-w-6xl max-h-[min(96dvh,100vh)] sm:max-h-[90vh] min-h-0 flex flex-col mb-0 sm:my-4 transform transition-all border border-gray-100 rounded-t-2xl sm:rounded-xl overflow-hidden">
            <!-- Header -->
            <div class="p-4 sm:p-6 border-b flex-none flex justify-between items-center bg-gray-50 sm:rounded-t-xl z-10 relative shrink-0 gap-3">
                 <div class="flex items-center gap-2 min-w-0">
                    <i class="fas fa-calendar-check text-indigo-600 text-lg sm:text-xl shrink-0"></i>
                    <h3 class="text-base sm:text-xl font-bold text-gray-900 truncate" id="modalTitle">훈련일지 작성</h3>
                 </div>
                <button type="button" onclick="closeLogModal()" class="text-gray-400 hover:text-gray-600 transition-colors w-10 h-10 sm:w-8 sm:h-8 flex items-center justify-center rounded-full hover:bg-gray-200 shrink-0 touch-manipulation" aria-label="닫기"><i class="fas fa-times text-lg"></i></button>
            </div>

            <form id="logForm" onsubmit="event.preventDefault(); if(window.handleSaveLog){window.handleSaveLog(event);} return false;" class="p-4 sm:p-8 space-y-4 sm:space-y-6 overflow-y-auto overflow-x-hidden flex-1 min-h-0 custom-scrollbar bg-white min-w-0">
                <input type="hidden" id="logId">
                
                <!-- 훈련일 아님 안내 -->
                <div id="logNotTrainingDayNotice" class="hidden mb-4 p-4 bg-slate-100 border border-slate-200 rounded-xl text-slate-700 text-sm font-medium flex items-start gap-2 leading-snug">
                    <i class="fas fa-calendar-times shrink-0 mt-0.5"></i>
                    <span class="break-words">훈련일이 아닙니다. 해당 날짜에는 훈련일지 작성이 제한됩니다. 훈련일을 선택해 주세요.</span>
                </div>

                <div class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 px-0 sm:px-2">
                     <label class="font-bold text-gray-700 text-sm shrink-0"><i class="fas fa-clock text-indigo-500 mr-1"></i> 해당일 일지 훈련시간(h)</label>
                     <input type="number" id="logHours" class="border border-gray-300 rounded-lg px-3 py-2.5 sm:py-1.5 w-full sm:w-24 text-center outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 font-bold transition-all text-gray-700 bg-gray-50 focus:bg-white text-base sm:text-sm touch-manipulation" min="0.5" max="24" step="0.1" placeholder="배정시간 (자동 로드, 소수 입력 가능)">
                </div>

                <div class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 px-0 sm:px-2">
                     <label class="font-bold text-gray-700 text-sm shrink-0"><i class="fas fa-user-edit text-indigo-500 mr-1"></i> 작성자</label>
                     <select id="logAuthorId" class="border border-gray-300 rounded-lg px-3 py-2.5 sm:py-1.5 w-full sm:min-w-[180px] outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 font-medium text-gray-700 bg-white text-base sm:text-sm touch-manipulation">
                        <option value="">선택</option>
                     </select>
                     <span id="logAuthorLabel" class="hidden text-sm font-bold text-gray-600"></span>
                </div>

            
                <!-- Paper Form Container (Visual Match to Print) -->
                <div class="training-log-paper border-2 border-gray-800 p-3 sm:p-8 shadow-sm relative min-w-0 overflow-hidden sm:overflow-visible rounded-lg sm:rounded-none">
                    <div class="training-log-print-badge absolute top-0 left-0 bg-gray-800 text-white text-[10px] px-2 py-0.5 font-bold uppercase tracking-wider rounded-br sm:rounded-none">Print Preview Layout</div>
                    
                    <!-- Header Section -->
                    <div class="flex justify-between items-end mb-4 sm:mb-6 mt-6 sm:mt-4 min-h-[2rem] sm:min-h-0">
                        <h1 class="text-2xl sm:text-3xl font-black text-center w-full absolute left-0 right-0 pointer-events-none opacity-10 select-none">훈련일지</h1>
                        
                        <div class="training-log-approval-mini ml-auto z-10 shrink-0">
                            <table class="border-collapse border border-gray-800 text-xs bg-white">
                                <tr>
                                   <td rowspan="2" class="border border-gray-800 bg-gray-50 font-bold p-1 text-center w-8">결<br>재</td>
                                   <td class="border border-gray-800 bg-gray-50 font-bold p-1 w-16 text-center">담 당</td>
                                   <td class="border border-gray-800 bg-gray-50 font-bold p-1 w-16 text-center">원 장</td>
                                </tr>
                                <tr>
                                   <td class="border border-gray-800 h-14 bg-gray-50/10 cursor-not-allowed"></td>
                                   <td class="border border-gray-800 h-14 bg-gray-50/10 cursor-not-allowed"></td>
                                </tr>
                            </table>
                        </div>
                    </div>
            
                    <!-- Info Table -->
                    <table class="training-log-info-table w-full border-collapse border border-gray-800 text-sm mb-4 min-w-0">
                        <tr>
                            <td class="border border-gray-800 bg-gray-100 font-bold p-2 text-center w-32">훈련기관명</td>
                            <td class="border border-gray-800 p-2 text-center font-medium" id="institution-name-display">쓰리디쿠키 홍대센터</td>
                            <td class="border border-gray-800 bg-gray-100 font-bold p-2 text-center w-24">훈련일</td>
                            <td class="border border-gray-800 p-1 text-center bg-white">
                                <select id="logDateSelect" class="w-full text-center font-bold bg-white outline-none cursor-pointer text-gray-800 hover:text-indigo-600 border-0 py-1" style="display:none;"></select>
                                <input type="date" id="logDate" class="w-full text-center font-bold bg-transparent outline-none cursor-pointer text-gray-800 hover:text-indigo-600" value="">
                            </td>
                        </tr>
                        <tr>
                            <td class="border border-gray-800 bg-gray-100 font-bold p-2 text-center">훈련과정명</td>
                            <td class="border border-gray-800 p-2 text-center font-medium tracking-tight text-xs text-gray-800" id="logCourseName">-</td>
                            <td class="border border-gray-800 bg-gray-100 font-bold p-2 text-center">재적</td>
                            <td class="border border-gray-800 p-2 text-center text-gray-800 font-bold" id="logEnrollCount">- 명</td>
                        </tr>
                    </table>
            
                    <!-- Attendance Input Table -->
                    <table class="training-log-attendance-table w-full border-collapse border border-gray-800 text-sm mb-6 min-w-0">
                        <tr>
                            <td class="border border-gray-800 bg-gray-100 font-bold p-2 text-center w-[12.5%]">출석</td>
                            <td class="border border-gray-800 p-0 w-[12.5%]"><input type="text" id="logAttPresent" class="w-full h-full p-2 text-center font-bold outline-none text-indigo-600 focus:bg-indigo-50 transition-colors" placeholder="0"></td>
                            <td class="border border-gray-800 bg-gray-100 font-bold p-2 text-center w-[12.5%]">결석</td>
                            <td class="border border-gray-800 p-0 w-[12.5%]"><input type="text" id="logAttAbsent" class="w-full h-full p-2 text-center font-bold outline-none text-rose-600 focus:bg-rose-50 transition-colors" placeholder="0"></td>
                            <td class="border border-gray-800 bg-gray-100 font-bold p-2 text-center w-[12.5%]">지각</td>
                            <td class="border border-gray-800 p-0 w-[12.5%]"><input type="text" id="logAttLate" class="w-full h-full p-2 text-center font-bold outline-none text-amber-600 focus:bg-amber-50 transition-colors" placeholder="0"></td>
                            <td class="border border-gray-800 bg-gray-100 font-bold p-2 text-center w-[12.5%]">조퇴</td>
                            <td class="border border-gray-800 p-0 w-[12.5%]"><input type="text" id="logAttEarly" class="w-full h-full p-2 text-center font-bold outline-none text-amber-600 focus:bg-amber-50 transition-colors" placeholder="0"></td>
                        </tr>
                    </table>
            
                    <!-- Schedule Section: 일자(위 훈련일) + 교시별 입력 안내 -->
                    <p class="text-xs text-gray-600 mb-2 mt-4 px-1 leading-relaxed border-l-4 border-indigo-200 pl-3 break-words"><strong class="text-gray-800">일자별</strong> 작성은 위 <strong>훈련일</strong>을 바꾸면 됩니다(해당 일 출석·시간표 연동). <strong class="text-gray-800">교시(시간대)별</strong> 훈련 내용은 아래 교시 카드에 구분하여 입력합니다.</p>
                    <div class="flex flex-wrap items-center gap-1.5 mb-3 px-1" role="navigation" aria-label="교시 행으로 스크롤">
                        <span class="text-[10px] font-black text-gray-400 uppercase tracking-wider mr-1">교시 이동</span>
                        <button type="button" onclick="scrollToSchPeriod(1)" class="px-2 py-1 rounded-lg bg-slate-100 text-[10px] font-black text-slate-600 hover:bg-indigo-100 hover:text-indigo-800 transition">1</button>
                        <button type="button" onclick="scrollToSchPeriod(2)" class="px-2 py-1 rounded-lg bg-slate-100 text-[10px] font-black text-slate-600 hover:bg-indigo-100 hover:text-indigo-800 transition">2</button>
                        <button type="button" onclick="scrollToSchPeriod(3)" class="px-2 py-1 rounded-lg bg-slate-100 text-[10px] font-black text-slate-600 hover:bg-indigo-100 hover:text-indigo-800 transition">3</button>
                        <button type="button" onclick="scrollToSchPeriod(4)" class="px-2 py-1 rounded-lg bg-slate-100 text-[10px] font-black text-slate-600 hover:bg-indigo-100 hover:text-indigo-800 transition">4</button>
                        <button type="button" onclick="scrollToSchPeriod(5)" class="px-2 py-1 rounded-lg bg-slate-100 text-[10px] font-black text-slate-600 hover:bg-indigo-100 hover:text-indigo-800 transition">5</button>
                        <button type="button" onclick="scrollToSchPeriod(6)" class="px-2 py-1 rounded-lg bg-slate-100 text-[10px] font-black text-slate-600 hover:bg-indigo-100 hover:text-indigo-800 transition">6</button>
                        <button type="button" onclick="scrollToSchPeriod(7)" class="px-2 py-1 rounded-lg bg-slate-100 text-[10px] font-black text-slate-600 hover:bg-indigo-100 hover:text-indigo-800 transition">7</button>
                        <button type="button" onclick="scrollToSchPeriod(8)" class="px-2 py-1 rounded-lg bg-slate-100 text-[10px] font-black text-slate-600 hover:bg-indigo-100 hover:text-indigo-800 transition">8</button>
                    </div>
                    <div class="bg-gray-200 border border-gray-800 border-b-0 p-2 text-center font-bold text-xs sm:text-sm leading-tight">훈 련 사 항 (교시별)</div>
                    <div class="min-w-0 overflow-x-auto sm:overflow-visible -mx-1 px-1 sm:mx-0 sm:px-0">
                    <table class="training-log-schedule-table w-full border-collapse border border-gray-800 text-xs mb-0 min-w-0 sm:min-w-[520px]">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="border border-gray-800 p-2 w-12">교시</th>
                                <th class="border border-gray-800 p-2 min-w-[200px] w-52">훈련과목</th>
                                <th class="border border-gray-800 p-2 min-w-[120px] w-36">담당교사</th>
                                <th class="border border-gray-800 p-2">훈련 내용</th>
                                <th class="border border-gray-800 p-2 w-28">비고</th>
                            </tr>
                        </thead>
                        <tbody id="scheduleTableBody">
                            <!-- JS Generated -->
                        </tbody>
                    </table>
                    </div>
                    <div class="flex flex-col sm:flex-row gap-2 sm:justify-between mt-2 mb-2">
                         <button type="button" id="btnLoadAttendance" onclick="if(window.loadDailyAttendance){window.loadDailyAttendance();}else{alert('페이지를 새로고침 후 다시 시도해 주세요.');}" class="text-xs text-rose-600 hover:text-rose-800 underline font-bold px-2 py-2.5 sm:py-1 flex items-center justify-center sm:justify-start gap-2 rounded-lg bg-rose-50/50 sm:bg-transparent touch-manipulation"><i class="fas fa-users-viewfinder"></i> <span id="btnLoadAttText">출석 기록 불러오기</span></button>
                         <button type="button" id="btnLoadSchedule" onclick="if(window.loadDailySchedule){window.loadDailySchedule(true);}else{alert('페이지를 새로고침 후 다시 시도해 주세요.');}" class="text-xs text-indigo-600 hover:text-indigo-800 underline font-bold px-2 py-2.5 sm:py-1 flex items-center justify-center sm:justify-start gap-2 rounded-lg bg-indigo-50/50 sm:bg-transparent touch-manipulation"><i class="fas fa-sync-alt"></i> 시간표 불러오기</button>
                    </div>
            
                    <!-- Footer Lists -->
                     <table class="training-log-footer-note-table w-full border-collapse border border-gray-800 border-t-0 text-xs mt-1 min-w-0">
                        <tr>
                             <td class="bg-gray-200 border-r border-b border-gray-800 p-2 w-32 text-center font-bold" rowspan="2">지시사항</td>
                             <td class="border-b border-gray-800 p-0 h-16 align-top">
                                <textarea id="logInstructions" class="w-full h-full resize-none outline-none p-2 focus:bg-gray-50 transition-colors" placeholder="지시사항을 입력하세요"></textarea>
                             </td>
                        </tr>
                     </table>
                     <table class="training-log-special-table w-full border-collapse border border-gray-800 border-t-0 text-xs text-left min-w-0">
                        <tr>
                             <td class="bg-gray-200 border-r border-gray-800 p-2 w-32 text-center font-bold" rowspan="8">특기<br>사항</td>
                        </tr>
                        <tr>
                             <td class="bg-gray-50 border-r border-b border-gray-800 p-2 w-24 text-center font-bold">지각자</td>
                             <td class="border-b border-gray-800 p-0 h-8"><input type="text" id="logListLate" class="w-full h-full px-2 outline-none focus:bg-yellow-50 transition-colors" placeholder="0명"></td>
                        </tr>
                        <tr>
                             <td class="bg-gray-50 border-r border-b border-gray-800 p-2 w-24 text-center font-bold">결석자</td>
                             <td class="border-b border-gray-800 p-0 h-8"><input type="text" id="logListAbsent" class="w-full h-full px-2 outline-none focus:bg-red-50 transition-colors" placeholder="0명"></td>
                        </tr>
                        <tr>
                             <td class="bg-gray-50 border-r border-b border-gray-800 p-2 w-24 text-center font-bold">조퇴자</td>
                             <td class="border-b border-gray-800 p-0 h-8"><input type="text" id="logListEarly" class="w-full h-full px-2 outline-none focus:bg-orange-50 transition-colors" placeholder="0명"></td>
                        </tr>
                        <tr>
                             <td class="bg-gray-50 border-r border-b border-gray-800 p-2 w-24 text-center font-bold">공결자</td>
                             <td class="border-b border-gray-800 p-0 h-8"><input type="text" id="logListPublic" class="w-full h-full px-2 outline-none focus:bg-blue-50 transition-colors" placeholder="0명"></td>
                        </tr>
                        <tr>
                             <td class="bg-gray-50 border-r border-b border-gray-800 p-2 w-24 text-center font-bold">50%미만결석</td>
                             <td class="border-b border-gray-800 p-0 h-8"><input type="text" id="logListUnder50" class="w-full h-full px-2 outline-none focus:bg-red-50 transition-colors" placeholder="0명"></td>
                        </tr>
                        <tr>
                             <td class="bg-gray-50 border-r border-b border-gray-800 p-2 w-24 text-center font-bold">지각&조퇴</td>
                             <td class="border-b border-gray-800 p-0 h-8"><input type="text" id="logListLateEarly" class="w-full h-full px-2 outline-none focus:bg-yellow-50 transition-colors" placeholder="0명"></td>
                        </tr>
                        <tr>
                             <td class="bg-gray-50 border-r border-gray-800 p-2 w-24 text-center font-bold">기타사항</td>
                             <td class="border-gray-800 p-0 h-20 align-top">
                                <textarea id="logContent" class="w-full h-full resize-none outline-none p-2 leading-relaxed focus:bg-gray-50 transition-colors" placeholder="기타 전달사항 및 특이사항을 입력하세요"></textarea>
                             </td>
                        </tr>
                     </table>
                </div>
            
                <!-- Hidden elements picker (Legacy but maybe needed for NCS logic? kept hidden) -->
                <div id="elementsPicker" class="hidden"></div> 
            
                <div class="training-log-action-row flex flex-col-reverse sm:flex-row justify-center gap-3 pt-2 sm:pt-4 pb-[max(0.35rem,env(safe-area-inset-bottom))]">
                    <button type="button" onclick="closeLogModal()" class="w-full sm:w-auto px-6 py-3.5 sm:py-2.5 bg-white border border-gray-300 text-gray-700 rounded-xl sm:rounded-lg font-bold hover:bg-gray-50 transition shadow-sm touch-manipulation text-base sm:text-sm">취소</button>
                    <button type="submit" id="logFormSubmitBtn" class="w-full sm:w-auto px-8 py-3.5 sm:py-2.5 bg-indigo-600 text-white rounded-xl sm:rounded-lg font-bold hover:bg-indigo-700 transition shadow-lg hover:shadow-indigo-200 disabled:opacity-60 disabled:cursor-not-allowed touch-manipulation text-base sm:text-sm">저장하기</button>
                </div>
            </form>
        </div>
    </div>

    <script>
        var urlParams = new URLSearchParams(window.location.search);
        var pathParts = window.location.pathname.split('/').filter(function(p) { return !!p; });
        var coursesIdx = pathParts.indexOf('courses');
        var pathCourseIdRaw = (coursesIdx >= 0 && pathParts[coursesIdx + 1]) ? parseInt(pathParts[coursesIdx + 1], 10) : NaN;
        var pathCourseId = (!isNaN(pathCourseIdRaw) && pathCourseIdRaw > 0) ? pathCourseIdRaw : null;
        var sessionIdFromQuery = urlParams.get('session_id');
        var sessionIdRaw = sessionIdFromQuery ? parseInt(sessionIdFromQuery, 10) : NaN;
        var sessionId = (!isNaN(sessionIdRaw) && sessionIdRaw > 0) ? sessionIdRaw : null;
        var courseId = null;
        window.trainingLogDates = window.trainingLogDates || [];
        window.hrdSessionMeta = window.hrdSessionMeta || null;
        window.selectedTrainingLogDate = window.selectedTrainingLogDate || null;
        var user = JSON.parse(localStorage.getItem('user') || '{}');
        var token = localStorage.getItem('token');
        var assignedUnits = [];
        var globalDailyHours = 8;
        var assignedHoursFromApi = null;
        var currentPage = 1;
        var instructorList = [];
        window.trainingLogsViewMode = window.trainingLogsViewMode || 'simple';
        window.lastTrainingLogs = window.lastTrainingLogs || [];

        function escapeHtmlAttr(s) {
            if (s == null || s === '') return '';
            return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
        }

        function formatLogDateLabel(dateStr) {
            if (!dateStr) return '-';
            try {
                var dayNames = ['일', '월', '화', '수', '목', '금', '토'];
                var parts = String(dateStr).substring(0, 10).split('-');
                if (parts.length !== 3) return dateStr;
                var y = parseInt(parts[0], 10);
                var m = parseInt(parts[1], 10);
                var d = parseInt(parts[2], 10);
                var dow = dayNames[new Date(y, m - 1, d).getDay()];
                return parts[0] + '-' + parts[1] + '-' + parts[2] + ' (' + dow + ')';
            } catch (e) { return dateStr; }
        }

        function setTrainingLogViewMode(mode) {
            window.trainingLogsViewMode = mode === 'grouped' ? 'grouped' : 'simple';
            var bS = document.getElementById('logViewBtnSimple');
            var bG = document.getElementById('logViewBtnGrouped');
            var wrapS = document.getElementById('logSimpleTableWrap');
            var wrapG = document.getElementById('logGroupedCardsWrap');
            if (bS && bG) {
                if (window.trainingLogsViewMode === 'simple') {
                    bS.className = 'px-3 py-2 text-xs font-black rounded-lg transition uppercase tracking-tight bg-white text-indigo-700 shadow-sm';
                    bG.className = 'px-3 py-2 text-xs font-black rounded-lg transition uppercase tracking-tight text-gray-500 hover:text-gray-800';
                } else {
                    bS.className = 'px-3 py-2 text-xs font-black rounded-lg transition uppercase tracking-tight text-gray-500 hover:text-gray-800';
                    bG.className = 'px-3 py-2 text-xs font-black rounded-lg transition uppercase tracking-tight bg-white text-indigo-700 shadow-sm';
                }
            }
            if (wrapS && wrapG) {
                wrapS.classList.toggle('hidden', window.trainingLogsViewMode !== 'simple');
                wrapG.classList.toggle('hidden', window.trainingLogsViewMode !== 'grouped');
            }
            renderLogs(window.lastTrainingLogs || []);
        }

        function applyLogDateFilter() {
            loadLogs(1);
        }

        function clearLogDateFilter() {
            var fs = document.getElementById('logFilterStart');
            var fe = document.getElementById('logFilterEnd');
            if (fs) fs.value = '';
            if (fe) fe.value = '';
            loadLogs(1);
        }

        function scrollToSchPeriod(n) {
            var row = document.getElementById('schPeriodRow' + n);
            if (row) row.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }

        function resetLogFormInteractiveState() {
            window.notTrainingDay = false;
            var notTrainingNoticeEl = document.getElementById('logNotTrainingDayNotice');
            if (notTrainingNoticeEl) notTrainingNoticeEl.classList.add('hidden');
            var skipDisableIds = { logDate: true, logDateSelect: true, logAuthorId: true, logHours: true, btnLoadAttendance: true, logFormSubmitBtn: true };
            document.querySelectorAll('#logForm input, #logForm textarea, #logForm select, #logForm button').forEach(function(el) {
                if (!el || !el.id) return;
                if (skipDisableIds[el.id]) return;
                if (el.getAttribute('onclick') && el.getAttribute('onclick').indexOf('closeLogModal') >= 0) return;
                el.disabled = false;
                if (el.tagName === 'BUTTON') {
                    el.classList.remove('opacity-50', 'cursor-not-allowed');
                } else {
                    el.classList.remove('bg-gray-50', 'cursor-not-allowed');
                }
            });
        }

        function normalizeTrainingDateClient(dateVal) {
            if (dateVal == null || dateVal === '') return '';
            var s = String(dateVal).trim()
                .replace(/[\u2010-\u2015\u2212\uFE58\uFE63\uFF0D]/g, '-')
                .replace(/[./]/g, '-');
            // 주의: 이 파일은 백틱 템플릿 문자열이므로 \\d 대신 [0-9] 사용
            var m = s.match(/([0-9]{4})-([0-9]{1,2})-([0-9]{1,2})/);
            if (!m) {
                // 최후 폴백: 앞 10자가 날짜 형태면 그대로 사용
                var head = s.substring(0, 10);
                if (head.length === 10 && head.charAt(4) === '-' && head.charAt(7) === '-') return head;
                return '';
            }
            var mm = String(parseInt(m[2], 10)).padStart(2, '0');
            var dd = String(parseInt(m[3], 10)).padStart(2, '0');
            if (mm === 'NaN' || dd === 'NaN' || parseInt(m[2], 10) < 1 || parseInt(m[3], 10) < 1) return '';
            return m[1] + '-' + mm + '-' + dd;
        }

        function readRawTrainingLogDate() {
            var sel = document.getElementById('logDateSelect');
            var dateInput = document.getElementById('logDate');
            var raw = '';

            // 단일 기준: #logDate (type=date) 값을 최우선
            if (dateInput && dateInput.value) raw = dateInput.value;

            // 셀렉트가 보이는 경우 선택값으로 덮어씀
            if (sel && sel.style.display !== 'none') {
                if (sel.value) raw = sel.value;
                else if (sel.options && sel.selectedIndex >= 0 && sel.options[sel.selectedIndex]) {
                    raw = sel.options[sel.selectedIndex].value || sel.options[sel.selectedIndex].textContent || raw;
                }
            }

            if (!raw && sel && sel.value) raw = sel.value;
            if (!raw && window.selectedTrainingLogDate) raw = String(window.selectedTrainingLogDate);
            return raw;
        }

        function syncLogDateFromUi() {
            var normalized = normalizeTrainingDateClient(readRawTrainingLogDate());
            if (!normalized) return '';

            var sel = document.getElementById('logDateSelect');
            var dateInput = document.getElementById('logDate');
            if (dateInput) dateInput.value = normalized;
            if (sel && sel.options && sel.options.length > 0) {
                try { sel.value = normalized; } catch (e) {}
            }
            window.selectedTrainingLogDate = normalized;
            return normalized;
        }

        function isListedTrainingDate(dateVal) {
            var d = normalizeTrainingDateClient(dateVal);
            if (!d) return false;
            var listed = window.trainingLogDates || [];
            for (var i = 0; i < listed.length; i++) {
                if (normalizeTrainingDateClient(listed[i]) === d) return true;
            }
            var dateSelectEl = document.getElementById('logDateSelect');
            if (dateSelectEl && dateSelectEl.options && dateSelectEl.options.length > 0) {
                for (var j = 0; j < dateSelectEl.options.length; j++) {
                    if (normalizeTrainingDateClient(dateSelectEl.options[j].value) === d) return true;
                }
            }
            var generated = generateClientTrainingDates(window.hrdSessionMeta);
            for (var k = 0; k < generated.length; k++) {
                if (normalizeTrainingDateClient(generated[k]) === d) return true;
            }
            var dateInput = document.getElementById('logDate');
            if (dateInput && normalizeTrainingDateClient(dateInput.value) === d) return true;
            return false;
        }

        function pickDefaultTrainingDate(dates, preferredDate) {
            if (!dates || dates.length === 0) return null;
            var preferred = normalizeTrainingDateClient(preferredDate);
            if (preferred && dates.indexOf(preferred) >= 0) return preferred;
            var now = new Date();
            var today = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0') + '-' + String(now.getDate()).padStart(2, '0');
            if (dates.indexOf(today) >= 0) return today;
            var pastOrToday = dates.filter(function(d) { return d <= today; });
            return pastOrToday.length > 0 ? pastOrToday[pastOrToday.length - 1] : dates[0];
        }

        function onTrainingDateChange() {
            if (window._skipTrainingDateChange) return;
            var d = syncLogDateFromUi();
            if (d) window.selectedTrainingLogDate = d;
            resetLogFormInteractiveState();
            // 날짜 변경 시 해당일 저장본이 있으면 수정 모드로 전환
            findExistingLogForDate(d).then(function(existing) {
                if (existing && existing.id) {
                    window._skipTrainingDateChange = true;
                    return editLog(existing.id).then(function() {
                        window._skipTrainingDateChange = false;
                    }, function() {
                        window._skipTrainingDateChange = false;
                    });
                }
                var elId = document.getElementById('logId');
                if (elId) elId.value = '';
                var elTitle = document.getElementById('modalTitle');
                if (elTitle) elTitle.textContent = '훈련일지 작성';
                var elContent = document.getElementById('logContent');
                if (elContent) elContent.value = '';
                ['logAttPresent', 'logAttAbsent', 'logAttLate', 'logAttEarly',
                 'logInstructions', 'logListLate', 'logListAbsent', 'logListEarly', 'logListPublic', 'logListUnder50', 'logListLateEarly'].forEach(function(id) {
                    var el = document.getElementById(id);
                    if (el) el.value = '';
                });
                loadDailySchedule(false);
            }).catch(function(err) {
                console.error('onTrainingDateChange', err);
                loadDailySchedule(false);
            });
        }

        async function findExistingLogForDate(dateStr) {
            var d = normalizeTrainingDateClient(dateStr);
            if (!d) return null;

            var cached = window.lastTrainingLogs || [];
            for (var i = 0; i < cached.length; i++) {
                if (cached[i] && normalizeTrainingDateClient(cached[i].date) === d && cached[i].id) {
                    return cached[i];
                }
            }

            var listCourseId = pathCourseId || courseId || sessionId;
            if (!listCourseId) return null;
            var url = '/api/hrd/training-logs?courseId=' + encodeURIComponent(listCourseId)
                + '&page=1&limit=50'
                + '&startDate=' + encodeURIComponent(d)
                + '&endDate=' + encodeURIComponent(d);
            var sid = sessionId || courseId;
            if (sid) url += '&session_id=' + encodeURIComponent(sid);

            try {
                var res = await fetch(url, { headers: { 'Authorization': 'Bearer ' + token } });
                var result = await res.json();
                if (result.success && Array.isArray(result.data)) {
                    for (var j = 0; j < result.data.length; j++) {
                        if (normalizeTrainingDateClient(result.data[j].date) === d && result.data[j].id) {
                            return result.data[j];
                        }
                    }
                }
            } catch (e) {
                console.error('findExistingLogForDate', e);
            }
            return null;
        }

        function normalizeTrainingDatesList(raw) {
            if (!raw) return [];
            if (Array.isArray(raw)) {
                return raw.map(function(d) { return String(d).substring(0, 10); }).filter(function(d) { return /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(d); });
            }
            if (typeof raw === 'string') {
                try {
                    var parsed = JSON.parse(raw);
                    if (Array.isArray(parsed)) return normalizeTrainingDatesList(parsed);
                } catch (e) {}
                if (raw.indexOf(',') >= 0) {
                    return raw.split(',').map(function(d) { return d.trim().substring(0, 10); }).filter(function(d) { return /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(d); });
                }
                if (/^[0-9]{4}-[0-9]{2}-[0-9]{2}/.test(raw)) return [raw.substring(0, 10)];
            }
            return [];
        }

        function mergeTrainingDateLists() {
            var merged = {};
            for (var i = 0; i < arguments.length; i++) {
                var list = arguments[i] || [];
                for (var j = 0; j < list.length; j++) {
                    var d = String(list[j]).substring(0, 10);
                    if (/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(d)) merged[d] = true;
                }
            }
            return Object.keys(merged).sort();
        }

        function generateClientTrainingDates(meta) {
            if (!meta) return [];
            var start = normalizeTrainingDateClient(meta.training_start_date || meta.start_date);
            var end = normalizeTrainingDateClient(meta.training_end_date || meta.end_date);
            if (!start || !end) return [];
            var dayMap = {
                '일': 0, '월': 1, '화': 2, '수': 3, '목': 4, '금': 5, '토': 6,
                '일요일': 0, '월요일': 1, '화요일': 2, '수요일': 3, '목요일': 4, '금요일': 5, '토요일': 6,
                'sun': 0, 'mon': 1, 'tue': 2, 'wed': 3, 'thu': 4, 'fri': 5, 'sat': 6
            };
            var allowed = [];
            var dows = (meta.days_of_week || '').split(/[,/|]/);
            for (var i = 0; i < dows.length; i++) {
                var key = dows[i].trim();
                var mapped = dayMap[key] !== undefined ? dayMap[key] : dayMap[key.toLowerCase()];
                if (mapped !== undefined) allowed.push(mapped);
            }
            if (allowed.length === 0 && meta.session_name && /주말/.test(String(meta.session_name))) {
                allowed = [0, 6];
            }
            if (allowed.length === 0) allowed = [1, 2, 3, 4, 5];
            var partsS = start.split('-');
            var partsE = end.split('-');
            if (partsS.length !== 3 || partsE.length !== 3) return [];
            var cur = new Date(parseInt(partsS[0], 10), parseInt(partsS[1], 10) - 1, parseInt(partsS[2], 10));
            var endD = new Date(parseInt(partsE[0], 10), parseInt(partsE[1], 10) - 1, parseInt(partsE[2], 10));
            var out = [];
            while (cur <= endD) {
                if (allowed.indexOf(cur.getDay()) >= 0) {
                    var y = cur.getFullYear();
                    var m = String(cur.getMonth() + 1).padStart(2, '0');
                    var dd = String(cur.getDate()).padStart(2, '0');
                    out.push(y + '-' + m + '-' + dd);
                }
                cur.setDate(cur.getDate() + 1);
            }
            return out;
        }

        async function resolveSessionContext() {
            if (!pathCourseId) return null;
            var apiUrl = '/api/courses/' + pathCourseId + '?type=hrd';
            if (sessionIdFromQuery) apiUrl += '&session_id=' + encodeURIComponent(sessionIdFromQuery);
            var res = await fetch(apiUrl, { headers: { 'Authorization': 'Bearer ' + token } });
            var result = await res.json();
            if (result.success && result.data && result.data.id) {
                sessionId = Number(result.data.id);
                courseId = sessionId;
                window.hrdSessionMeta = {
                    id: sessionId,
                    training_start_date: result.data.training_start_date || result.data.start_date,
                    training_end_date: result.data.training_end_date || result.data.end_date,
                    days_of_week: result.data.days_of_week,
                    session_name: result.data.session_name
                };
                var dh = result.data.daily_hours;
                if (dh != null && Number(dh) > 0) {
                    globalDailyHours = Number(dh);
                    var elH = document.getElementById('logHours');
                    if (elH) elH.value = globalDailyHours;
                }
                return result.data;
            }
            return null;
        }

        document.addEventListener('DOMContentLoaded', async function() {
            try {
                if (pathCourseId) {
                   await resolveSessionContext();
                   await loadTrainingLogDates();
                }
            } catch(e) {}

            var logDateSelect = document.getElementById('logDateSelect');
            var logDateInput = document.getElementById('logDate');
            if (logDateSelect) logDateSelect.addEventListener('change', onTrainingDateChange);
            if (logDateInput) logDateInput.addEventListener('change', onTrainingDateChange);

            try {
                var personnelRes = await fetch('/api/hrd/personnel', { headers: { 'Authorization': 'Bearer ' + token } });
                var personnelJson = await personnelRes.json();
                if (personnelJson.success && Array.isArray(personnelJson.data)) {
                    instructorList = (personnelJson.data || []).filter(function(p) { return p && (p.id || p.user_id); }).map(function(p) {
                        return { id: p.id || p.user_id, name: (p.name || '').trim() || ('ID ' + (p.id || p.user_id)) };
                    });
                }
            } catch (e) { console.error('personnel load', e); }

            loadLogs();
            loadAssignedUnits();
        });

        async function loadAssignedUnits() {
            try {
                const res = await fetch('/api/ncs/courses/' + courseId);
                const result = await res.json();
                if (result.success) {
                    assignedUnits = result.data;
                    const select = document.getElementById('logNcsUnitId');
                    if (select) {
                        assignedUnits.forEach(u => {
                            const opt = document.createElement('option');
                            opt.value = u.ncs_unit_id;
                            opt.textContent = '[' + u.code + '] ' + u.name;
                            select.appendChild(opt);
                        });
                    }
                }
            } catch (e) { console.error(e); }
        }

        const unitSelect = document.getElementById('logNcsUnitId');
        if (unitSelect) {
            unitSelect.addEventListener('change', async (e) => {
                const unitId = e.target.value;
                const picker = document.getElementById('elementsPicker');
                const container = document.getElementById('elementCheckboxes');
                
                if (!unitId || !picker || !container) {
                    if (picker) picker.classList.add('hidden');
                    return;
                }

                try {
                    const res = await fetch('/api/ncs/units/' + unitId + '/elements', {
headers: { 'Authorization': 'Bearer ' + token }
                    });
const result = await res.json();
if (result.success && result.data.length > 0) {
    picker.classList.remove('hidden');
    container.innerHTML = result.data.map(el => 
                            '<label class="flex items-center gap-3 p-2.5 hover:bg-indigo-50/50 rounded-xl cursor-pointer transition-all border border-transparent hover:border-indigo-100 group">' +
                                '<input type="checkbox" name="ncs_element" value="' + el.id + '" class="w-5 h-5 text-indigo-600 rounded-lg border-gray-200 focus:ring-indigo-500 transition-all">' +
                                '<div class="text-sm">' +
                                    '<span class="font-black text-indigo-300 mr-2 uppercase tracking-tighter group-hover:text-indigo-500 transition-all font-mono">' + el.code + '</span>' +
                                    '<span class="text-gray-600 font-bold group-hover:text-indigo-900 transition-all">' + el.name + '</span>' +
                                '</div>' +
                            '</label>'
                        ).join('');
} else {
    picker.classList.add('hidden');
}
                } catch (e) { console.error(e); }
            });
        }

async function loadLogs(page = 1) {
    currentPage = page;
    var tbody = document.getElementById('logTableBody');
    var groupedWrap = document.getElementById('logGroupedCardsWrap');
    if (tbody) tbody.innerHTML = '<tr><td colspan="5" class="px-6 py-24 text-center text-gray-400 font-medium whitespace-pre-line border-dashed border-2 m-4 rounded-3xl bg-gray-50/50">로딩 중...</td></tr>';
    if (groupedWrap) groupedWrap.innerHTML = '<div class="text-center py-16 text-gray-400 text-sm font-bold">로딩 중...</div>';

    // 저장과 동일하게 LMS 과정 ID + session_id로 조회 (회차 PK만 쓰면 저장본이 안 보임)
    var listCourseId = pathCourseId || courseId || sessionId;
    if (!listCourseId) {
        if (tbody) tbody.innerHTML = '<tr><td colspan="5" class="px-6 py-16 text-center text-rose-400 font-medium">과정 정보가 없습니다. 페이지를 새로고침해 주세요.</td></tr>';
        return;
    }
    var listUrl = '/api/hrd/training-logs?courseId=' + encodeURIComponent(listCourseId) + '&page=' + page + '&limit=10';
    var listSessionId = sessionId || courseId;
    if (listSessionId) listUrl += '&session_id=' + encodeURIComponent(listSessionId);
    var fs = document.getElementById('logFilterStart');
    var fe = document.getElementById('logFilterEnd');
    var sVal = (fs && fs.value) ? String(fs.value).trim() : '';
    var eVal = (fe && fe.value) ? String(fe.value).trim() : '';
    if (sVal || eVal) {
        var s = sVal || eVal;
        var e = eVal || sVal;
        if (s > e) { var tmp = s; s = e; e = tmp; }
        listUrl += '&startDate=' + encodeURIComponent(s) + '&endDate=' + encodeURIComponent(e);
    }

    try {
        const res = await fetch(listUrl, {
            headers: { 'Authorization': 'Bearer ' + token }
        });
        const result = await res.json();
        if (result.success) {
            if (result.assignedDailyHours != null && result.assignedDailyHours > 0) {
                assignedHoursFromApi = Number(result.assignedDailyHours);
                globalDailyHours = assignedHoursFromApi;
            } else {
                assignedHoursFromApi = null;
                if (courseId) {
                    try {
                        var courseRes = await fetch('/api/courses/' + pathCourseId + '?type=hrd&session_id=' + encodeURIComponent(courseId), { headers: { 'Authorization': 'Bearer ' + token } });
                        var courseJson = await courseRes.json();
                        if (courseJson.success && courseJson.data && courseJson.data.daily_hours != null && Number(courseJson.data.daily_hours) > 0) {
                            var dh = Number(courseJson.data.daily_hours);
                            assignedHoursFromApi = dh;
                            globalDailyHours = dh;
                        }
                    } catch (e) { }
                }
            }
            const logs = result.pagination ? result.data : result.data;
            window.lastTrainingLogs = logs || [];
            renderLogs(window.lastTrainingLogs);
            if (result.pagination) {
                renderPagination(result.pagination);
            }
            calculateNcsProgress();
        }
    } catch (e) { console.error(e); }
}

function renderPagination(pagination) {
    const container = document.getElementById('paginationControls');
    if (!container) return;
    if (!pagination || pagination.totalPages <= 1) {
        container.innerHTML = '';
        return;
    }
    let html = '';
    let startPage = Math.max(1, pagination.page - 2);
    let endPage = Math.min(pagination.totalPages, startPage + 4);
    if (endPage - startPage < 4) startPage = Math.max(1, endPage - 4);

    html += '<button onclick="loadLogs(' + Math.max(1, pagination.page - 1) + ')" ' + (pagination.page === 1 ? 'disabled' : '') + ' class="w-10 h-10 flex items-center justify-center rounded-xl ' + (pagination.page === 1 ? 'text-gray-200 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50 hover:text-indigo-600') + ' transition-all active:scale-90"><i class="fas fa-chevron-left text-[11px]"></i></button>';
    for (let i = startPage; i <= endPage; i++) {
        html += '<button onclick="loadLogs(' + i + ')" class="w-10 h-10 flex items-center justify-center rounded-xl text-xs font-black transition-all ' + (pagination.page === i ? 'bg-indigo-600 text-white shadow-md active:scale-95' : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600') + '">' + i + '</button>';
    }
    html += '<button onclick="loadLogs(' + Math.min(pagination.totalPages, pagination.page + 1) + ')" ' + (pagination.page === pagination.totalPages ? 'disabled' : '') + ' class="w-10 h-10 flex items-center justify-center rounded-xl ' + (pagination.page === pagination.totalPages ? 'text-gray-200 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50 hover:text-indigo-600') + ' transition-all active:scale-90"><i class="fas fa-chevron-right text-[11px]"></i></button>';

    container.innerHTML = html;
}

function parseScheduleDetails(log) {
    if (!log || !log.schedule_details_json) return [];
    try {
        var sch = typeof log.schedule_details_json === 'string' ? JSON.parse(log.schedule_details_json) : log.schedule_details_json;
        return Array.isArray(sch) ? sch : [];
    } catch (e) { return []; }
}

function renderLogs(logs) {
    var mode = window.trainingLogsViewMode || 'simple';
    var tbody = document.getElementById('logTableBody');
    var groupedWrap = document.getElementById('logGroupedCardsWrap');
    if (mode === 'grouped') {
        if (tbody) tbody.innerHTML = '';
        renderLogsGrouped(logs);
    } else {
        if (groupedWrap) groupedWrap.innerHTML = '';
        renderLogsSimple(logs);
    }
}

function renderLogsSimple(logs) {
    var tbody = document.getElementById('logTableBody');
    if (!tbody) return;
    if (!logs || logs.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="px-6 py-24 text-center text-gray-400 font-medium whitespace-pre-line border-dashed border-2 m-4 rounded-3xl bg-gray-50/50">등록된 훈련일지가 없습니다.\\n새로운 일지를 작성해보세요.</td></tr>';
        return;
    }
    var html = '';
    for (var i = 0; i < logs.length; i++) {
        var log = logs[i];
        var tTopic = log.topic;
        var tContent = log.content;

        try {
            if (log.schedule_details_json) {
                var sch = typeof log.schedule_details_json === 'string' ? JSON.parse(log.schedule_details_json) : log.schedule_details_json;
                var p1 = sch.find(function (s) { return s.period == 1 || s.period === '1'; });
                if (p1) {
                    if (!tTopic || tTopic === '-') tTopic = p1.subject;
                    if (p1.content) tContent = p1.content;
                }
            }
        } catch (e) { }

        var topic = (tTopic || '-').replace(/</g, '&lt;').replace(/"/g, '&quot;');
        var content = (tContent || '-').replace(/</g, '&lt;').replace(/"/g, '&quot;');
        var instructorDisplay = (log.instructor_name || '미상').replace(/</g, '&lt;').replace(/"/g, '&quot;');
        var savedHours = (log.training_hours != null && log.training_hours !== '' && Number(log.training_hours) >= 0) ? (typeof log.training_hours === 'number' ? log.training_hours : parseFloat(log.training_hours)) : null;
        var displayHoursText = (savedHours != null && !isNaN(savedHours)) ? savedHours + 'h' : '-';
        html += '<tr class="hover:bg-indigo-50/30 transition-all duration-200 group border-b border-gray-50 last:border-0 shadow-[inset_0_1px_0_0_rgba(255,255,255,1)]">' +
            '<td class="px-6 py-5 whitespace-nowrap text-[11px] font-black text-indigo-300 uppercase tracking-widest">' + (log.date || '') + '</td>' +
            '<td class="px-6 py-5"><div class="font-black text-gray-800 mb-1 group-hover:text-indigo-600 transition-colors uppercase tracking-tight">' + topic + '</div>' +
            '<div class="text-xs text-gray-400 truncate max-w-lg font-medium leading-relaxed italic opacity-80 group-hover:opacity-100 transition-all">' + content + '</div></td>' +
            '<td class="px-6 py-5 text-center font-bold text-slate-600 text-sm">' + instructorDisplay + '</td>' +
            '<td class="px-6 py-5 text-center font-black text-slate-700 text-sm">' + displayHoursText + '</td>' +
            '<td class="px-6 py-5 text-right"><div class="flex items-center justify-end gap-2.5 transition-all">' +
            '<button onclick="printLog(' + log.id + ')" class="w-9 h-9 flex items-center justify-center bg-white border border-gray-100 text-slate-400 hover:text-gray-700 hover:border-gray-300 hover:shadow-md transition-all rounded-xl active:scale-90"><i class="fas fa-print text-xs"></i></button>' +
            '<button onclick="editLog(' + log.id + ')" class="w-9 h-9 flex items-center justify-center bg-white border border-gray-100 text-slate-400 hover:text-indigo-600 hover:border-indigo-100 hover:shadow-md transition-all rounded-xl active:scale-90"><i class="fas fa-edit text-xs"></i></button>' +
            '<button onclick="deleteLog(' + log.id + ')" class="w-9 h-9 flex items-center justify-center bg-white border border-gray-100 text-slate-400 hover:text-rose-500 hover:border-rose-100 hover:shadow-md transition-all rounded-xl active:scale-90"><i class="fas fa-trash-alt text-xs"></i></button>' +
            '</div></td></tr>';
    }
    tbody.innerHTML = html;
}

function renderLogsGrouped(logs) {
    var groupedWrap = document.getElementById('logGroupedCardsWrap');
    if (!groupedWrap) return;
    if (!logs || logs.length === 0) {
        groupedWrap.innerHTML = '<div class="rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/50 py-20 text-center text-gray-400 text-sm font-medium whitespace-pre-line">등록된 훈련일지가 없습니다.\\n기간을 바꾸거나 새 일지를 작성해 보세요.</div>';
        return;
    }

    var sorted = logs.slice().sort(function (a, b) {
        var da = (a.date || '').toString();
        var db = (b.date || '').toString();
        if (da < db) return 1;
        if (da > db) return -1;
        return 0;
    });

    var cards = '';
    for (var i = 0; i < sorted.length; i++) {
        var log = sorted[i];
        var details = parseScheduleDetails(log);
        var byPeriod = {};
        for (var j = 0; j < details.length; j++) {
            var d = details[j];
            var p = parseInt(d.period, 10);
            if (!isNaN(p) && p >= 1 && p <= 8) byPeriod[p] = d;
        }

        var savedHours = (log.training_hours != null && log.training_hours !== '' && Number(log.training_hours) >= 0) ? (typeof log.training_hours === 'number' ? log.training_hours : parseFloat(log.training_hours)) : null;
        var displayHoursText = (savedHours != null && !isNaN(savedHours)) ? savedHours + 'h' : '-';
        var instructorDisplay = escapeHtmlAttr(log.instructor_name || '미상');
        var dateLabel = formatLogDateLabel(log.date);

        var subRows = '';
        for (var pnum = 1; pnum <= 8; pnum++) {
            var row = byPeriod[pnum];
            var subj = row && row.subject ? String(row.subject) : '';
            var inst = row && row.instructor ? String(row.instructor) : '';
            var cont = row && row.content ? String(row.content) : '';
            var note = row && row.note ? String(row.note) : '';
            if (!subj.trim() && !inst.trim() && !cont.trim() && !note.trim()) continue;
            subRows += '<tr class="border-b border-gray-100 last:border-0">' +
                '<td class="py-2.5 pr-3 text-[10px] font-black text-indigo-400 whitespace-nowrap align-top w-14">' + pnum + '교시</td>' +
                '<td class="py-2.5 px-2 text-xs font-bold text-gray-800 align-top min-w-[6rem]">' + escapeHtmlAttr(subj) + '</td>' +
                '<td class="py-2.5 px-2 text-xs text-gray-600 align-top whitespace-nowrap">' + escapeHtmlAttr(inst) + '</td>' +
                '<td class="py-2.5 pl-2 text-xs text-gray-600 align-top">' + escapeHtmlAttr(cont) + '</td>' +
                '<td class="py-2.5 pl-2 text-xs text-gray-400 align-top max-w-[8rem] truncate" title="' + escapeHtmlAttr(note) + '">' + escapeHtmlAttr(note) + '</td>' +
                '</tr>';
        }
        if (!subRows) {
            var tTopic = log.topic || '-';
            var tContent = log.content || '-';
            subRows = '<tr class="border-b border-gray-100"><td colspan="5" class="py-3 text-xs text-gray-500 italic">교시별 상세 없음 — 요약: ' + escapeHtmlAttr(tTopic) + ' / ' + escapeHtmlAttr(tContent.length > 120 ? tContent.substring(0, 120) + '…' : tContent) + '</td></tr>';
        }

        cards += '<div class="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">' +
            '<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-5 py-4 bg-gradient-to-r from-indigo-50/80 to-white border-b border-gray-100">' +
            '<div>' +
            '<div class="text-lg font-black text-gray-900 tracking-tight">' + escapeHtmlAttr(dateLabel) + '</div>' +
            '<div class="text-xs font-bold text-gray-500 mt-0.5">작성자 <span class="text-gray-800">' + instructorDisplay + '</span> · 훈련시간 <span class="text-indigo-700">' + displayHoursText + '</span></div>' +
            '</div>' +
            '<div class="flex items-center gap-2 shrink-0">' +
            '<button type="button" onclick="printLog(' + log.id + ')" class="px-3 py-2 rounded-xl border border-gray-200 bg-white text-xs font-black text-gray-600 hover:bg-gray-50 transition"><i class="fas fa-print mr-1"></i>인쇄</button>' +
            '<button type="button" onclick="editLog(' + log.id + ')" class="px-3 py-2 rounded-xl bg-indigo-600 text-white text-xs font-black hover:bg-indigo-700 transition"><i class="fas fa-edit mr-1"></i>수정</button>' +
            '<button type="button" onclick="deleteLog(' + log.id + ')" class="px-3 py-2 rounded-xl border border-rose-100 bg-rose-50 text-xs font-black text-rose-600 hover:bg-rose-100 transition"><i class="fas fa-trash-alt mr-1"></i>삭제</button>' +
            '</div></div>' +
            '<div class="overflow-x-auto px-3 sm:px-5 pb-4">' +
            '<table class="w-full text-left min-w-[520px]">' +
            '<thead><tr class="text-[10px] font-black text-gray-400 uppercase tracking-wider border-b border-gray-200">' +
            '<th class="py-2 w-14">교시</th><th class="py-2 px-2">훈련과목</th><th class="py-2 px-2">담당</th><th class="py-2 pl-2">훈련 내용</th><th class="py-2 pl-2 w-28">비고</th>' +
            '</tr></thead><tbody>' + subRows + '</tbody></table></div></div>';
    }
    groupedWrap.innerHTML = cards;
}

async function printLog(id) {
    try {
        // Fetch Data: Log, Session, Enrollments(실데이터), All Logs for day count
        // 훈련일 = log.date(실제 일지 저장일), 재적 = 해당 회차(courseId) 승인 수강생 수
        const [logRes, sessionRes, enrollRes, allLogsRes] = await Promise.all([
            fetch('/api/hrd/training-logs/' + id, { headers: { 'Authorization': 'Bearer ' + token } }).then(r => r.json()),
            fetch('/api/course-sessions/' + courseId, { headers: { 'Authorization': 'Bearer ' + token } }).then(r => r.json()),
            fetch('/api/enrollments?course_id=' + courseId + '&type=hrd&limit=500', { headers: { 'Authorization': 'Bearer ' + token } }).then(r => r.json()),
            fetch('/api/hrd/training-logs?courseId=' + encodeURIComponent(pathCourseId || courseId) + (sessionId || courseId ? '&session_id=' + encodeURIComponent(sessionId || courseId) : ''), { headers: { 'Authorization': 'Bearer ' + token } }).then(r => r.json())
        ]);

        if (!logRes.success) throw new Error(logRes.error || '일지 로드 실패');

        const log = logRes.data;
        const session = sessionRes.success ? sessionRes.data : { course_name: '-', session_number: '', total_hours: 0, daily_hours: 0 };
        const enrollCount = (enrollRes.success && enrollRes.data != null)
            ? (enrollRes.pagination && typeof enrollRes.pagination.total === 'number' ? enrollRes.pagination.total : enrollRes.data.length)
            : 0;

        // Calculate Day Count (Nth day / Total days)
        let currentDayCount = 1;
        let totalDays = 0;

        if (allLogsRes.success && Array.isArray(allLogsRes.data)) {
            // Sort logs by date ascending
            const sortedLogs = allLogsRes.data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
            const index = sortedLogs.findIndex(l => l.id === log.id);
            if (index !== -1) currentDayCount = index + 1;
        }

        if (session.total_hours && session.daily_hours) {
            totalDays = Math.ceil(parseFloat(session.total_hours) / parseFloat(session.daily_hours));
        } else if (session.training_start_date && session.training_end_date) {
            // Fallback to date diff if hours are missing (though inaccurate for weekdays)
            const start = new Date(session.training_start_date);
            const end = new Date(session.training_end_date);
            const diffTime = Math.abs(end - start);
            totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        }

        const scheduleDetails = log.schedule_details_json ? JSON.parse(log.schedule_details_json) : [];
        const attendance = log.attendance_summary_json ? JSON.parse(log.attendance_summary_json) : { 
            present: '', absent: '', late: '', early: '', 
            instructions: '', late_list: '', absent_list: '', early_list: '', public_list: '' 
        };
        const days = ['일', '월', '화', '수', '목', '금', '토'];
        const dayName = days[new Date(log.date).getDay()];

        // 훈련기관명: 설정에서 조회 (신규 설정 시 프린트에도 반영)
        let institutionName = '쓰리디쿠키 홍대센터(3D쿠키 홍대센터)';
        try {
            const instRes = await fetch('/api/settings/institution_name', { headers: { 'Authorization': 'Bearer ' + token } }).then(r => r.json());
            if (instRes.success && instRes.data) institutionName = instRes.data;
        } catch (e) {}

        // Schedule Rows
        let scheduleRows = '';
        for (let i = 1; i <= 8; i++) {
            const sch = scheduleDetails.find(s => s.period === i);
            scheduleRows += \`
                        <tr>
                            <td class="border border-black p-2 h-10 text-center">\${i}</td>
                            <td class="border border-black p-2 text-center font-bold text-sm">\${sch ? (sch.subject || '') : ''}</td>
                            <td class="border border-black p-2 text-center font-bold text-sm">\${sch ? (sch.instructor || '') : ''}</td>
                            <td class="border border-black p-2 text-left px-3 text-sm">\${sch ? (sch.content || '') : ''}</td>
                            <td class="border border-black p-2 text-center text-sm">\${sch ? (sch.note || '') : ''}</td>
                        </tr>
                    \`;
                }

                const popup = window.open('', '_blank', 'width=1100,height=1200,scrollbars=yes');
                if(!popup) { alert('팝업 차단을 해제해주세요.'); return; }

                const htmlContent = \`
                    <!DOCTYPE html>
                    <html lang="ko">
                    <head>
                        <meta charset="UTF-8">
                        <title>훈련일지 인쇄</title>
                        <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
                        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700;900&display=swap" rel="stylesheet">
                        <style>
                            @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700;900&display=swap');
                            * { box-sizing: border-box; }
                            body { font-family: "Noto Sans KR", sans-serif; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; margin: 0; padding: 0; background-color: #f3f4f6; }
                            table { border-collapse: collapse; width: 100%; border-spacing: 0; table-layout: fixed; }
                            td, th { border: 1px solid #000; padding: 0; vertical-align: middle; word-break: break-all; }
                            .container { width: 210mm; background: white; margin: 30px auto; padding: 40px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); position: relative; }
                            
                            /* Header Area */
                            .header-area { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 20px; position: relative; height: 100px; }
                            .title { position: absolute; left: 0; right: 0; top: 30px; text-align: center; font-size: 32px; font-weight: 900; letter-spacing: 2px; }
                            
                            /* Approval Box */
                            .approval-box { width: 200px; border: 1px solid #000; margin-left: auto; position: relative; z-index: 10; font-size: 12px; }
                            .approval-box td { text-align: center; }
                            .approval-label-cell { width: 30px; background-color: #f9fafb; font-weight: bold; }
                            .approval-role-cell { height: 24px; background-color: #f9fafb; font-weight: bold; }
                            .approval-sign-cell { height: 60px; }
                            
                            /* Info Tables */
                            .info-table { margin-bottom: 10px; font-size: 13px; }
                            .info-table .label { background-color: #e5e7eb; font-weight: bold; text-align: center; width: 120px; padding: 8px; }
                            .info-table .value { padding: 8px 12px; text-align: center; font-weight: bold; }
                            .info-table .date-value { font-size: 13px; }
                            
                            /* Attendance Table */
                            .att-table { margin-bottom: 15px; font-size: 13px; }
                            .att-table .label { background-color: #e5e7eb; font-weight: bold; text-align: center; width: 80px; padding: 8px; }
                            .att-table .value { text-align: center; padding: 8px; font-weight: bold; }
                            
                            /* Schedule Table */
                            .schedule-main-header { background-color: #d1d5db; font-weight: bold; text-align: center; padding: 8px; border-bottom: none; font-size: 14px; }
                            .schedule-table { margin-bottom: 0; font-size: 12px; }
                            .schedule-table th { background-color: #e5e7eb; padding: 8px; text-align: center; font-weight: bold; }
                            .col-period { width: 50px; }
                            .col-subject { width: 180px; }
                            .col-instructor { width: 100px; }
                            .col-content { }
                            .col-note { width: 120px; }
                            
                            /* Footer Tables */
                            .footer-table { margin-top: -1px; font-size: 12px; }
                            .footer-label-main { background-color: #d1d5db; font-weight: bold; text-align: center; width: 100px; }
                            .footer-label-sub { background-color: #e5e7eb; font-weight: bold; text-align: center; width: 100px; }
                            .footer-content { padding: 5px 10px; text-align: left; }
                            
                            /* Print Control */
                            .print-controls { position: fixed; top: 0; left: 0; right: 0; background: rgba(0,0,0,0.8); padding: 15px; text-align: center; z-index: 9999; display: flex; justify-content: center; gap: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.3); }
                            .btn { padding: 8px 16px; border-radius: 4px; font-weight: bold; cursor: pointer; border: none; font-size: 14px; display: inline-flex; align-items: center; gap: 6px; color: white; transition: all 0.2s; }
                            .btn-blue { background-color: #3b82f6; }
                            .btn-blue:hover { background-color: #2563eb; }
                            .btn-orange { background-color: #f97316; }
                            .btn-orange:hover { background-color: #ea580c; }
                            .btn-gray { background-color: #6b7280; }
                            .btn-gray:hover { background-color: #4b5563; }
                            
                            @media print {
                                .print-controls { display: none !important; }
                                .no-print { display: none !important; }
                                #print-image-insert-area { border: none !important; padding: 0 !important; font-size: 0 !important; color: transparent !important; }
                                #print-image-insert-area img { display: block !important; }
                                body { background: white; -webkit-print-color-adjust: exact; }
                                .container { width: 100%; margin: 0; padding: 0; box-shadow: none; border: none; }
                                @page { margin: 10mm; size: A4 portrait; }
                            }
                        </style>
                    </head>
                    <body>
                        <script>window.LOG_ID = \${id};</scr\${''}ipt>
                        <div class="print-controls">
                            <button class="btn btn-blue" onclick="insertPrintImage()"><i class="fas fa-image"></i> 이미지 삽입</button>
                            <button class="btn btn-orange" onclick="window.print()"><i class="fas fa-print"></i> 프린트</button>
                            <button class="btn btn-gray" onclick="window.close()"><i class="fas fa-times"></i> 닫기</button>
                        </div>

                        <div class="container">
                            <div class="header-area">
                                <div class="title">훈 련 일 지</div>
                                <table class="approval-box">
                                    <tr>
                                        <td rowspan="2" class="approval-label-cell">결<br>재</td>
                                        <td class="approval-role-cell">담 당</td>
                                        <td class="approval-role-cell">원 장</td>
                                    </tr>
                                    <tr>
                                        <td class="approval-sign-cell">
                                            <!-- Placeholder for sign/stamp -->
                                            <i class="fas fa-camera text-gray-200 text-lg"></i>
                                        </td>
                                        <td class="approval-sign-cell">
                                            <i class="fas fa-camera text-gray-200 text-lg"></i>
                                        </td>
                                    </tr>
                                </table>
                            </div>

                            <table class="info-table">
                                <tr>
                                    <td class="label">훈련기관명</td>
                                    <td class="value" id="institution-name-display-footer">\${(institutionName || '').replace(/</g, '&lt;').replace(/"/g, '&quot;')}</td>
                                    <td class="label">훈련일</td>
                                    <td class="value date-value">\${log.date} \${dayName}요일<br><span style="font-weight:normal; font-size:12px;">총 훈련일 \${totalDays || 0}일 / 작성일 \${currentDayCount || 1}일차</span></td>
                                </tr>
                                <tr>
                                    <td class="label">훈련과정명</td>
                                    <td class="value">\${session.session_number ? session.session_number + '회차 ' : ''}\${session.course_name}</td>
                                    <td class="label">재적</td>
                                    <td class="value">\${enrollCount} 명</td>
                                </tr>
                            </table>

                            <table class="att-table">
                                <tr>
                                    <td class="label">출석</td>
                                    <td class="value">\${attendance.present || ''}</td>
                                    <td class="label">결석</td>
                                    <td class="value">\${attendance.absent || ''}</td>
                                    <td class="label">지각</td>
                                    <td class="value">\${attendance.late || ''}</td>
                                    <td class="label">조퇴</td>
                                    <td class="value">\${attendance.early || ''}</td>
                                </tr>
                            </table>

                            <table class="schedule-table" style="border-bottom:none;">
                                <tr>
                                    <td colspan="5" class="schedule-main-header">훈 련 사 항</td>
                                </tr>
                                <tr>
                                    <th class="col-period">교시</th>
                                    <th class="col-subject">훈련과목</th>
                                    <th class="col-instructor">담당교사</th>
                                    <th class="col-content">훈련 내용</th>
                                    <th class="col-note">비고<br>(불참자 등)</th>
                                </tr>
                                \${scheduleRows}
                            </table>
                            
                            <!-- Adding dummy rows if less than 8 periods? No, just sticking to 8 periods fixed loop as implemented -->
                            
                            <table class="footer-table">
                                <tr>
                                    <td class="footer-label-main">지시사항</td>
                                    <td colspan="2" class="footer-content" style="height: 60px;">\${attendance.instructions || ''}</td>
                                </tr>
                                <tr>
                                    <td rowspan="7" class="footer-label-main">특기<br>사항</td>
                                    <td class="footer-label-sub">지각자</td>
                                    <td class="footer-content" style="height: 30px;">\${attendance.late_list || '0명'}</td>
                                </tr>
                                <tr>
                                    <td class="footer-label-sub">결석자</td>
                                    <td class="footer-content" style="height: 30px;">\${attendance.absent_list || '0명'}</td>
                                </tr>
                                <tr>
                                    <td class="footer-label-sub">조퇴자</td>
                                    <td class="footer-content" style="height: 30px;">\${attendance.early_list || '0명'}</td>
                                </tr>
                                <tr>
                                    <td class="footer-label-sub">공결자</td>
                                    <td class="footer-content" style="height: 30px;">\${attendance.public_list || '0명'}</td>
                                </tr>
                                <tr>
                                    <td class="footer-label-sub">50%미만결석</td>
                                    <td class="footer-content" style="height: 30px;">\${attendance.under50_list || '0명'}</td>
                                </tr>
                                <tr>
                                    <td class="footer-label-sub">지각&조퇴</td>
                                    <td class="footer-content" style="height: 30px;">\${attendance.late_early_list || '0명'}</td>
                                </tr>
                                <tr>
                                    <td class="footer-label-sub">기타사항<br><span style="font-weight:normal; font-size:10px;">(전달사항, 외출자 등)</span></td>
                                    <td class="footer-content" style="height: 60px; vertical-align: top;">
                                        \${log.content || ''}
                                    </td>
                                </tr>
                            </table>
                            <div id="print-image-insert-area" style="min-height: 60px; margin-top: 15px; padding: 10px; border: 1px dashed #d1d5db; border-radius: 8px; font-size: 12px; color: #9ca3af;">이미지 삽입 영역 (위 &#39;이미지 삽입&#39; 버튼으로 추가)</div>

                            <div style="margin-top: 30px; text-align: center;" class="no-print">
                                <button class="btn btn-orange" style="margin-right: 10px;" onclick="if(window.opener && window.opener.editLog) { window.opener.editLog(window.LOG_ID); window.close(); }"><i class="fas fa-edit"></i> 문서수정</button>
                                <button class="btn" style="background-color: #ef4444;" onclick="if(confirm('이 훈련일지를 삭제하시겠습니까?')) { if(window.opener && window.opener.deleteLog) { window.opener.deleteLog(window.LOG_ID); window.close(); }"><i class="fas fa-trash-alt"></i> 문서삭제</button>
                            </div>
                        </div>
                        <script>
                        function insertPrintImage() {
                            var input = document.createElement('input');
                            input.type = 'file';
                            input.accept = 'image/*';
                            input.onchange = function() {
                                var f = this.files && this.files[0];
                                if (!f) return;
                                var r = new FileReader();
                                r.onload = function() {
                                    var div = document.getElementById('print-image-insert-area');
                                    if (div) {
                                        var img = document.createElement('img');
                                        img.src = r.result;
                                        img.style.maxWidth = '100%';
                                        img.style.maxHeight = '320px';
                                        img.style.display = 'block';
                                        img.style.marginTop = '8px';
                                        div.innerHTML = '';
                                        div.appendChild(img);
                                    }
                                };
                                r.readAsDataURL(f);
                            };
                            input.click();
                        }
                        </scr\${''}ipt>
                    </body>
                    </html>
                \`;
                
                popup.document.open();
                popup.document.write(htmlContent);
                popup.document.close();
            } catch(e) {
                console.error(e);
                alert('인쇄 오류: ' + e.message);
            }
        }

        async function deleteLog(id) {
            if (!confirm('정말로 이 일지를 삭제하시겠습니까?\\n관련 NCS 이수 시간도 함께 삭제됩니다.')) return;
            
            try {
                const res = await fetch(\`/api/hrd/training-logs/\${id}\`, {
                    method: 'DELETE',
                    headers: { 'Authorization': 'Bearer ' + token }
                });
                const result = await res.json();
                if (result.success) {
                    loadLogs(currentPage);
                    calculateNcsProgress();
                } else {
                    alert('삭제 실패: ' + result.error);
                }
            } catch (e) {
                console.error(e);
                alert('오류가 발생했습니다.');
            }
        }
        
        window.printLog = printLog;
        window.deleteLog = deleteLog;
        window.openLogModal = openLogModal;
        window.closeLogModal = closeLogModal;
        window.editLog = editLog;
        window.handleSaveLog = handleSaveLog;
        window.loadDailyAttendance = loadDailyAttendance;
        window.loadDailySchedule = loadDailySchedule;

        async function calculateNcsProgress() {
            try {
                const res = await fetch(\`/api/hrd/courses/\${courseId}/ncs-summary\`, {
                    headers: { 'Authorization': 'Bearer ' + token }
                });
                const result = await res.json();
                const container = document.getElementById('ncsProgress');
                if (!container) return;
                
                if (result.success && result.data.length > 0) {
                    container.innerHTML = result.data.map(item => {
                        const percent = item.target_hours > 0 ? (item.current_hours / item.target_hours * 100) : 0;
                        const limitedPercent = Math.min(percent, 100);
                        const isComplete = percent >= 100;
                        
                        return \`
                            <div class="p-4 bg-white rounded-2xl border border-slate-100 hover:border-indigo-100 hover:shadow-md transition-all duration-300 group">
                                <div class="flex justify-between items-start mb-2">
                                    <div class="flex flex-col">
                                        <span class="text-[10px] font-black text-slate-400 uppercase tracking-tighter italic">\${item.unit_code}</span>
                                        <span class="text-xs font-black text-slate-700 truncate max-w-[120px] transition-colors group-hover:text-indigo-600 uppercase tracking-tight">\${item.unit_name}</span>
                                    </div>
                                    <div class="flex flex-col items-end">
                                        <span class="text-[10px] font-black \${isComplete ? 'text-emerald-500' : 'text-indigo-500' }">\${item.current_hours} / \${item.target_hours}h</span>
                                        <span class="text-[10px] font-black text-slate-300 group-hover:text-indigo-300 transition-all font-mono italic">\${percent.toFixed(0)}%</span>
                                    </div>
                                </div>
                                <div class="w-full bg-slate-100/80 rounded-full h-1.5 overflow-hidden shadow-inner ring-1 ring-slate-50">
                                    <div class="h-full transition-all duration-1000 ease-out shadow-[0_0_12px_rgba(99,102,241,0.4)] \${isComplete ? 'bg-emerald-500' : 'bg-indigo-500'}" style="width: \${limitedPercent}%"></div>
                                </div>
                            </div>
                        \`;
                    }).join('');
                } else {
                    container.innerHTML = '<div class="text-center text-slate-400 py-10 text-xs font-bold border-2 border-dashed border-slate-100 rounded-3xl bg-slate-50/50 uppercase tracking-widest opacity-60">NCS 배정 정보 없음</div>';
                }
            } catch (e) {
                console.error(e);
                const container = document.getElementById('ncsProgress');
                if (container) container.innerHTML = '<div class="text-center text-rose-400 py-4 text-xs font-bold uppercase tracking-widest ring-1 ring-rose-50 rounded-xl bg-rose-50/10">데이터 로드 실패</div>';
            }
        }


        // --------------------------------------------------------------------------------------------------------------------------------
        // Schedule Functions (New)
        // --------------------------------------------------------------------------------------------------------------------------------
        // --------------------------------------------------------------------------------------------------------------------------------
        async function loadDailySchedule(preserveExisting) {
            var dateVal = syncLogDateFromUi() || normalizeTrainingDateClient(readRawTrainingLogDate());
            if (!dateVal) {
                try {
                    if (pathCourseId) {
                        await resolveSessionContext();
                        var datesReload = await loadTrainingLogDates();
                        if (datesReload && datesReload.length > 0) {
                            populateTrainingDateSelect(datesReload, window.selectedTrainingLogDate || null);
                        } else {
                            // 목록이 비어도 날짜 입력 UI는 반드시 표시
                            populateTrainingDateSelect([], window.selectedTrainingLogDate || null);
                        }
                        dateVal = syncLogDateFromUi() || normalizeTrainingDateClient(readRawTrainingLogDate());
                    }
                } catch (e) {
                    console.error('schedule date resolve failed', e);
                }
            }
            if (!courseId && (sessionId || pathCourseId)) {
                try { await resolveSessionContext(); } catch (e) {}
            }
            if (!dateVal) {
                showToast('먼저 훈련일을 선택해 주세요.', 'warn');
                return;
            }
            if (!courseId) {
                showToast('과정 정보를 불러오지 못했습니다. 페이지를 새로고침해 주세요.', 'warn');
                return;
            }
            window.selectedTrainingLogDate = dateVal;
            
            const existingData = [];
            if (preserveExisting) {
                for (let i = 1; i <= 8; i++) {
                    const subj = document.querySelector('input[name="sch_subject_' + i + '"]');
                    const inst = document.querySelector('input[name="sch_instructor_' + i + '"]');
                    const cont = document.querySelector('input[name="sch_content_' + i + '"]');
                    const note = document.querySelector('input[name="sch_note_' + i + '"]');
                    if (subj || inst || cont || note) {
                        existingData.push({
                            period: i,
                            subject: subj ? subj.value : '',
                            instructor: inst ? inst.value : '',
                            content: cont ? cont.value : '',
                            note: note ? note.value : ''
                        });
                    }
                }
            }
            
            const tbody = document.getElementById('scheduleTableBody');
            if(tbody) tbody.innerHTML = '<tr><td colspan="5" class="py-10 text-center text-gray-400 font-bold animate-pulse">시간표 불러오는 중...</td></tr>';

            try {
                const scheduleCourseId = pathCourseId || courseId;
                const scheduleSessionId = sessionId || courseId;
                const res = await fetch('/api/hrd/training-logs/daily-schedule?courseId=' + encodeURIComponent(scheduleCourseId) + '&session_id=' + encodeURIComponent(scheduleSessionId) + '&date=' + encodeURIComponent(dateVal), {
                     headers: { 'Authorization': 'Bearer ' + token }
                });
                const result = await res.json();
                if (result.success) {
                    renderScheduleTable(result.data, preserveExisting && existingData.length > 0 ? existingData : null);
                    showToast('시간표를 불러왔습니다. (' + dateVal + ')', 'success');
                } else {
                     if(tbody) tbody.innerHTML = '<tr><td colspan="5" class="py-10 text-center text-rose-400 font-bold">시간표 조회 실패</td></tr>';
                     setTimeout(function() { renderScheduleTable(null, preserveExisting && existingData.length > 0 ? existingData : null); }, 1000);
                     showToast((result && result.error) ? result.error : '시간표 조회에 실패했습니다.', 'error');
                }
            } catch (e) {
                console.error(e);
                if(tbody) tbody.innerHTML = '<tr><td colspan="5" class="py-10 text-center text-rose-400 font-bold">오류 발생</td></tr>';
                setTimeout(function() { renderScheduleTable(null, preserveExisting && existingData.length > 0 ? existingData : null); }, 1000);
                showToast('시간표 불러오기 중 오류가 발생했습니다.', 'error');
            }
        }

        async function loadDailyAttendance() {
            var dateVal = syncLogDateFromUi() || normalizeTrainingDateClient(readRawTrainingLogDate());
            if (!dateVal) {
                // 훈련일 목록이 아직 안 채워진 경우 재로드 후 기본일 사용
                try {
                    if (pathCourseId) {
                        await resolveSessionContext();
                        var datesReload = await loadTrainingLogDates();
                        if (datesReload && datesReload.length > 0) {
                            populateTrainingDateSelect(datesReload, window.selectedTrainingLogDate || null);
                        } else {
                            populateTrainingDateSelect([], window.selectedTrainingLogDate || null);
                        }
                        dateVal = syncLogDateFromUi() || normalizeTrainingDateClient(readRawTrainingLogDate());
                    }
                } catch (e) {
                    console.error('attendance date resolve failed', e);
                }
            }
            // 최종 강제 재읽기
            if (!dateVal) {
                var dateEl = document.getElementById('logDate');
                var selEl = document.getElementById('logDateSelect');
                dateVal = normalizeTrainingDateClient(
                    (dateEl && dateEl.value) ||
                    (selEl && selEl.value) ||
                    window.selectedTrainingLogDate ||
                    ''
                );
            }
            if (!courseId && (sessionId || pathCourseId)) {
                try { await resolveSessionContext(); } catch (e) {}
            }
            if (!dateVal) {
                console.warn('[loadDailyAttendance] no date', {
                    selected: window.selectedTrainingLogDate,
                    listed: window.trainingLogDates,
                    select: (document.getElementById('logDateSelect') || {}).value,
                    logDate: (document.getElementById('logDate') || {}).value,
                    pathCourseId: pathCourseId,
                    courseId: courseId,
                    sessionId: sessionId
                });
                showToast('먼저 훈련일을 선택해 주세요.', 'warn');
                return;
            }
            if (!courseId) {
                showToast('과정 정보를 불러오지 못했습니다. 페이지를 새로고침해 주세요.', 'warn');
                return;
            }
            window.selectedTrainingLogDate = dateVal;
            var hidSync = document.getElementById('logDate');
            if (hidSync) hidSync.value = dateVal;

            const btn = document.getElementById('btnLoadAttendance');
            const btnText = document.getElementById('btnLoadAttText');
            if (btn) btn.disabled = true;
            if (btnText) btnText.innerHTML = '<i class="fas fa-circle-notch fa-spin mr-1"></i> 불러오는 중...';
            
            try {
                // 훈련일지 페이지의 courseId는 HRD 회차 ID이므로 항상 type=hrd로 조회
                const res = await fetch('/api/courses/' + courseId + '/attendance?date=' + encodeURIComponent(dateVal) + '&type=hrd', {
                    headers: { 'Authorization': 'Bearer ' + token }
                });
                const result = await res.json();
                
                if (result.success && result.data) {
                    const isListedTrainingDay = isListedTrainingDate(dateVal);

                    // 훈련일지 모달: 드롭다운/일정에 있는 날짜는 과거일 포함 항상 작성 가능
                    window.notTrainingDay = !isListedTrainingDay && result.data.is_training_day === false;
                    const notTrainingNoticeEl = document.getElementById('logNotTrainingDayNotice');
                    if (notTrainingNoticeEl) {
                        notTrainingNoticeEl.classList.toggle('hidden', !window.notTrainingDay);
                    }
                    
                    // 훈련일·작성자·시간 등 핵심 입력은 비활성화하지 않음
                    const skipDisableIds = { logDate: true, logDateSelect: true, logAuthorId: true, logHours: true, btnLoadAttendance: true };
                    const formInputs = document.querySelectorAll('#logForm input, #logForm textarea, #logForm select, #logForm button');
                    formInputs.forEach(el => {
                        if (!el || !el.id) return;
                        if (skipDisableIds[el.id]) return;
                        if (el.getAttribute('onclick') && el.getAttribute('onclick').includes('closeLogModal')) return;
                        
                        if (window.notTrainingDay) {
                            el.disabled = true;
                            if (el.tagName === 'BUTTON') {
                                el.classList.add('opacity-50', 'cursor-not-allowed');
                            } else {
                                el.classList.add('bg-gray-50', 'cursor-not-allowed');
                            }
                        } else {
                            el.disabled = false;
                            if (el.tagName === 'BUTTON') {
                                el.classList.remove('opacity-50', 'cursor-not-allowed');
                            } else {
                                el.classList.remove('bg-gray-50', 'cursor-not-allowed');
                            }
                        }
                    });

                    const students = result.data.students || [];
                    
                    const enrollEl = document.getElementById('logEnrollCount');
                    if (enrollEl) {
                        enrollEl.textContent = students.length + ' 명';
                        enrollEl.classList.remove('text-gray-400', 'italic');
                        enrollEl.classList.add('text-indigo-700', 'font-black');
                    }
                    
                    let p = 0, a = 0, l = 0, e = 0, pu = 0, u50 = 0, le = 0;
                    let lateList = [], absentList = [], earlyList = [], publicList = [], under50List = [], lateEarlyList = [];
                    
                    students.forEach(s => {
                        const st = s.status || 'present';
                        if (st === 'present') {
                            p++;
                        } else if (st === 'absent') { a++; absentList.push(s.name); }
                        else if (st === 'late') { l++; lateList.push(s.name); }
                        else if (st === 'early_leave') { e++; earlyList.push(s.name); }
                        else if (st === 'public_leave') { pu++; publicList.push(s.name); }
                        else if (st === 'absent_under_50') { u50++; under50List.push(s.name); }
                        else if (st === 'late_and_early') { le++; lateEarlyList.push(s.name); }
                    });
                    
                    const elP = document.getElementById('logAttPresent'); if (elP) { elP.value = p; flashField(elP); }
                    const elA = document.getElementById('logAttAbsent'); if (elA) { elA.value = a + u50; flashField(elA); }
                    const elL = document.getElementById('logAttLate');   if (elL) { elL.value = l; flashField(elL); }
                    const elE = document.getElementById('logAttEarly');  if (elE) { elE.value = e; flashField(elE); }
                    
                    const lstL = document.getElementById('logListLate');   if (lstL) { lstL.value = lateList.length > 0 ? lateList.join(', ') : '0명'; flashField(lstL); }
                    const lstA = document.getElementById('logListAbsent'); if (lstA) { lstA.value = absentList.length > 0 ? absentList.join(', ') : '0명'; flashField(lstA); }
                    const lstE = document.getElementById('logListEarly');  if (lstE) { lstE.value = earlyList.length > 0 ? earlyList.join(', ') : '0명'; flashField(lstE); }
                    const lstP = document.getElementById('logListPublic'); if (lstP) { lstP.value = publicList.length > 0 ? publicList.join(', ') : '0명'; flashField(lstP); }
                    const lstU = document.getElementById('logListUnder50'); if (lstU) { lstU.value = under50List.length > 0 ? under50List.join(', ') : '0명'; flashField(lstU); }
                    const lstLE = document.getElementById('logListLateEarly'); if (lstLE) { lstLE.value = lateEarlyList.length > 0 ? lateEarlyList.join(', ') : '0명'; flashField(lstLE); }

                    showToast('\u2705 \ucd9c\uc11d\uae30\ub85d \ubc18\uc601 \uc644\ub8cc (' + dateVal + ') \u2014 \uc7ac\uc801 ' + students.length + '\uba85 / \ucd9c ' + p + ' / \uacb0 ' + a + ' / \uc9c0\uac01 ' + l + ' / \uc870\ud1f4 ' + e + ' / \uacf5\uacb0 ' + pu, 'success');
                }
            } catch (err) {
                console.error('Failed to load attendance for log', err);
                showToast('출석 기록 불러오기 중 오류가 발생했습니다.', 'error');
            } finally {
                if (btn) btn.disabled = false;
                if (btnText) btnText.innerHTML = '출석 기록 불러오기';
            }
        }

        function flashField(el) {
            if (!el) return;
            el.style.transition = 'background-color 0.4s ease';
            el.style.backgroundColor = '#d1fae5';
            setTimeout(() => { el.style.backgroundColor = ''; }, 1500);
        }

        function showToast(msg, type = 'success') {
            const existing = document.getElementById('attToast');
            if (existing) existing.remove();
            const colors = { success: 'bg-emerald-600', warn: 'bg-amber-500', error: 'bg-red-600' };
            const toast = document.createElement('div');
            toast.id = 'attToast';
            toast.className = 'fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] px-5 py-3 rounded-xl shadow-2xl text-sm font-bold text-white max-w-lg text-center ' + (colors[type] || colors.success);
            toast.textContent = msg;
            document.body.appendChild(toast);
            setTimeout(() => { toast.style.transition = 'opacity 0.4s'; toast.style.opacity = '0'; setTimeout(() => toast.remove(), 500); }, 4500);
        }

        function renderScheduleTable(dbSchedules, savedDetails = null) {
            const tbody = document.getElementById('scheduleTableBody');
            if (!tbody) return;
            
            let html = '';
            for (let i = 1; i <= 8; i++) {
                const saved = savedDetails ? savedDetails.find(s => s.period === i || s.period === String(i)) : null;
                const dbSch = dbSchedules ? dbSchedules.find(s => s.period_number === i || s.period_number === String(i)) : null;

                var subject = (dbSch && dbSch.subject_name) ? dbSch.subject_name : (saved ? saved.subject : '');
                var instructor = (dbSch && dbSch.instructor_name) ? dbSch.instructor_name : (saved ? saved.instructor : '');
                var subjectTrim = (subject || '').toString().trim();
                if (!subjectTrim || subjectTrim === '교과목') { instructor = ''; }
                const content = saved ? saved.content : '';
                const note = saved ? saved.note : '';
                
                const isReadOnly = !!window.notTrainingDay;
                const disabledAttr = isReadOnly ? ' disabled' : '';
                const readonlyClass = isReadOnly ? ' bg-gray-50 cursor-not-allowed' : '';

                html += '<tr id="schPeriodRow' + i + '" class="hover:bg-indigo-50/30 transition-colors group scroll-mt-24">' +
                        '<td class="px-2 py-2 text-center border-r border-gray-800 font-black text-gray-400 bg-gray-50/50">' + i + '교시</td>' +
                        '<td class="px-2 py-2 border-r border-gray-800 min-w-0 md:min-w-[200px] md:w-52" data-label="훈련과목"><input type="text" name="sch_subject_' + i + '" value="' + (subject || '') + '" class="w-full min-w-0 px-3 py-2.5 md:py-2 border border-gray-200 rounded-lg md:rounded-md text-base md:text-sm font-bold text-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all placeholder-gray-300' + readonlyClass + '" placeholder="교과목"' + disabledAttr + '></td>' +
                        '<td class="px-2 py-2 border-r border-gray-800 min-w-0 md:min-w-[120px] md:w-36" data-label="담당교사"><input type="text" name="sch_instructor_' + i + '" value="' + (instructor || '') + '" class="w-full min-w-0 px-3 py-2.5 md:py-2 border border-gray-200 rounded-lg md:rounded-md text-center text-base md:text-sm font-medium text-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all placeholder-gray-300' + readonlyClass + '" placeholder="담당교사"' + disabledAttr + '></td>' +
                        '<td class="px-2 py-2 border-r border-gray-800 min-w-0" data-label="훈련 내용"><input type="text" name="sch_content_' + i + '" value="' + (content || '') + '" class="w-full px-3 py-2.5 md:py-2 border border-gray-200 rounded-lg md:rounded-md text-base md:text-sm text-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all placeholder-gray-300' + readonlyClass + '" placeholder="훈련내용"' + disabledAttr + '></td>' +
                        '<td class="px-2 py-2 min-w-0" data-label="비고"><input type="text" name="sch_note_' + i + '" value="' + (note || '') + '" class="w-full px-3 py-2.5 md:py-2 border border-gray-200 rounded-lg md:rounded-md text-base md:text-sm text-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all placeholder-gray-300' + readonlyClass + '" placeholder="비고"' + disabledAttr + '></td>' +
                    '</tr>';
            }
            tbody.innerHTML = html;
        }


        // --------------------------------------------------------------------------------------------------------------------------------
        // Modal & Form Logic
        // --------------------------------------------------------------------------------------------------------------------------------

        async function openLogModal() {
            const elId = document.getElementById('logId');
            const elContent = document.getElementById('logContent');
            const elHours = document.getElementById('logHours');
            const elDate = document.getElementById('logDate');
            const elDateSelect = document.getElementById('logDateSelect');
            const elAuthor = document.getElementById('logAuthorId');
            const elAuthorLabel = document.getElementById('logAuthorLabel');

            resetLogFormInteractiveState();

            if (elId) elId.value = '';
            if (elContent) elContent.value = '';
            if (elHours) elHours.value = (globalDailyHours != null && globalDailyHours > 0) ? String(Number(globalDailyHours)) : '';
            if (elDate) {
                elDate.value = '';
                elDate.style.display = '';
                elDate.disabled = false;
            }
            if (elDateSelect) {
                elDateSelect.innerHTML = '';
                elDateSelect.style.display = 'none';
                elDateSelect.disabled = false;
            }
            window.selectedTrainingLogDate = null;

            if (elAuthor) {
                elAuthor.innerHTML = '<option value="">선택</option>';
                var isAdmin = (user && user.role === 'admin');
                if (isAdmin && instructorList.length > 0) {
                    for (var a = 0; a < instructorList.length; a++) {
                        var o = document.createElement('option');
                        o.value = instructorList[a].id;
                        o.textContent = instructorList[a].name || ('ID ' + instructorList[a].id);
                        elAuthor.appendChild(o);
                    }
                    elAuthor.disabled = false;
                    elAuthor.style.display = '';
                    if (elAuthorLabel) { elAuthorLabel.classList.add('hidden'); elAuthorLabel.textContent = ''; }
                } else if (user && (user.role === 'teacher' || user.role === 'instructor') && user.id) {
                    var o = document.createElement('option');
                    o.value = user.id;
                    o.textContent = (user.name || '').trim() || ('ID ' + user.id);
                    o.selected = true;
                    elAuthor.appendChild(o);
                    elAuthor.disabled = true;
                    elAuthor.style.display = '';
                    if (elAuthorLabel) { elAuthorLabel.classList.add('hidden'); elAuthorLabel.textContent = ''; }
                } else {
                    if (elAuthorLabel) { elAuthorLabel.textContent = (user && user.name) ? user.name : '-'; elAuthorLabel.classList.remove('hidden'); elAuthor.style.display = 'none'; }
                    else { elAuthor.style.display = ''; }
                }
            }

            if (pathCourseId) {
                try {
                    await resolveSessionContext();
                    var dates = await loadTrainingLogDates();
                    populateTrainingDateSelect(dates, null);
                    syncLogDateFromUi();
                } catch (e) {
                    console.error('openLogModal init failed', e);
                    var fallbackDates = generateClientTrainingDates(window.hrdSessionMeta);
                    if (fallbackDates.length > 0) populateTrainingDateSelect(fallbackDates, null);
                    syncLogDateFromUi();
                }
            } else {
                populateTrainingDateSelect([], null);
                syncLogDateFromUi();
            }

            ['logAttPresent', 'logAttAbsent', 'logAttLate', 'logAttEarly',
             'logInstructions', 'logListLate', 'logListAbsent', 'logListEarly', 'logListPublic', 'logListUnder50', 'logListLateEarly'].forEach(id => {
                const el = document.getElementById(id);
                if (el) el.value = '';
            });

            // 기본 선택 날짜에 이미 저장된 일지가 있으면 '작성' 대신 '수정'으로 연다
            var dateVal = syncLogDateFromUi();
            if (dateVal) {
                try {
                    var existing = await findExistingLogForDate(dateVal);
                    if (existing && existing.id) {
                        window._skipTrainingDateChange = true;
                        await editLog(existing.id);
                        window._skipTrainingDateChange = false;
                        return;
                    }
                } catch (existErr) {
                    console.error('openLogModal existing lookup', existErr);
                    window._skipTrainingDateChange = false;
                }
                loadDailySchedule(false);
            } else {
                renderScheduleTable(null, null);
            }

            var elTitle = document.getElementById('modalTitle');
            if (elTitle) elTitle.textContent = '훈련일지 작성';
            setModalCourseName();
            var elModal = document.getElementById('logModal');
            if (elModal) elModal.classList.remove('hidden');
        }
        
        function buildTrainingDatesApiUrl() {
            var qs = 'courseId=' + encodeURIComponent(pathCourseId || '');
            if (sessionId) qs += '&session_id=' + encodeURIComponent(sessionId);
            return '/api/hrd/training-logs/training-dates?' + qs;
        }

        async function loadTrainingLogDates() {
            if (!pathCourseId) return [];
            if (!window.hrdSessionMeta) {
                try { await resolveSessionContext(); } catch (e) {}
            }
            var apiDates = [];
            try {
                var datesRes = await fetch(buildTrainingDatesApiUrl(), { headers: { 'Authorization': 'Bearer ' + token } });
                var datesJson = await datesRes.json();
                if (datesJson.success && datesJson.data) {
                    if (datesJson.data.session_id) {
                        sessionId = Number(datesJson.data.session_id);
                        courseId = sessionId;
                    }
                    apiDates = normalizeTrainingDatesList(datesJson.data.dates);
                    if (datesJson.data.training_start_date || datesJson.data.training_end_date || datesJson.data.days_of_week || datesJson.data.session_name) {
                        window.hrdSessionMeta = Object.assign({}, window.hrdSessionMeta || {}, {
                            id: sessionId,
                            training_start_date: datesJson.data.training_start_date || (window.hrdSessionMeta && window.hrdSessionMeta.training_start_date),
                            training_end_date: datesJson.data.training_end_date || (window.hrdSessionMeta && window.hrdSessionMeta.training_end_date),
                            days_of_week: datesJson.data.days_of_week != null ? datesJson.data.days_of_week : (window.hrdSessionMeta && window.hrdSessionMeta.days_of_week),
                            session_name: datesJson.data.session_name || (window.hrdSessionMeta && window.hrdSessionMeta.session_name)
                        });
                    }
                }
            } catch (e) {
                console.error('training dates load failed', e);
            }
            var clientDates = generateClientTrainingDates(window.hrdSessionMeta);
            var merged = mergeTrainingDateLists(apiDates, clientDates);
            window.trainingLogDates = merged;
            return merged;
        }

        function populateTrainingDateSelect(dates, preferredDate) {
            var elDateSelect = document.getElementById('logDateSelect');
            var elDate = document.getElementById('logDate');
            dates = mergeTrainingDateLists(dates || [], generateClientTrainingDates(window.hrdSessionMeta));
            window.trainingLogDates = dates;

            // 목록이 없으면 type=date 입력만 표시
            if (!dates || dates.length === 0) {
                if (elDateSelect) elDateSelect.style.display = 'none';
                if (elDate) {
                    elDate.style.display = '';
                    elDate.disabled = false;
                    var fallbackDate = pickDefaultTrainingDate(generateClientTrainingDates(window.hrdSessionMeta), preferredDate);
                    if (fallbackDate) {
                        elDate.value = fallbackDate;
                    } else if (!elDate.value) {
                        var nowFb = new Date();
                        elDate.value = nowFb.getFullYear() + '-' + String(nowFb.getMonth() + 1).padStart(2, '0') + '-' + String(nowFb.getDate()).padStart(2, '0');
                    }
                    window.selectedTrainingLogDate = normalizeTrainingDateClient(elDate.value);
                }
                return elDate ? elDate.value : null;
            }

            // 목록이 있으면 셀렉트 표시 + #logDate에도 동일 값 동기화(숨김)
            if (elDateSelect) {
                elDateSelect.innerHTML = '';
                elDateSelect.disabled = false;
                var selected = pickDefaultTrainingDate(dates, preferredDate);
                dates.forEach(function(d) {
                    var opt = document.createElement('option');
                    opt.value = d;
                    opt.textContent = formatLogDateLabel(d);
                    if (d === selected) opt.selected = true;
                    elDateSelect.appendChild(opt);
                });
                elDateSelect.style.display = '';
                if (selected) {
                    elDateSelect.value = selected;
                    window.selectedTrainingLogDate = selected;
                }
                if (elDate) {
                    elDate.value = selected || '';
                    elDate.style.display = 'none';
                }
                return selected;
            }

            if (elDate) {
                elDate.style.display = '';
                var only = pickDefaultTrainingDate(dates, preferredDate);
                if (only) elDate.value = only;
                window.selectedTrainingLogDate = normalizeTrainingDateClient(elDate.value);
                return elDate.value;
            }
            return null;
        }

        function setModalCourseName() {
            const el = document.getElementById('logCourseName');
            if (!el) return;
            const headerTitle = document.getElementById('header-courseTitle');
            const name = (headerTitle && headerTitle.textContent && !headerTitle.textContent.includes('불러오는 중')) 
                ? headerTitle.textContent.trim() 
                : '';
            if (name) {
                el.textContent = name;
                el.classList.remove('text-gray-400', 'italic');
                el.classList.add('text-gray-800');
            } else {
                el.textContent = '-';
                el.classList.add('text-gray-400', 'italic');
                el.classList.remove('text-gray-800');
            }
        }

        async function editLog(idOrLog) {
            const log = typeof idOrLog === 'object' && idOrLog !== null
                ? idOrLog
                : await fetch('/api/hrd/training-logs/' + idOrLog, { headers: { 'Authorization': 'Bearer ' + token } }).then(r => r.json()).then(j => j.data || j);
            if (!log || !log.id) { alert('일지 정보를 불러올 수 없습니다.'); return; }
            resetLogFormInteractiveState();
            const elId = document.getElementById('logId');
            const elDate = document.getElementById('logDate');
            const elContent = document.getElementById('logContent');
            const elHours = document.getElementById('logHours');

            if (elId) elId.value = log.id;
            var logDateNormalized = normalizeTrainingDateClient(log.date);
            if (elDate) elDate.value = logDateNormalized;
            var elDateSelect = document.getElementById('logDateSelect');
            var dates = window.trainingLogDates && window.trainingLogDates.length > 0
                ? window.trainingLogDates
                : await loadTrainingLogDates();
            if (logDateNormalized) {
                dates = mergeTrainingDateLists(dates, [logDateNormalized]);
            }
            populateTrainingDateSelect(dates, logDateNormalized);
            if (elDate) elDate.value = logDateNormalized || syncLogDateFromUi();
            window.selectedTrainingLogDate = logDateNormalized || syncLogDateFromUi();
            if (elContent) elContent.value = log.content || '';
            if (elHours) elHours.value = (log.training_hours != null && log.training_hours !== '') ? String(Number(log.training_hours)) : '';

            var elAuthor = document.getElementById('logAuthorId');
            var elAuthorLabel = document.getElementById('logAuthorLabel');
            if (elAuthor) {
                var isAdmin = (user && user.role === 'admin');
                var authorVal = (log.instructor_id != null && log.instructor_id !== '') ? String(log.instructor_id) : '';
                if (isAdmin && instructorList.length > 0) {
                    elAuthor.innerHTML = '<option value="">선택</option>';
                    for (var a = 0; a < instructorList.length; a++) {
                        var o = document.createElement('option');
                        o.value = instructorList[a].id;
                        o.textContent = instructorList[a].name || ('ID ' + instructorList[a].id);
                        if (String(instructorList[a].id) === authorVal) o.selected = true;
                        elAuthor.appendChild(o);
                    }
                    elAuthor.disabled = false;
                    elAuthor.style.display = '';
                    if (elAuthorLabel) { elAuthorLabel.classList.add('hidden'); }
                } else if (user && (user.role === 'teacher' || user.role === 'instructor') && user.id) {
                    elAuthor.innerHTML = '';
                    var o = document.createElement('option');
                    o.value = user.id;
                    o.textContent = (user.name || '').trim() || ('ID ' + user.id);
                    o.selected = true;
                    elAuthor.appendChild(o);
                    elAuthor.disabled = true;
                    elAuthor.style.display = '';
                    if (elAuthorLabel) { elAuthorLabel.classList.add('hidden'); }
                } else if (elAuthorLabel) {
                    elAuthorLabel.textContent = (log.instructor_name || (user && user.name)) || '-';
                    elAuthorLabel.classList.remove('hidden');
                    elAuthor.style.display = 'none';
                }
            }

            // Populate New Attendance Fields
            const fieldMap = {
                present: 'logAttPresent', absent: 'logAttAbsent', late: 'logAttLate', early: 'logAttEarly',
                instructions: 'logInstructions', late_list: 'logListLate', absent_list: 'logListAbsent', early_list: 'logListEarly',
                public_list: 'logListPublic', under50_list: 'logListUnder50', late_early_list: 'logListLateEarly'
            };
            
            if (log.attendance_summary_json) {
                try {
                    const att = JSON.parse(log.attendance_summary_json);
                    for (const [key, id] of Object.entries(fieldMap)) {
                        const el = document.getElementById(id);
                        if (el) el.value = att[key] || '';
                    }
                } catch(e) {}
            } else {
                 for (const id of Object.values(fieldMap)) {
                     const el = document.getElementById(id);
                     if (el) el.value = '';
                 }
            }
            
            // NCS Unit fields disabled

            // 시간표 데이터 복원
            if (log.schedule_details_json) {
                try {
                    const details = JSON.parse(log.schedule_details_json);
                    renderScheduleTable(null, details); 
                } catch(e) {
                    loadDailySchedule(false);
                }
            } else {
                loadDailySchedule(false); 
            }

            const elTitle = document.getElementById('modalTitle');
            if (elTitle) elTitle.textContent = '훈련일지 수정';
            
            setModalCourseName();
            
            const elModal = document.getElementById('logModal');
            if (elModal) elModal.classList.remove('hidden');
        }

        function closeLogModal() { 
            const elModal = document.getElementById('logModal');
            if (elModal) elModal.classList.add('hidden'); 
        }

        async function fetchInstitutionName() {
            try {
                const res = await fetch('/api/settings/institution_name');
                const result = await res.json();
                if (result.success && result.data) {
                    const el = document.getElementById('institution-name-display');
                    if (el) el.textContent = result.data;
                    const el2 = document.getElementById('institution-name-display-footer');
                    if (el2) el2.textContent = result.data;
                }
            } catch (e) { console.error(e); }
        }

        // Call fetchInstitutionName when appropriate
        document.addEventListener('DOMContentLoaded', fetchInstitutionName);

        async function handleSaveLog(e) {
            e.preventDefault();

            var submitBtn = document.getElementById('logFormSubmitBtn');
            if (submitBtn && submitBtn.disabled) return;
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = '저장 중...';
            }

            try {
                // 회차/과정 컨텍스트 재확인
                if (!courseId && (sessionId || pathCourseId)) {
                    try { await resolveSessionContext(); } catch (ctxErr) { console.error(ctxErr); }
                }

                var dateVal = syncLogDateFromUi() || normalizeTrainingDateClient(readRawTrainingLogDate());
                if (!dateVal) {
                    var dateEl = document.getElementById('logDate');
                    var selEl = document.getElementById('logDateSelect');
                    dateVal = normalizeTrainingDateClient(
                        (dateEl && dateEl.value) ||
                        (selEl && selEl.value) ||
                        window.selectedTrainingLogDate ||
                        ''
                    );
                }

                if (!dateVal) {
                    alert('훈련일을 선택해 주세요.');
                    return;
                }
                window.selectedTrainingLogDate = dateVal;
                var dateSyncEl = document.getElementById('logDate');
                if (dateSyncEl) dateSyncEl.value = dateVal;

                // 목록 검증은 안내만 — UI에서 고른 유효 날짜면 저장 허용
                if (!isListedTrainingDate(dateVal)) {
                    try {
                        var refreshed = await loadTrainingLogDates();
                        if (refreshed && refreshed.length > 0) window.trainingLogDates = refreshed;
                    } catch (reloadErr) {}
                }
                if (window.notTrainingDay && !isListedTrainingDate(dateVal)) {
                    alert('훈련일이 아닙니다. 해당 날짜에는 일지 저장이 불가합니다.');
                    return;
                }

                if (!courseId && !pathCourseId && !sessionId) {
                    alert('과정 정보를 불러오지 못했습니다. 페이지를 새로고침해 주세요.');
                    return;
                }

                var idEl = document.getElementById('logId');
                var contentEl = document.getElementById('logContent');
                var hoursEl = document.getElementById('logHours');
                var idVal = idEl ? idEl.value : '';
                var contentVal = contentEl ? contentEl.value : '';
                var hoursVal = hoursEl ? hoursEl.value : '';

                var logAttPresent = document.getElementById('logAttPresent');
                var logAttAbsent = document.getElementById('logAttAbsent');
                var logAttLate = document.getElementById('logAttLate');
                var logAttEarly = document.getElementById('logAttEarly');
                var logInstructions = document.getElementById('logInstructions');
                var logListLate = document.getElementById('logListLate');
                var logListAbsent = document.getElementById('logListAbsent');
                var logListEarly = document.getElementById('logListEarly');
                var logListPublic = document.getElementById('logListPublic');
                var logListUnder50 = document.getElementById('logListUnder50');
                var logListLateEarly = document.getElementById('logListLateEarly');
                var attSummary = {
                    present: (logAttPresent && logAttPresent.value) || '',
                    absent: (logAttAbsent && logAttAbsent.value) || '',
                    late: (logAttLate && logAttLate.value) || '',
                    early: (logAttEarly && logAttEarly.value) || '',
                    instructions: (logInstructions && logInstructions.value) || '',
                    late_list: (logListLate && logListLate.value) || '',
                    absent_list: (logListAbsent && logListAbsent.value) || '',
                    early_list: (logListEarly && logListEarly.value) || '',
                    public_list: (logListPublic && logListPublic.value) || '',
                    under50_list: (logListUnder50 && logListUnder50.value) || '',
                    late_early_list: (logListLateEarly && logListLateEarly.value) || ''
                };

                var scheduleDetails = [];
                for (var i = 1; i <= 8; i++) {
                    var subjEl = document.querySelector('input[name="sch_subject_' + i + '"]');
                    var instEl = document.querySelector('input[name="sch_instructor_' + i + '"]');
                    var contEl = document.querySelector('input[name="sch_content_' + i + '"]');
                    var noteEl = document.querySelector('input[name="sch_note_' + i + '"]');
                    var subj = (subjEl && subjEl.value) || '';
                    var inst = (instEl && instEl.value) || '';
                    var cont = (contEl && contEl.value) || '';
                    var note = (noteEl && noteEl.value) || '';
                    if (subj || inst || cont || note) {
                        scheduleDetails.push({
                            period: i,
                            subject: subj,
                            instructor: inst,
                            content: cont,
                            note: note
                        });
                    }
                }

                var p1Subject = '-';
                if (scheduleDetails.length > 0) {
                    for (var si = 0; si < scheduleDetails.length; si++) {
                        if (scheduleDetails[si].period == 1 || scheduleDetails[si].period === '1') {
                            if (scheduleDetails[si].subject) p1Subject = scheduleDetails[si].subject;
                            break;
                        }
                    }
                }

                var elAuthor = document.getElementById('logAuthorId');
                var authorId = null;
                if (user && (user.role === 'admin') && elAuthor && elAuthor.value) {
                    authorId = elAuthor.value === '' ? null : (parseInt(elAuthor.value, 10) || null);
                }
                if (authorId == null && user && user.id) authorId = user.id;

                // courseId = HRD 회차 PK, pathCourseId = LMS courses.id
                var saveCourseId = courseId || sessionId || pathCourseId;
                if (!saveCourseId || isNaN(Number(saveCourseId))) {
                    alert('과정(회차) 정보가 없습니다. 페이지를 새로고침해 주세요.');
                    return;
                }

                var data = {
                    id: idVal ? parseInt(idVal, 10) : null,
                    course_id: parseInt(String(saveCourseId), 10),
                    session_id: sessionId || courseId || null,
                    lms_course_id: pathCourseId || null,
                    instructor_id: authorId,
                    date: dateVal,
                    topic: p1Subject,
                    content: contentVal,
                    teaching_method: '주입식/실습',
                    ncs_unit_id: null,
                    training_hours: parseFloat(hoursVal) || 0,
                    ncs_elements_json: null,
                    schedule_details_json: JSON.stringify(scheduleDetails),
                    attendance_summary_json: JSON.stringify(attSummary)
                };

                var res = await fetch('/api/hrd/training-logs', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token
                    },
                    body: JSON.stringify(data)
                });
                var result = null;
                try {
                    result = await res.json();
                } catch (parseErr) {
                    alert('저장 응답을 해석할 수 없습니다. (HTTP ' + res.status + ')');
                    return;
                }
                if (result && result.success) {
                    alert(result.message || '저장되었습니다.');
                    closeLogModal();
                    loadLogs(currentPage);
                } else {
                    alert('저장 실패: ' + ((result && (result.error || result.message)) || ('HTTP ' + res.status)));
                }
            } catch (err) {
                console.error('[handleSaveLog]', err);
                alert('오류가 발생했습니다: ' + (err && err.message ? err.message : String(err)));
            } finally {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = '저장하기';
                }
            }
        }

        // 인라인 onclick / 이벤트 리스너가 최신 함수를 쓰도록 마지막에 재할당
        window.syncLogDateFromUi = syncLogDateFromUi;
        window.loadDailyAttendance = loadDailyAttendance;
        window.loadDailySchedule = loadDailySchedule;
        window.openLogModal = openLogModal;
        window.closeLogModal = closeLogModal;
        window.editLog = editLog;
        window.handleSaveLog = handleSaveLog;
        window.onTrainingDateChange = onTrainingDateChange;
    </script>
            </div>
        </div>
    </div>
</body>
</html>
`;
