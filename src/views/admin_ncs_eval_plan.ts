import { hrdSidebar } from './components/hrd_sidebar';
import { lmsHeaderHtml } from './components/lms_header';

const NCS_PLAN_TAB_ITEMS = [
  { id: 'minutes', label: '평가계획회의록', icon: 'fa-clipboard' },
  { id: 'schedule', label: '평가실시일자', icon: 'fa-calendar-check' },
  { id: 'questions', label: '평가문항제작', icon: 'fa-list-check' },
  { id: 'tools', label: '평가도구제작', icon: 'fa-screwdriver-wrench' },
  { id: 'rubric', label: '평가도구채점기준표', icon: 'fa-table-list' },
  { id: 'achievement', label: '평가성취수준기준표', icon: 'fa-chart-column' },
  { id: 'review', label: '평가도구검토', icon: 'fa-magnifying-glass-chart' },
] as const;

/** 인쇄 전용: 평가 계획 회의록 양식 (화면에서는 숨김, @media print 에서만 표시) */
function minutesPrintSheetHtml() {
  return `
    <div id="minutesPrintRoot" class="ncs-minutes-print-root" aria-hidden="true">
      <div class="minutes-print-doc max-w-[210mm] mx-auto text-black text-[11pt] leading-relaxed print:p-0">
        <div class="flex items-start justify-between gap-4 border border-black mb-0">
          <div class="flex-1 py-4 px-3 text-center">
            <h1 class="text-xl font-black tracking-tight">평가 계획 회의록</h1>
            <p id="minutesPrintSubtitle" class="text-sm mt-1 text-slate-700"></p>
          </div>
          <table class="border-collapse border-l border-black text-center text-[10pt] shrink-0">
            <tbody>
              <tr>
                <td class="border border-black px-1 py-1 w-8 align-middle bg-slate-100 font-bold" rowspan="2">결<br/>재</td>
                <td class="border border-black px-3 py-1 w-16 bg-slate-50" id="minutesPrintApprovalRoleChair">담당</td>
                <td class="border border-black px-3 py-1 w-16 bg-slate-50" id="minutesPrintApprovalRoleWriter">팀장</td>
                <td class="border border-black px-3 py-1 w-16 bg-slate-50" id="minutesPrintApprovalRoleReviewer">원장</td>
              </tr>
              <tr>
                <td class="border border-black h-14 align-middle text-center text-[9pt] text-slate-400" id="minutesPrintSignChair">(서명)</td>
                <td class="border border-black h-14 align-middle text-center text-[9pt] text-slate-400" id="minutesPrintSignWriter">(서명)</td>
                <td class="border border-black h-14 align-middle text-center text-[9pt] text-slate-400" id="minutesPrintSignReviewer">(서명)</td>
              </tr>
            </tbody>
          </table>
        </div>
        <table class="w-full border-collapse border border-t-0 border-black">
          <tbody>
            <tr>
              <td class="border border-black w-[14%] bg-slate-100 px-2 py-2 font-bold text-center">과정명</td>
              <td class="border border-black px-2 py-2" colspan="3" id="minutesPrintCourseName"></td>
            </tr>
            <tr>
              <td class="border border-black bg-slate-100 px-2 py-2 font-bold text-center">개설회차</td>
              <td class="border border-black px-2 py-2 w-[36%]" id="minutesPrintSession"></td>
              <td class="border border-black w-[14%] bg-slate-100 px-2 py-2 font-bold text-center">평가회차</td>
              <td class="border border-black px-2 py-2" id="minutesPrintEvalRound"></td>
            </tr>
            <tr>
              <td class="border border-black bg-slate-100 px-2 py-2 font-bold text-center">회의일시</td>
              <td class="border border-black px-2 py-2" id="minutesPrintMeetingWhen"></td>
              <td class="border border-black bg-slate-100 px-2 py-2 font-bold text-center">회의장소</td>
              <td class="border border-black px-2 py-2" id="minutesPrintPlace"></td>
            </tr>
            <tr>
              <td class="border border-black bg-slate-100 px-2 py-2 font-bold text-center align-top">참석자</td>
              <td class="border border-black px-2 py-2" colspan="3" id="minutesPrintAttendees"></td>
            </tr>
            <tr>
              <td class="border border-black bg-slate-100 px-2 py-2 font-bold text-center align-top">회의 안건</td>
              <td class="border border-black px-2 py-2 whitespace-pre-wrap min-h-[3rem]" colspan="3" id="minutesPrintAgenda"></td>
            </tr>
            <tr>
              <td class="border border-black bg-slate-100 px-2 py-2 font-bold text-center align-top">회의록 내용</td>
              <td class="border border-black px-3 py-3 text-left align-top min-h-[200mm]" colspan="3" id="minutesPrintContent"></td>
            </tr>
            <tr>
              <td class="border border-black bg-slate-100 px-2 py-2 font-bold text-center align-top">첨부파일</td>
              <td class="border border-black px-2 py-2 text-sm align-top" colspan="3" id="minutesPrintAttachments"></td>
            </tr>
            <tr>
              <td class="border border-black bg-slate-100 px-2 py-2 font-bold text-center align-top">비고</td>
              <td class="border border-black px-2 py-2 whitespace-pre-wrap min-h-[2.5rem]" colspan="3" id="minutesPrintNotes"></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `;
}

/** 인쇄·미리보기: 평가 문항제작 */
function questionsPrintSheetHtml() {
  return `
    <div id="questionsPrintRoot" class="ncs-questions-print-root" aria-hidden="true">
      <button type="button" id="questionsPrintPreviewCloseBtn" class="no-print hidden fixed top-4 right-4 z-[210] px-4 py-2 rounded-xl bg-slate-900 text-white text-sm font-black shadow-lg hover:bg-slate-800">
        닫기
      </button>
      <div class="questions-print-doc max-w-[210mm] mx-auto text-black text-[11pt] leading-relaxed bg-white print:p-0">
        <div class="text-center border-b-2 border-black pb-3 mb-3">
          <h1 class="text-xl font-black tracking-tight">평가 문항제작</h1>
          <p id="questionsPrintSubtitle" class="text-sm mt-1 text-slate-700"></p>
        </div>
        <table class="w-full border-collapse border border-black text-[10pt] mb-4">
          <tbody>
            <tr>
              <td class="border border-black w-[18%] bg-slate-100 px-2 py-2 font-bold text-center">과정명</td>
              <td class="border border-black px-2 py-2" colspan="3" id="questionsPrintCourseName"></td>
            </tr>
            <tr>
              <td class="border border-black bg-slate-100 px-2 py-2 font-bold text-center">교과목(하위)</td>
              <td class="border border-black px-2 py-2" id="questionsPrintSubject"></td>
              <td class="border border-black w-[18%] bg-slate-100 px-2 py-2 font-bold text-center">평가차수</td>
              <td class="border border-black px-2 py-2" id="questionsPrintRound"></td>
            </tr>
            <tr>
              <td class="border border-black bg-slate-100 px-2 py-2 font-bold text-center">문서제목</td>
              <td class="border border-black px-2 py-2" id="questionsPrintDocTitle"></td>
              <td class="border border-black bg-slate-100 px-2 py-2 font-bold text-center">출제자</td>
              <td class="border border-black px-2 py-2" id="questionsPrintWriter"></td>
            </tr>
            <tr>
              <td class="border border-black bg-slate-100 px-2 py-2 font-bold text-center">배점</td>
              <td class="border border-black px-2 py-2" colspan="3" id="questionsPrintScoreSummary"></td>
            </tr>
          </tbody>
        </table>
        <div class="border border-black mb-2">
          <div class="bg-slate-100 px-2 py-1.5 font-bold text-center border-b border-black">평가문항</div>
          <div class="overflow-x-auto">
            <table class="w-full border-collapse text-[10pt]">
              <thead>
                <tr class="bg-slate-50">
                  <th class="border border-black px-2 py-2 w-12 text-center">번호</th>
                  <th class="border border-black px-2 py-2 w-20 text-center">유형</th>
                  <th class="border border-black px-2 py-2 text-left">문항</th>
                  <th class="border border-black px-2 py-2 w-14 text-center">배점</th>
                  <th class="border border-black px-2 py-2 text-left">평가기준·키워드</th>
                </tr>
              </thead>
              <tbody id="questionsPrintRowsBody"></tbody>
            </table>
          </div>
        </div>
        <div class="border border-black">
          <div class="bg-slate-100 px-2 py-1.5 font-bold border-b border-black">비고</div>
          <div id="questionsPrintNotes" class="px-3 py-2 whitespace-pre-wrap min-h-[3rem] text-[10pt]"></div>
        </div>
      </div>
    </div>
  `;
}

const NCS_PLAN_PRINT_STYLES = `
<style>
.ncs-minutes-print-root,
.ncs-questions-print-root {
  position: fixed;
  left: -200vw;
  top: 0;
  width: 210mm;
  max-height: 100vh;
  overflow: auto;
  background: #fff;
  z-index: 999999;
  padding: 0;
}
.ncs-questions-print-root.is-preview {
  left: 0 !important;
  right: 0 !important;
  top: 0 !important;
  width: 100% !important;
  max-height: 100vh !important;
  overflow: auto !important;
  background: rgba(15, 23, 42, 0.55) !important;
  z-index: 200 !important;
  padding: 1rem !important;
  display: flex !important;
  flex-direction: column !important;
  align-items: center !important;
}
.ncs-questions-print-root.is-preview .questions-print-doc {
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.35);
  padding: 12mm;
}
@media print {
  @page { size: A4; margin: 12mm; }
  .no-print { display: none !important; }
  body * { visibility: hidden !important; }
  body[data-print-target="minutes"] .ncs-minutes-print-root,
  body[data-print-target="minutes"] .ncs-minutes-print-root * {
    visibility: visible !important;
  }
  body[data-print-target="minutes"] .ncs-minutes-print-root {
    position: absolute !important;
    left: 0 !important;
    top: 0 !important;
    width: 100% !important;
    max-height: none !important;
    overflow: visible !important;
    z-index: 0 !important;
  }
  body[data-print-target="questions"] .ncs-questions-print-root,
  body[data-print-target="questions"] .ncs-questions-print-root * {
    visibility: visible !important;
  }
  body[data-print-target="questions"] .ncs-questions-print-root {
    position: absolute !important;
    left: 0 !important;
    top: 0 !important;
    width: 100% !important;
    max-height: none !important;
    overflow: visible !important;
    z-index: 0 !important;
    background: #fff !important;
    padding: 0 !important;
  }
  body[data-print-target="questions"] .ncs-questions-print-root.is-preview {
    display: block !important;
    background: #fff !important;
  }
}
</style>
`;

function ncsPlanTabsHtml(prefix: string, useFixedCourseId: boolean) {
  const nav = NCS_PLAN_TAB_ITEMS.map((item, idx) => `
      <button type="button"
        data-plan-tab-btn="${item.id}"
        onclick="switchNcsPlanTab('${item.id}')"
        class="px-4 py-2.5 rounded-xl border text-sm font-bold transition ${idx === 0 ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}">
        <i class="fas ${item.icon} mr-1.5"></i>${item.label}
      </button>
  `).join('');

  const panels = NCS_PLAN_TAB_ITEMS.map((item, idx) => `
      <section data-plan-tab-panel="${item.id}" class="${idx === 0 ? '' : 'hidden'}">
          <div class="rounded-[2rem] border border-slate-200/60 shadow-sm bg-white p-6">
              <div class="flex items-center justify-between mb-4 gap-2">
                  <h3 class="text-lg font-black text-slate-900 tracking-tight">${item.label}</h3>
                  <div class="flex items-center gap-2 flex-wrap justify-end">
                      <span class="text-xs font-bold text-slate-400" id="activeRoundBadge-${item.id}">1차평가(본평가)</span>
                      ${item.id === 'minutes' ? `
                      <button type="button" id="minutesPrintBtn" class="px-3 py-2 rounded-xl bg-amber-500 text-white text-xs font-black hover:bg-amber-600 transition">
                        <i class="fas fa-print mr-1"></i>인쇄
                      </button>
                      ` : ''}
                      ${item.id === 'questions' ? `
                      <button type="button" id="questionsPreviewBtn" class="px-3 py-2 rounded-xl border border-sky-200 bg-sky-50 text-sky-800 text-xs font-black hover:bg-sky-100 transition">
                        <i class="fas fa-eye mr-1"></i>미리보기
                      </button>
                      <button type="button" id="questionsPrintBtn" class="px-3 py-2 rounded-xl bg-amber-500 text-white text-xs font-black hover:bg-amber-600 transition">
                        <i class="fas fa-print mr-1"></i>인쇄
                      </button>
                      ` : ''}
                      <button type="button" data-plan-save-btn="${item.id}" class="px-3 py-2 rounded-xl bg-emerald-500 text-white text-xs font-black hover:bg-emerald-600 transition">
                        <i class="fas fa-floppy-disk mr-1"></i>문서 저장
                      </button>
                  </div>
              </div>
              ${item.id === 'minutes' ? `
                <div class="rounded-2xl border border-slate-200/70 overflow-hidden">
                  <div class="p-4 bg-slate-50 border-b border-slate-200/70 grid grid-cols-1 md:grid-cols-4 gap-3">
                    <input id="minutes_doc_title" class="md:col-span-2 px-3 py-2 rounded-xl border border-slate-200 text-sm" placeholder="문서 제목 (예: 1차 평가 계획 회의록)" />
                    <input id="minutes_meeting_date" type="date" class="px-3 py-2 rounded-xl border border-slate-200 text-sm" />
                    <input id="minutes_meeting_location" class="px-3 py-2 rounded-xl border border-slate-200 text-sm" placeholder="회의장소" />
                  </div>
                  <div class="p-4 bg-slate-50 border-b border-slate-200/70">
                    <label class="block text-xs font-black text-slate-600 mb-1.5">개설회차 (인쇄·문서 표시용)</label>
                    <input id="minutes_session" class="w-full max-w-md px-3 py-2 rounded-xl border border-slate-200 text-sm" placeholder="예: 4회차" />
                  </div>
                  <div class="p-4 grid grid-cols-1 md:grid-cols-3 gap-3 border-b border-slate-200/70">
                    <input id="minutes_chairperson" class="px-3 py-2 rounded-xl border border-slate-200 text-sm" placeholder="회의장" />
                    <input id="minutes_writer" class="px-3 py-2 rounded-xl border border-slate-200 text-sm" placeholder="작성자" />
                    <input id="minutes_reviewer" class="px-3 py-2 rounded-xl border border-slate-200 text-sm" placeholder="검토자" />
                  </div>
                  <div class="p-4 border-b border-slate-200/70">
                    <label class="block text-xs font-black text-slate-600 mb-2">결재 직함 (인쇄 표기)</label>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <input id="minutes_approval_role_chair" class="px-3 py-2 rounded-xl border border-slate-200 text-sm" placeholder="예: 담당" />
                      <input id="minutes_approval_role_writer" class="px-3 py-2 rounded-xl border border-slate-200 text-sm" placeholder="예: 팀장" />
                      <input id="minutes_approval_role_reviewer" class="px-3 py-2 rounded-xl border border-slate-200 text-sm" placeholder="예: 원장" />
                    </div>
                  </div>
                  <div class="p-4 border-b border-slate-200/70 bg-slate-50/80">
                    <label class="block text-xs font-black text-slate-600 mb-2">결재 서명</label>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div class="rounded-xl border border-slate-200 bg-white p-3">
                        <p class="text-xs font-black text-slate-600 mb-2">담당(회의장)</p>
                        <input type="file" id="minutesSignChairInput" accept="image/jpeg,image/png,image/gif,image/webp" class="hidden" />
                        <div id="minutesSignChairPreview" class="h-16 rounded-lg border border-dashed border-slate-200 flex items-center justify-center text-xs text-slate-400 mb-2">(서명 없음)</div>
                        <div class="flex items-center gap-2">
                          <button type="button" id="minutesSignChairBtn" class="px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-black text-slate-700 hover:bg-slate-50 transition">서명 삽입</button>
                          <button type="button" class="px-2.5 py-1.5 rounded-lg border border-rose-200 text-xs font-black text-rose-700 hover:bg-rose-50 transition" data-remove-minutes-signature="chairperson">삭제</button>
                        </div>
                      </div>
                      <div class="rounded-xl border border-slate-200 bg-white p-3">
                        <p class="text-xs font-black text-slate-600 mb-2">팀장(작성자)</p>
                        <input type="file" id="minutesSignWriterInput" accept="image/jpeg,image/png,image/gif,image/webp" class="hidden" />
                        <div id="minutesSignWriterPreview" class="h-16 rounded-lg border border-dashed border-slate-200 flex items-center justify-center text-xs text-slate-400 mb-2">(서명 없음)</div>
                        <div class="flex items-center gap-2">
                          <button type="button" id="minutesSignWriterBtn" class="px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-black text-slate-700 hover:bg-slate-50 transition">서명 삽입</button>
                          <button type="button" class="px-2.5 py-1.5 rounded-lg border border-rose-200 text-xs font-black text-rose-700 hover:bg-rose-50 transition" data-remove-minutes-signature="writer">삭제</button>
                        </div>
                      </div>
                      <div class="rounded-xl border border-slate-200 bg-white p-3">
                        <p class="text-xs font-black text-slate-600 mb-2">원장(검토자)</p>
                        <input type="file" id="minutesSignReviewerInput" accept="image/jpeg,image/png,image/gif,image/webp" class="hidden" />
                        <div id="minutesSignReviewerPreview" class="h-16 rounded-lg border border-dashed border-slate-200 flex items-center justify-center text-xs text-slate-400 mb-2">(서명 없음)</div>
                        <div class="flex items-center gap-2">
                          <button type="button" id="minutesSignReviewerBtn" class="px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-black text-slate-700 hover:bg-slate-50 transition">서명 삽입</button>
                          <button type="button" class="px-2.5 py-1.5 rounded-lg border border-rose-200 text-xs font-black text-rose-700 hover:bg-rose-50 transition" data-remove-minutes-signature="reviewer">삭제</button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="p-4 border-b border-slate-200/70">
                    <label class="block text-xs font-black text-slate-600 mb-1.5">참석자</label>
                    <input id="minutes_attendees" class="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm" placeholder="예: 홍길동, 김OO, 박OO" />
                  </div>
                  <div class="p-4 border-b border-slate-200/70">
                    <label class="block text-xs font-black text-slate-600 mb-1.5">회의 안건</label>
                    <textarea id="minutes_agenda" class="w-full h-20 px-3 py-2 rounded-xl border border-slate-200 text-sm"></textarea>
                  </div>
                  <div class="p-4 border-b border-slate-200/70 bg-slate-50/80">
                    <div class="flex flex-wrap items-center gap-2 mb-3">
                      <input type="file" id="minutesFileAttachInput" multiple class="hidden" />
                      <button type="button" id="minutesFileAttachBtn" class="px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-black text-slate-700 hover:bg-slate-50 transition">
                        <i class="fas fa-paperclip mr-1"></i>파일 첨부
                      </button>
                      <input type="file" id="minutesImageInsertInput" accept="image/jpeg,image/png,image/gif,image/webp" class="hidden" />
                      <button type="button" id="minutesImageInsertBtn" class="px-3 py-2 rounded-xl border border-sky-200 bg-sky-50 text-xs font-black text-sky-800 hover:bg-sky-100 transition">
                        <i class="fas fa-image mr-1"></i>이미지 삽입
                      </button>
                      <span class="text-[11px] text-slate-500">이미지는 커서 위치에 <code class="text-slate-600">![설명](URL)</code> 형식으로 삽입됩니다.</span>
                    </div>
                    <label class="block text-xs font-black text-slate-600 mb-1.5">첨부파일</label>
                    <div id="minutesAttachmentsList" class="flex flex-wrap gap-2 min-h-[2.5rem]"></div>
                  </div>
                  <div class="p-4 border-b border-slate-200/70">
                    <label class="block text-xs font-black text-slate-600 mb-1.5">회의 내용</label>
                    <textarea id="minutes_content" class="w-full h-72 px-3 py-2 rounded-xl border border-slate-200 font-mono text-sm" placeholder="회의 내용을 입력하세요. 이미지 삽입 시 본문에 자동으로 반영됩니다."></textarea>
                  </div>
                  <div class="p-4">
                    <label class="block text-xs font-black text-slate-600 mb-1.5">비고</label>
                    <textarea id="minutes_notes" class="w-full h-24 px-3 py-2 rounded-xl border border-slate-200 text-sm"></textarea>
                  </div>
                </div>
              ` : item.id === 'schedule' ? `
                <div class="space-y-4">
                  <div class="rounded-2xl border border-slate-200/70 bg-slate-50 p-4">
                    <div class="grid grid-cols-1 md:grid-cols-4 gap-3">
                      <input id="schedule_doc_title" class="md:col-span-2 px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white" placeholder="문서 제목 (예: 1차 평가 실시일정)" />
                      <input id="schedule_eval_type" class="px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white" placeholder="평가유형 (예: 본평가/재평가)" />
                      <input id="schedule_writer" class="px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white" placeholder="작성자" />
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-5 gap-3 mt-3">
                      <input id="scheduleInputDate" type="date" class="px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white" />
                      <input id="scheduleInputTime" type="time" class="px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white" />
                      <input id="scheduleInputPlace" class="px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white" placeholder="장소" />
                      <input id="scheduleInputTarget" class="px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white" placeholder="대상자/반" />
                      <button type="button" id="scheduleAddRowBtn" class="px-3 py-2 rounded-xl bg-sky-600 text-white text-sm font-black hover:bg-sky-700 transition">
                        <i class="fas fa-plus mr-1"></i>일정 추가
                      </button>
                    </div>
                  </div>
                  <div class="rounded-2xl border border-slate-200/70 overflow-hidden">
                    <div class="overflow-x-auto">
                      <table class="w-full text-left">
                        <thead class="bg-slate-50 border-b border-slate-100">
                          <tr>
                            <th class="px-4 py-2 text-xs font-black text-slate-500 uppercase tracking-wider w-16">No</th>
                            <th class="px-4 py-2 text-xs font-black text-slate-500 uppercase tracking-wider">평가일자</th>
                            <th class="px-4 py-2 text-xs font-black text-slate-500 uppercase tracking-wider">시간</th>
                            <th class="px-4 py-2 text-xs font-black text-slate-500 uppercase tracking-wider">장소</th>
                            <th class="px-4 py-2 text-xs font-black text-slate-500 uppercase tracking-wider">대상자</th>
                            <th class="px-4 py-2 text-xs font-black text-slate-500 uppercase tracking-wider text-center w-24">삭제</th>
                          </tr>
                        </thead>
                        <tbody id="scheduleRowsBody" class="divide-y divide-slate-100 bg-white"></tbody>
                      </table>
                    </div>
                  </div>
                  <div>
                    <label class="block text-xs font-black text-slate-600 mb-1.5">비고</label>
                    <textarea id="schedule_notes" class="w-full h-28 px-3 py-2 rounded-xl border border-slate-200 text-sm"></textarea>
                  </div>
                </div>
              ` : item.id === 'questions' ? `
                <div class="space-y-4">
                  <div class="rounded-2xl border border-slate-200/70 bg-slate-50 p-4">
                    <div class="grid grid-cols-1 md:grid-cols-4 gap-3">
                      <input id="questions_doc_title" class="md:col-span-2 px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white" placeholder="문서 제목 (예: NCS 본평가 문항지)" />
                      <input id="questions_writer" class="px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white" placeholder="출제자" />
                      <input id="questions_total_target" type="number" min="0" step="1" class="px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white" placeholder="목표 총점(선택)" />
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-6 gap-3 mt-3">
                      <input id="questionInputNo" type="number" min="1" step="1" class="px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white" placeholder="문항번호" />
                      <select id="questionInputType" class="px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white">
                        <option value="객관식">객관식</option>
                        <option value="주관식">주관식</option>
                        <option value="실습형">실습형</option>
                        <option value="서술형">서술형</option>
                      </select>
                      <input id="questionInputScore" type="number" min="0" step="1" class="px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white" placeholder="배점" />
                      <input id="questionInputKeyword" class="px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white md:col-span-2" placeholder="평가기준/키워드" />
                      <button type="button" id="questionAddRowBtn" class="px-3 py-2 rounded-xl bg-sky-600 text-white text-sm font-black hover:bg-sky-700 transition">
                        <i class="fas fa-plus mr-1"></i>문항 추가
                      </button>
                    </div>
                    <div class="mt-3">
                      <textarea id="questionInputText" class="w-full h-24 px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white" placeholder="문항 내용을 입력하세요."></textarea>
                    </div>
                  </div>

                  <div class="rounded-2xl border border-slate-200/70 overflow-hidden">
                    <div class="overflow-x-auto">
                      <table class="w-full text-left">
                        <thead class="bg-slate-50 border-b border-slate-100">
                          <tr>
                            <th class="px-4 py-2 text-xs font-black text-slate-500 uppercase tracking-wider w-16">번호</th>
                            <th class="px-4 py-2 text-xs font-black text-slate-500 uppercase tracking-wider w-24">유형</th>
                            <th class="px-4 py-2 text-xs font-black text-slate-500 uppercase tracking-wider">문항</th>
                            <th class="px-4 py-2 text-xs font-black text-slate-500 uppercase tracking-wider w-20 text-center">배점</th>
                            <th class="px-4 py-2 text-xs font-black text-slate-500 uppercase tracking-wider">평가기준</th>
                            <th class="px-4 py-2 text-xs font-black text-slate-500 uppercase tracking-wider w-32 text-center">작업</th>
                          </tr>
                        </thead>
                        <tbody id="questionsRowsBody" class="divide-y divide-slate-100 bg-white"></tbody>
                      </table>
                    </div>
                  </div>
                  <div class="flex items-center justify-between rounded-2xl border border-slate-200/70 bg-white px-4 py-3">
                    <p class="text-sm text-slate-600">총 배점</p>
                    <p id="questionsTotalScoreLabel" class="text-sm font-black text-slate-900">0점</p>
                  </div>
                  <div>
                    <label class="block text-xs font-black text-slate-600 mb-1.5">비고</label>
                    <textarea id="questions_notes" class="w-full h-24 px-3 py-2 rounded-xl border border-slate-200 text-sm"></textarea>
                  </div>
                </div>
              ` : item.id === 'tools' ? `
                <div class="space-y-4">
                  <div class="rounded-2xl border border-slate-200/70 bg-slate-50 p-4">
                    <div class="grid grid-cols-1 md:grid-cols-4 gap-3">
                      <input id="tools_doc_title" class="md:col-span-2 px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white" placeholder="문서 제목 (예: NCS 본평가 도구표)" />
                      <input id="tools_writer" class="px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white" placeholder="작성자" />
                      <input id="tools_target_time" class="px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white" placeholder="총 소요시간(예: 60분)" />
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-6 gap-3 mt-3">
                      <input id="toolInputName" class="px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white" placeholder="도구명" />
                      <select id="toolInputType" class="px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white">
                        <option value="실습평가">실습평가</option>
                        <option value="필답평가">필답평가</option>
                        <option value="구두평가">구두평가</option>
                        <option value="포트폴리오">포트폴리오</option>
                      </select>
                      <input id="toolInputDuration" class="px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white" placeholder="시간(분)" />
                      <input id="toolInputScore" type="number" min="0" step="1" class="px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white" placeholder="배점" />
                      <input id="toolInputMaterials" class="px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white md:col-span-2" placeholder="준비물/평가도구 상세" />
                    </div>
                    <div class="mt-3 flex justify-end">
                      <button type="button" id="toolAddRowBtn" class="px-3 py-2 rounded-xl bg-sky-600 text-white text-sm font-black hover:bg-sky-700 transition">
                        <i class="fas fa-plus mr-1"></i>도구 항목 추가
                      </button>
                    </div>
                  </div>

                  <div class="rounded-2xl border border-slate-200/70 overflow-hidden">
                    <div class="overflow-x-auto">
                      <table class="w-full text-left">
                        <thead class="bg-slate-50 border-b border-slate-100">
                          <tr>
                            <th class="px-4 py-2 text-xs font-black text-slate-500 uppercase tracking-wider">도구명</th>
                            <th class="px-4 py-2 text-xs font-black text-slate-500 uppercase tracking-wider w-28">유형</th>
                            <th class="px-4 py-2 text-xs font-black text-slate-500 uppercase tracking-wider">준비물/상세</th>
                            <th class="px-4 py-2 text-xs font-black text-slate-500 uppercase tracking-wider w-24 text-center">시간</th>
                            <th class="px-4 py-2 text-xs font-black text-slate-500 uppercase tracking-wider w-20 text-center">배점</th>
                            <th class="px-4 py-2 text-xs font-black text-slate-500 uppercase tracking-wider w-32 text-center">작업</th>
                          </tr>
                        </thead>
                        <tbody id="toolsRowsBody" class="divide-y divide-slate-100 bg-white"></tbody>
                      </table>
                    </div>
                  </div>

                  <div class="flex items-center justify-between rounded-2xl border border-slate-200/70 bg-white px-4 py-3">
                    <p class="text-sm text-slate-600">총 배점</p>
                    <p id="toolsTotalScoreLabel" class="text-sm font-black text-slate-900">0점</p>
                  </div>
                  <div>
                    <label class="block text-xs font-black text-slate-600 mb-1.5">비고</label>
                    <textarea id="tools_notes" class="w-full h-24 px-3 py-2 rounded-xl border border-slate-200 text-sm"></textarea>
                  </div>
                </div>
              ` : item.id === 'rubric' ? `
                <div class="space-y-4">
                  <div class="rounded-2xl border border-slate-200/70 bg-slate-50 p-4">
                    <div class="grid grid-cols-1 md:grid-cols-4 gap-3">
                      <input id="rubric_doc_title" class="md:col-span-2 px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white" placeholder="문서 제목 (예: 평가도구 채점기준표)" />
                      <input id="rubric_writer" class="px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white" placeholder="작성자" />
                      <input id="rubric_total_target" type="number" min="0" step="1" class="px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white" placeholder="기준 총점(선택)" />
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-5 gap-3 mt-3">
                      <input id="rubricInputItem" class="px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white" placeholder="평가항목" />
                      <input id="rubricInputScore" type="number" min="0" step="1" class="px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white" placeholder="배점" />
                      <input id="rubricInputHigh" class="px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white" placeholder="상(우수) 기준" />
                      <input id="rubricInputMid" class="px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white" placeholder="중(보통) 기준" />
                      <button type="button" id="rubricAddRowBtn" class="px-3 py-2 rounded-xl bg-sky-600 text-white text-sm font-black hover:bg-sky-700 transition">
                        <i class="fas fa-plus mr-1"></i>기준 항목 추가
                      </button>
                    </div>
                    <div class="mt-3">
                      <input id="rubricInputLow" class="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white" placeholder="하(미흡) 기준" />
                    </div>
                  </div>

                  <div class="rounded-2xl border border-slate-200/70 overflow-hidden">
                    <div class="overflow-x-auto">
                      <table class="w-full text-left">
                        <thead class="bg-slate-50 border-b border-slate-100">
                          <tr>
                            <th class="px-4 py-2 text-xs font-black text-slate-500 uppercase tracking-wider">평가항목</th>
                            <th class="px-4 py-2 text-xs font-black text-slate-500 uppercase tracking-wider w-20 text-center">배점</th>
                            <th class="px-4 py-2 text-xs font-black text-slate-500 uppercase tracking-wider">상(우수)</th>
                            <th class="px-4 py-2 text-xs font-black text-slate-500 uppercase tracking-wider">중(보통)</th>
                            <th class="px-4 py-2 text-xs font-black text-slate-500 uppercase tracking-wider">하(미흡)</th>
                            <th class="px-4 py-2 text-xs font-black text-slate-500 uppercase tracking-wider w-32 text-center">작업</th>
                          </tr>
                        </thead>
                        <tbody id="rubricRowsBody" class="divide-y divide-slate-100 bg-white"></tbody>
                      </table>
                    </div>
                  </div>

                  <div class="flex items-center justify-between rounded-2xl border border-slate-200/70 bg-white px-4 py-3">
                    <p class="text-sm text-slate-600">총 배점</p>
                    <p id="rubricTotalScoreLabel" class="text-sm font-black text-slate-900">0점</p>
                  </div>
                  <div>
                    <label class="block text-xs font-black text-slate-600 mb-1.5">비고</label>
                    <textarea id="rubric_notes" class="w-full h-24 px-3 py-2 rounded-xl border border-slate-200 text-sm"></textarea>
                  </div>
                </div>
              ` : item.id === 'achievement' ? `
                <div class="space-y-4">
                  <div class="rounded-2xl border border-slate-200/70 bg-slate-50 p-4">
                    <div class="grid grid-cols-1 md:grid-cols-4 gap-3">
                      <input id="achievement_doc_title" class="md:col-span-2 px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white" placeholder="문서 제목 (예: 성취수준 기준표)" />
                      <input id="achievement_writer" class="px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white" placeholder="작성자" />
                      <input id="achievement_target_score" type="number" min="0" step="1" class="px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white" placeholder="만점(기준점수)" />
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-6 gap-3 mt-3">
                      <input id="achievementInputLevel" class="px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white" placeholder="수준(예: A/우수)" />
                      <input id="achievementInputMin" type="number" min="0" step="1" class="px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white" placeholder="최소점수" />
                      <input id="achievementInputMax" type="number" min="0" step="1" class="px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white" placeholder="최대점수" />
                      <input id="achievementInputRate" type="number" min="0" max="100" step="1" class="px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white" placeholder="비율(%)" />
                      <input id="achievementInputCriteria" class="px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white md:col-span-2" placeholder="성취수준 설명" />
                    </div>
                    <div class="mt-3 flex justify-end">
                      <button type="button" id="achievementAddRowBtn" class="px-3 py-2 rounded-xl bg-sky-600 text-white text-sm font-black hover:bg-sky-700 transition">
                        <i class="fas fa-plus mr-1"></i>성취수준 추가
                      </button>
                    </div>
                  </div>

                  <div class="rounded-2xl border border-slate-200/70 overflow-hidden">
                    <div class="overflow-x-auto">
                      <table class="w-full text-left">
                        <thead class="bg-slate-50 border-b border-slate-100">
                          <tr>
                            <th class="px-4 py-2 text-xs font-black text-slate-500 uppercase tracking-wider w-24">수준</th>
                            <th class="px-4 py-2 text-xs font-black text-slate-500 uppercase tracking-wider w-24 text-center">최소</th>
                            <th class="px-4 py-2 text-xs font-black text-slate-500 uppercase tracking-wider w-24 text-center">최대</th>
                            <th class="px-4 py-2 text-xs font-black text-slate-500 uppercase tracking-wider w-24 text-center">비율</th>
                            <th class="px-4 py-2 text-xs font-black text-slate-500 uppercase tracking-wider">성취기준</th>
                            <th class="px-4 py-2 text-xs font-black text-slate-500 uppercase tracking-wider w-32 text-center">작업</th>
                          </tr>
                        </thead>
                        <tbody id="achievementRowsBody" class="divide-y divide-slate-100 bg-white"></tbody>
                      </table>
                    </div>
                  </div>
                  <div class="flex items-center justify-between rounded-2xl border border-slate-200/70 bg-white px-4 py-3">
                    <p class="text-sm text-slate-600">합계 비율</p>
                    <p id="achievementRateSumLabel" class="text-sm font-black text-slate-900">0%</p>
                  </div>
                  <div>
                    <label class="block text-xs font-black text-slate-600 mb-1.5">비고</label>
                    <textarea id="achievement_notes" class="w-full h-24 px-3 py-2 rounded-xl border border-slate-200 text-sm"></textarea>
                  </div>
                </div>
              ` : item.id === 'review' ? `
                <div class="space-y-4">
                  <div class="rounded-2xl border border-slate-200/70 bg-slate-50 p-4">
                    <div class="grid grid-cols-1 md:grid-cols-4 gap-3">
                      <input id="review_doc_title" class="md:col-span-2 px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white" placeholder="문서 제목 (예: 평가도구 검토 체크리스트)" />
                      <input id="review_writer" class="px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white" placeholder="작성자" />
                      <input id="review_reviewer" class="px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white" placeholder="검토자" />
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-5 gap-3 mt-3">
                      <input id="reviewInputItem" class="px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white md:col-span-2" placeholder="검토항목" />
                      <input id="reviewInputOwner" class="px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white" placeholder="담당자" />
                      <input id="reviewInputDate" type="date" class="px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white" />
                      <button type="button" id="reviewAddRowBtn" class="px-3 py-2 rounded-xl bg-sky-600 text-white text-sm font-black hover:bg-sky-700 transition">
                        <i class="fas fa-plus mr-1"></i>검토항목 추가
                      </button>
                    </div>
                    <div class="mt-3">
                      <textarea id="reviewInputComment" class="w-full h-20 px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white" placeholder="검토 의견"></textarea>
                    </div>
                  </div>
                  <div class="rounded-2xl border border-slate-200/70 overflow-hidden">
                    <div class="overflow-x-auto">
                      <table class="w-full text-left">
                        <thead class="bg-slate-50 border-b border-slate-100">
                          <tr>
                            <th class="px-4 py-2 text-xs font-black text-slate-500 uppercase tracking-wider w-20 text-center">완료</th>
                            <th class="px-4 py-2 text-xs font-black text-slate-500 uppercase tracking-wider">검토항목</th>
                            <th class="px-4 py-2 text-xs font-black text-slate-500 uppercase tracking-wider">의견</th>
                            <th class="px-4 py-2 text-xs font-black text-slate-500 uppercase tracking-wider w-28">담당자</th>
                            <th class="px-4 py-2 text-xs font-black text-slate-500 uppercase tracking-wider w-28">검토일</th>
                            <th class="px-4 py-2 text-xs font-black text-slate-500 uppercase tracking-wider w-32 text-center">작업</th>
                          </tr>
                        </thead>
                        <tbody id="reviewRowsBody" class="divide-y divide-slate-100 bg-white"></tbody>
                      </table>
                    </div>
                  </div>
                  <div class="flex items-center justify-between rounded-2xl border border-slate-200/70 bg-white px-4 py-3">
                    <p class="text-sm text-slate-600">검토 완료율</p>
                    <p id="reviewCompletionLabel" class="text-sm font-black text-slate-900">0%</p>
                  </div>
                  <div>
                    <label class="block text-xs font-black text-slate-600 mb-1.5">종합의견</label>
                    <textarea id="review_notes" class="w-full h-24 px-3 py-2 rounded-xl border border-slate-200 text-sm"></textarea>
                  </div>
                </div>
              ` : `
                <div class="space-y-3">
                  <input id="${item.id}_doc_title" class="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm" placeholder="${item.label} 문서 제목" />
                  <textarea id="${item.id}_body" class="w-full h-96 px-4 py-3 rounded-2xl border border-slate-200 text-sm" placeholder="${item.label} 내용을 입력하세요."></textarea>
                </div>
              `}
              <div class="mt-3 text-xs text-slate-500 flex items-center justify-between">
                <span id="planDocStatus-${item.id}">저장 대기</span>
                <span id="planDocUpdatedAt-${item.id}">마지막 저장: -</span>
              </div>
          </div>
      </section>
  `).join('');

  return `
    <div class="rounded-[2rem] border border-slate-200/60 shadow-sm bg-white p-4 mb-4">
      <div class="grid grid-cols-1 ${useFixedCourseId ? 'md:grid-cols-2' : 'md:grid-cols-3'} gap-3">
        ${useFixedCourseId ? `
          <div class="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <p class="text-xs text-slate-500 font-bold uppercase tracking-wider">과정</p>
            <p id="fixedCourseHint" class="text-sm font-black text-slate-800 mt-1">현재 과정</p>
          </div>
        ` : `
          <label class="block">
            <span class="text-xs text-slate-500 font-bold uppercase tracking-wider">과정 선택</span>
            <select id="ncsPlanCourseSelect" class="mt-1 w-full px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white">
              <option value="">과정 선택</option>
            </select>
          </label>
        `}
        <label class="block">
          <span class="text-xs text-slate-500 font-bold uppercase tracking-wider">평가차수</span>
          <select id="ncsPlanRoundSelect" class="mt-1 w-full px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white">
            <option value="1">1차평가(본평가)</option>
            <option value="2">2차평가(재평가)</option>
            <option value="3">3차평가(재평가)</option>
          </select>
        </label>
        <div class="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
          <p class="text-xs text-slate-500 font-bold uppercase tracking-wider">현재문서</p>
          <p id="activeDocLabel" class="text-sm font-black text-slate-800 mt-1">${prefix ? '평가계획회의록' : '평가계획회의록'}</p>
        </div>
      </div>
      <div class="mt-3 pt-3 border-t border-slate-200/80">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <label class="block">
            <span class="text-xs text-slate-500 font-bold uppercase tracking-wider">개설 회차 (선택)</span>
            <select id="ncsPlanSessionSelect" class="mt-1 w-full px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white disabled:opacity-60" disabled>
              <option value="">과정 선택 후 회차</option>
            </select>
          </label>
          <label class="block">
            <span class="text-xs text-slate-500 font-bold uppercase tracking-wider">교과목 · 하위 과목 (선택)</span>
            <select id="ncsPlanSubjectSelect" class="mt-1 w-full px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white disabled:opacity-60" disabled>
              <option value="">회차 선택 후 교과목</option>
            </select>
          </label>
        </div>
        <p class="text-[11px] text-slate-500 mt-2">과정에 연결된 개설 회차가 있을 때만 회차 목록이 채워집니다. 회차를 고르면 NCS 편성 <strong>교과목(하위 과목)</strong>을 고를 수 있으며, 선택 값은 <strong>평가실시일자</strong> 문서 저장 시 함께 저장됩니다.</p>
      </div>
    </div>
    <div class="rounded-[2rem] border border-slate-200/60 shadow-sm bg-white/80 backdrop-blur-md p-4">
        <div class="flex flex-wrap gap-2">
            ${nav}
        </div>
    </div>
    <div class="space-y-4 mt-4">
        ${panels}
    </div>
    ${minutesPrintSheetHtml()}
    ${questionsPrintSheetHtml()}
  `;
}

function ncsPlanTabScript(useFixedCourseId: boolean) {
  return `
  <script>
    const useFixedCourseId = ${useFixedCourseId ? 'true' : 'false'};
    const fixedCourseId = useFixedCourseId ? (window.location.pathname.split('/')[3] || '') : '';
    let activeTab = 'minutes';
    let selectedCourseId = useFixedCourseId ? fixedCourseId : '';
    let selectedRound = 1;

    const TAB_NAMES = {
      minutes: '평가계획회의록',
      schedule: '평가실시일자',
      questions: '평가문항제작',
      tools: '평가도구제작',
      rubric: '평가도구채점기준표',
      achievement: '평가성취수준기준표',
      review: '평가도구검토'
    };

    function roundLabel(n) {
      if (Number(n) === 1) return '1차평가(본평가)';
      if (Number(n) === 2) return '2차평가(재평가)';
      if (Number(n) === 3) return '3차평가(재평가)';
      return n + '차평가';
    }

    async function authFetch(url, options) {
      const token = localStorage.getItem('token');
      const base = { headers: { 'Authorization': 'Bearer ' + token } };
      return fetch(url, Object.assign({}, base, options || {}));
    }

    function escapeHtml(v) {
      return String(v ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
    }

    function formatMinutesDateKorean(iso) {
      if (!iso) return '';
      var p = String(iso).split('-');
      if (p.length !== 3) return String(iso);
      return p[0] + '년 ' + Number(p[1]) + '월 ' + Number(p[2]) + '일';
    }

    function setMinutesPrintText(id, text) {
      var el = document.getElementById(id);
      if (el) el.textContent = text != null ? String(text) : '';
    }

    function setMinutesPrintHtml(id, html) {
      var el = document.getElementById(id);
      if (el) el.innerHTML = html != null ? String(html) : '';
    }

    function isSafeMinutesAssetUrl(url) {
      var u = String(url || '').trim();
      return u.indexOf('/api/upload/files/') === 0;
    }

    function minutesContentToPrintHtml(text) {
      if (!text) return '';
      var lines = String(text).split('\\n');
      var parts = [];
      for (var i = 0; i < lines.length; i++) {
        var line = lines[i];
        var m = line.match(/^!\\[([^\\]]*)\\]\\(([^)]+)\\)\\s*$/);
        if (m && isSafeMinutesAssetUrl(m[2])) {
          var src = m[2].trim();
          parts.push('<p style="margin:8px 0"><img src="' + escapeHtml(src) + '" alt="' + escapeHtml(m[1]) + '" style="max-width:100%;height:auto;display:block;border:1px solid #ccc" /></p>');
        } else if (line.trim() === '') {
          parts.push('<br/>');
        } else {
          parts.push('<p style="margin:4px 0">' + escapeHtml(line) + '</p>');
        }
      }
      return parts.join('');
    }

    function readMinutesAttachmentsFromDom() {
      var box = document.getElementById('minutesAttachmentsList');
      if (!box) return [];
      var out = [];
      box.querySelectorAll('[data-minutes-attachment-url]').forEach(function(el) {
        out.push({
          url: el.getAttribute('data-minutes-attachment-url') || '',
          name: el.getAttribute('data-minutes-attachment-name') || 'file'
        });
      });
      return out;
    }

    function renderMinutesAttachments(items) {
      var box = document.getElementById('minutesAttachmentsList');
      if (!box) return;
      var list = Array.isArray(items) ? items : [];
      if (!list.length) {
        box.innerHTML = '<p class="text-xs text-slate-400 py-1">첨부된 파일이 없습니다.</p>';
        return;
      }
      box.innerHTML = list.map(function(it, idx) {
        var u = escapeHtml(it.url || '');
        var n = escapeHtml(it.name || 'file');
        return '<div class="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm max-w-full" data-minutes-attachment-url="' + u + '" data-minutes-attachment-name="' + n + '">' +
          '<a href="' + u + '" target="_blank" rel="noopener noreferrer" class="text-sky-700 font-semibold truncate flex-1 min-w-0">' + n + '</a>' +
          '<button type="button" class="text-rose-600 text-xs font-black shrink-0" data-remove-minutes-attachment="' + idx + '">삭제</button></div>';
      }).join('');
    }

    function removeMinutesAttachment(index) {
      var items = readMinutesAttachmentsFromDom();
      if (index >= 0 && index < items.length) items.splice(index, 1);
      renderMinutesAttachments(items);
    }

    function readMinutesSignaturesFromDom() {
      var chair = document.getElementById('minutesSignChairPreview');
      var writer = document.getElementById('minutesSignWriterPreview');
      var reviewer = document.getElementById('minutesSignReviewerPreview');
      return {
        chairperson: chair ? (chair.getAttribute('data-signature-url') || '') : '',
        writer: writer ? (writer.getAttribute('data-signature-url') || '') : '',
        reviewer: reviewer ? (reviewer.getAttribute('data-signature-url') || '') : ''
      };
    }

    function renderMinutesSignaturePreview(previewId, url) {
      var box = document.getElementById(previewId);
      if (!box) return;
      var safeUrl = isSafeMinutesAssetUrl(url) ? String(url) : '';
      if (!safeUrl) {
        box.removeAttribute('data-signature-url');
        box.innerHTML = '<span class="text-xs text-slate-400">(서명 없음)</span>';
        return;
      }
      box.setAttribute('data-signature-url', safeUrl);
      box.innerHTML = '<img src="' + escapeHtml(safeUrl) + '" alt="서명" class="max-h-14 max-w-full object-contain" />';
    }

    function renderMinutesSignatures(signatures) {
      var s = signatures || {};
      renderMinutesSignaturePreview('minutesSignChairPreview', s.chairperson || '');
      renderMinutesSignaturePreview('minutesSignWriterPreview', s.writer || '');
      renderMinutesSignaturePreview('minutesSignReviewerPreview', s.reviewer || '');
    }

    function removeMinutesSignature(role) {
      if (role === 'chairperson') renderMinutesSignaturePreview('minutesSignChairPreview', '');
      if (role === 'writer') renderMinutesSignaturePreview('minutesSignWriterPreview', '');
      if (role === 'reviewer') renderMinutesSignaturePreview('minutesSignReviewerPreview', '');
    }

    function setMinutesPrintSignature(cellId, url) {
      var el = document.getElementById(cellId);
      if (!el) return;
      if (isSafeMinutesAssetUrl(url)) {
        el.innerHTML = '<img src="' + escapeHtml(String(url)) + '" alt="서명" style="max-width:100%;max-height:46px;object-fit:contain;display:block;margin:0 auto;" />';
      } else {
        el.textContent = '(서명)';
      }
    }

    function setMinutesPrintApprovalRole(id, value, fallback) {
      var el = document.getElementById(id);
      if (!el) return;
      var txt = String(value || '').trim();
      el.textContent = txt || fallback;
    }

    function insertAtCursor(textarea, text) {
      if (!textarea) return;
      var start = textarea.selectionStart != null ? textarea.selectionStart : 0;
      var end = textarea.selectionEnd != null ? textarea.selectionEnd : 0;
      var v = textarea.value;
      textarea.value = v.substring(0, start) + text + v.substring(end);
      var pos = start + text.length;
      textarea.selectionStart = textarea.selectionEnd = pos;
      textarea.focus();
    }

    async function uploadMinutesFile(file, isImage) {
      if (!selectedCourseId) {
        alert('과정을 선택해 주세요.');
        return null;
      }
      var fd = new FormData();
      fd.append('file', file);
      fd.append('category', isImage ? 'images' : 'documents');
      fd.append('folder', 'ncs-plan-minutes/' + String(selectedCourseId));
      var token = localStorage.getItem('token');
      var res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Authorization': 'Bearer ' + token },
        body: fd
      });
      var json = await res.json();
      if (!json || !json.success) {
        alert((json && json.error) || '파일 업로드에 실패했습니다.');
        return null;
      }
      return json.data;
    }

    async function resolveCourseTitleForPrint() {
      if (!useFixedCourseId) {
        var sel = document.getElementById('ncsPlanCourseSelect');
        if (!sel || !sel.value) return '';
        var opt = sel.options[sel.selectedIndex];
        return opt ? opt.textContent : '';
      }
      if (window.__ncsEvalPlanCourseTitle) return window.__ncsEvalPlanCourseTitle;
      try {
        var res = await authFetch('/api/courses/' + encodeURIComponent(fixedCourseId));
        var json = await res.json();
        var d = json && json.data;
        if (d && (d.title || d.name)) {
          window.__ncsEvalPlanCourseTitle = d.title || d.name;
          return window.__ncsEvalPlanCourseTitle;
        }
      } catch (e) {}
      var hint = document.getElementById('fixedCourseHint');
      return hint ? hint.textContent : '';
    }

    async function printMinutesDocument() {
      if (!selectedCourseId) {
        alert('과정을 선택해 주세요.');
        return;
      }
      var courseTitle = await resolveCourseTitleForPrint();
      var subEl = document.getElementById('minutesPrintSubtitle');
      var docTitle = (document.getElementById('minutes_doc_title') || {}).value || '';
      if (subEl) subEl.textContent = docTitle ? ('(' + docTitle + ')') : '';

      setMinutesPrintText('minutesPrintCourseName', courseTitle);
      setMinutesPrintText('minutesPrintSession', (document.getElementById('minutes_session') || {}).value || '');
      setMinutesPrintText('minutesPrintEvalRound', roundLabel(selectedRound));
      setMinutesPrintText('minutesPrintMeetingWhen', formatMinutesDateKorean((document.getElementById('minutes_meeting_date') || {}).value || ''));
      setMinutesPrintText('minutesPrintPlace', (document.getElementById('minutes_meeting_location') || {}).value || '');
      setMinutesPrintText('minutesPrintAttendees', (document.getElementById('minutes_attendees') || {}).value || '');
      setMinutesPrintText('minutesPrintAgenda', (document.getElementById('minutes_agenda') || {}).value || '');
      var rawContent = (document.getElementById('minutes_content') || {}).value || '';
      setMinutesPrintHtml('minutesPrintContent', minutesContentToPrintHtml(rawContent));
      setMinutesPrintText('minutesPrintNotes', (document.getElementById('minutes_notes') || {}).value || '');
      setMinutesPrintApprovalRole('minutesPrintApprovalRoleChair', (document.getElementById('minutes_approval_role_chair') || {}).value || '', '담당');
      setMinutesPrintApprovalRole('minutesPrintApprovalRoleWriter', (document.getElementById('minutes_approval_role_writer') || {}).value || '', '팀장');
      setMinutesPrintApprovalRole('minutesPrintApprovalRoleReviewer', (document.getElementById('minutes_approval_role_reviewer') || {}).value || '', '원장');
      var sig = readMinutesSignaturesFromDom();
      setMinutesPrintSignature('minutesPrintSignChair', sig.chairperson);
      setMinutesPrintSignature('minutesPrintSignWriter', sig.writer);
      setMinutesPrintSignature('minutesPrintSignReviewer', sig.reviewer);

      var att = readMinutesAttachmentsFromDom();
      var attPrint = document.getElementById('minutesPrintAttachments');
      if (attPrint) {
        if (!att.length) {
          attPrint.innerHTML = '<span class="text-slate-500">없음</span>';
        } else {
          attPrint.innerHTML = att.map(function(a) {
            var u = escapeHtml(a.url || '');
            var n = escapeHtml(a.name || 'file');
            return '<div class="mb-1"><a href="' + u + '" class="text-sky-800 underline">' + n + '</a></div>';
          }).join('');
        }
      }

      document.body.setAttribute('data-print-target', 'minutes');
      window.setTimeout(function() { window.print(); }, 50);
    }

    async function fillQuestionsPrintSheet() {
      var courseTitle = await resolveCourseTitleForPrint();
      var subEl = document.getElementById('questionsPrintSubtitle');
      var docTitle = (document.getElementById('questions_doc_title') || {}).value || '';
      if (subEl) subEl.textContent = docTitle ? ('(' + docTitle + ')') : '';

      var subjLabel = '';
      var subjEl = document.getElementById('ncsPlanSubjectSelect');
      if (subjEl && subjEl.selectedIndex >= 0 && subjEl.options[subjEl.selectedIndex]) {
        subjLabel = (subjEl.options[subjEl.selectedIndex].textContent || '').trim();
      }

      setMinutesPrintText('questionsPrintCourseName', courseTitle || '-');
      setMinutesPrintText('questionsPrintSubject', subjLabel || '-');
      setMinutesPrintText('questionsPrintRound', roundLabel(selectedRound));
      setMinutesPrintText('questionsPrintDocTitle', docTitle || '-');
      setMinutesPrintText('questionsPrintWriter', (document.getElementById('questions_writer') || {}).value || '-');

      var rows = readQuestionRowsFromTable();
      var total = rows.reduce(function(acc, r) { return acc + Number(r && r.score != null ? r.score : 0); }, 0);
      var target = Number((document.getElementById('questions_total_target') || {}).value || 0);
      var sumText = '총배점 ' + total + '점';
      if (target > 0) sumText += ' / 목표 ' + target + '점';
      setMinutesPrintText('questionsPrintScoreSummary', sumText);

      var tbody = document.getElementById('questionsPrintRowsBody');
      if (tbody) {
        if (!rows.length) {
          tbody.innerHTML = '<tr><td colspan="5" class="border border-black px-2 py-3 text-center text-slate-500 text-[10pt]">등록된 문항이 없습니다.</td></tr>';
        } else {
          tbody.innerHTML = rows.map(function(row, idx) {
            var no = Number(row && row.no != null ? row.no : idx + 1);
            var typ = escapeHtml(String(row && row.type != null ? row.type : '-'));
            var txt = escapeHtml(String(row && row.text != null ? row.text : ''));
            var sc = Number(row && row.score != null ? row.score : 0);
            var kw = escapeHtml(String(row && row.keyword != null ? row.keyword : '-'));
            return '<tr>' +
              '<td class="border border-black px-2 py-2 text-center align-top">' + no + '</td>' +
              '<td class="border border-black px-2 py-2 text-center align-top">' + typ + '</td>' +
              '<td class="border border-black px-2 py-2 text-left align-top whitespace-pre-wrap text-[10pt]">' + (txt || '-') + '</td>' +
              '<td class="border border-black px-2 py-2 text-center align-top">' + sc + '</td>' +
              '<td class="border border-black px-2 py-2 text-left align-top whitespace-pre-wrap text-[10pt]">' + kw + '</td>' +
              '</tr>';
          }).join('');
        }
      }

      setMinutesPrintText('questionsPrintNotes', (document.getElementById('questions_notes') || {}).value || '');
    }

    async function openQuestionsPrintPreview() {
      if (!selectedCourseId) {
        alert('과정을 선택해 주세요.');
        return;
      }
      await fillQuestionsPrintSheet();
      var root = document.getElementById('questionsPrintRoot');
      var closeBtn = document.getElementById('questionsPrintPreviewCloseBtn');
      if (root) {
        root.classList.add('is-preview');
        root.setAttribute('aria-hidden', 'false');
      }
      if (closeBtn) closeBtn.classList.remove('hidden');
    }

    function closeQuestionsPrintPreview() {
      var root = document.getElementById('questionsPrintRoot');
      var closeBtn = document.getElementById('questionsPrintPreviewCloseBtn');
      if (root) {
        root.classList.remove('is-preview');
        root.setAttribute('aria-hidden', 'true');
      }
      if (closeBtn) closeBtn.classList.add('hidden');
    }

    async function printQuestionsDocument() {
      if (!selectedCourseId) {
        alert('과정을 선택해 주세요.');
        return;
      }
      closeQuestionsPrintPreview();
      await fillQuestionsPrintSheet();
      document.body.setAttribute('data-print-target', 'questions');
      window.setTimeout(function() { window.print(); }, 50);
    }

    function setStatus(tabId, text, isError) {
      const el = document.getElementById('planDocStatus-' + tabId);
      if (!el) return;
      el.textContent = text;
      el.classList.toggle('text-rose-500', !!isError);
      el.classList.toggle('text-slate-500', !isError);
    }

    function setUpdatedAt(tabId, updatedAt) {
      const el = document.getElementById('planDocUpdatedAt-' + tabId);
      if (!el) return;
      el.textContent = '마지막 저장: ' + (updatedAt || '-');
    }

    function getDocForm(tabId) {
      if (tabId === 'minutes') {
        return {
          title: document.getElementById('minutes_doc_title').value || '',
          payload: {
            opening_session: (document.getElementById('minutes_session') || {}).value || '',
            meeting_date: document.getElementById('minutes_meeting_date').value || '',
            meeting_location: document.getElementById('minutes_meeting_location').value || '',
            chairperson: document.getElementById('minutes_chairperson').value || '',
            writer: document.getElementById('minutes_writer').value || '',
            reviewer: document.getElementById('minutes_reviewer').value || '',
            approval_role_chair: (document.getElementById('minutes_approval_role_chair') || {}).value || '',
            approval_role_writer: (document.getElementById('minutes_approval_role_writer') || {}).value || '',
            approval_role_reviewer: (document.getElementById('minutes_approval_role_reviewer') || {}).value || '',
            attendees: document.getElementById('minutes_attendees').value || '',
            agenda: document.getElementById('minutes_agenda').value || '',
            content: document.getElementById('minutes_content').value || '',
            notes: document.getElementById('minutes_notes').value || '',
            attachments: readMinutesAttachmentsFromDom(),
            signatures: readMinutesSignaturesFromDom()
          }
        };
      }
      if (tabId === 'schedule') {
        var sessEl = document.getElementById('ncsPlanSessionSelect');
        var subjEl = document.getElementById('ncsPlanSubjectSelect');
        var rawSess = sessEl && sessEl.value ? parseInt(sessEl.value, 10) : NaN;
        var rawCur = subjEl && subjEl.value ? parseInt(subjEl.value, 10) : NaN;
        var subjLabel = '';
        if (subjEl && subjEl.selectedIndex >= 0 && subjEl.options[subjEl.selectedIndex]) {
          subjLabel = subjEl.options[subjEl.selectedIndex].textContent || '';
        }
        return {
          title: (document.getElementById('schedule_doc_title') || {}).value || '',
          payload: {
            eval_type: (document.getElementById('schedule_eval_type') || {}).value || '',
            writer: (document.getElementById('schedule_writer') || {}).value || '',
            notes: (document.getElementById('schedule_notes') || {}).value || '',
            rows: readScheduleRowsFromTable(),
            session_id: Number.isFinite(rawSess) && rawSess > 0 ? rawSess : '',
            curriculum_id: Number.isFinite(rawCur) && rawCur > 0 ? rawCur : '',
            subject_name: (subjLabel || '').trim()
          }
        };
      }
      if (tabId === 'questions') {
        return {
          title: (document.getElementById('questions_doc_title') || {}).value || '',
          payload: {
            writer: (document.getElementById('questions_writer') || {}).value || '',
            total_target: Number((document.getElementById('questions_total_target') || {}).value || 0),
            notes: (document.getElementById('questions_notes') || {}).value || '',
            rows: readQuestionRowsFromTable()
          }
        };
      }
      if (tabId === 'tools') {
        return {
          title: (document.getElementById('tools_doc_title') || {}).value || '',
          payload: {
            writer: (document.getElementById('tools_writer') || {}).value || '',
            target_time: (document.getElementById('tools_target_time') || {}).value || '',
            notes: (document.getElementById('tools_notes') || {}).value || '',
            rows: readToolRowsFromTable()
          }
        };
      }
      if (tabId === 'rubric') {
        return {
          title: (document.getElementById('rubric_doc_title') || {}).value || '',
          payload: {
            writer: (document.getElementById('rubric_writer') || {}).value || '',
            total_target: Number((document.getElementById('rubric_total_target') || {}).value || 0),
            notes: (document.getElementById('rubric_notes') || {}).value || '',
            rows: readRubricRowsFromTable()
          }
        };
      }
      if (tabId === 'achievement') {
        return {
          title: (document.getElementById('achievement_doc_title') || {}).value || '',
          payload: {
            writer: (document.getElementById('achievement_writer') || {}).value || '',
            target_score: Number((document.getElementById('achievement_target_score') || {}).value || 0),
            notes: (document.getElementById('achievement_notes') || {}).value || '',
            rows: readAchievementRowsFromTable()
          }
        };
      }
      if (tabId === 'review') {
        return {
          title: (document.getElementById('review_doc_title') || {}).value || '',
          payload: {
            writer: (document.getElementById('review_writer') || {}).value || '',
            reviewer: (document.getElementById('review_reviewer') || {}).value || '',
            notes: (document.getElementById('review_notes') || {}).value || '',
            rows: readReviewRowsFromTable()
          }
        };
      }
      return {
        title: (document.getElementById(tabId + '_doc_title') || {}).value || '',
        payload: { body: (document.getElementById(tabId + '_body') || {}).value || '' }
      };
    }

    function readScheduleRowsFromTable() {
      const body = document.getElementById('scheduleRowsBody');
      if (!body) return [];
      const rows = [];
      body.querySelectorAll('tr[data-schedule-row]').forEach(function(tr) {
        rows.push({
          date: tr.getAttribute('data-date') || '',
          time: tr.getAttribute('data-time') || '',
          place: tr.getAttribute('data-place') || '',
          target: tr.getAttribute('data-target') || ''
        });
      });
      return rows;
    }

    function renderScheduleRows(rows) {
      const body = document.getElementById('scheduleRowsBody');
      if (!body) return;
      const safeRows = Array.isArray(rows) ? rows : [];
      if (!safeRows.length) {
        body.innerHTML = '<tr><td colspan="6" class="px-4 py-8 text-center text-sm text-slate-400">등록된 일정이 없습니다.</td></tr>';
        return;
      }
      body.innerHTML = safeRows.map(function(row, idx) {
        const date = String(row?.date || '');
        const time = String(row?.time || '');
        const place = String(row?.place || '');
        const target = String(row?.target || '');
        return '<tr data-schedule-row data-date="' + escapeHtml(date) + '" data-time="' + escapeHtml(time) + '" data-place="' + escapeHtml(place) + '" data-target="' + escapeHtml(target) + '">' +
          '<td class="px-4 py-3 text-sm font-semibold text-slate-700">' + (idx + 1) + '</td>' +
          '<td class="px-4 py-3 text-sm text-slate-700">' + escapeHtml(date || '-') + '</td>' +
          '<td class="px-4 py-3 text-sm text-slate-700">' + escapeHtml(time || '-') + '</td>' +
          '<td class="px-4 py-3 text-sm text-slate-700">' + escapeHtml(place || '-') + '</td>' +
          '<td class="px-4 py-3 text-sm text-slate-700">' + escapeHtml(target || '-') + '</td>' +
          '<td class="px-4 py-3 text-center"><button type="button" class="px-2.5 py-1.5 rounded-lg border border-rose-200 bg-rose-50 text-rose-700 text-xs font-black hover:bg-rose-100 transition" data-remove-schedule-row="' + idx + '">삭제</button></td>' +
        '</tr>';
      }).join('');
    }

    function addScheduleRowFromInputs() {
      const dateEl = document.getElementById('scheduleInputDate');
      const timeEl = document.getElementById('scheduleInputTime');
      const placeEl = document.getElementById('scheduleInputPlace');
      const targetEl = document.getElementById('scheduleInputTarget');
      const date = (dateEl?.value || '').trim();
      const time = (timeEl?.value || '').trim();
      const place = (placeEl?.value || '').trim();
      const target = (targetEl?.value || '').trim();

      if (!date) {
        alert('평가일자를 입력해 주세요.');
        return;
      }

      const rows = readScheduleRowsFromTable();
      rows.push({ date, time, place, target });
      renderScheduleRows(rows);
      if (dateEl) dateEl.value = '';
      if (timeEl) timeEl.value = '';
      if (placeEl) placeEl.value = '';
      if (targetEl) targetEl.value = '';
    }

    function readQuestionRowsFromTable() {
      const body = document.getElementById('questionsRowsBody');
      if (!body) return [];
      const rows = [];
      body.querySelectorAll('tr[data-question-row]').forEach(function(tr) {
        rows.push({
          no: Number(tr.getAttribute('data-no') || 0),
          type: tr.getAttribute('data-type') || '',
          text: tr.getAttribute('data-text') || '',
          score: Number(tr.getAttribute('data-score') || 0),
          keyword: tr.getAttribute('data-keyword') || ''
        });
      });
      return rows;
    }

    function renderQuestionRows(rows) {
      const body = document.getElementById('questionsRowsBody');
      if (!body) return;
      const safeRows = (Array.isArray(rows) ? rows : []).slice().sort(function(a, b) { return Number(a?.no || 0) - Number(b?.no || 0); });
      if (!safeRows.length) {
        body.innerHTML = '<tr><td colspan="6" class="px-4 py-8 text-center text-sm text-slate-400">등록된 문항이 없습니다.</td></tr>';
        updateQuestionTotalScore([]);
        return;
      }
      body.innerHTML = safeRows.map(function(row, idx) {
        const no = Number(row?.no || 0);
        const type = String(row?.type || '');
        const text = String(row?.text || '');
        const score = Number(row?.score || 0);
        const keyword = String(row?.keyword || '');
        return '<tr data-question-row data-no="' + no + '" data-type="' + escapeHtml(type) + '" data-text="' + escapeHtml(text) + '" data-score="' + score + '" data-keyword="' + escapeHtml(keyword) + '">' +
          '<td class="px-4 py-3 text-sm font-semibold text-slate-700">' + (no || (idx + 1)) + '</td>' +
          '<td class="px-4 py-3 text-sm text-slate-700">' + escapeHtml(type || '-') + '</td>' +
          '<td class="px-4 py-3 text-sm text-slate-700"><div class="max-w-[520px] whitespace-pre-wrap">' + escapeHtml(text || '-') + '</div></td>' +
          '<td class="px-4 py-3 text-sm text-center font-semibold text-slate-800">' + score + '</td>' +
          '<td class="px-4 py-3 text-sm text-slate-700">' + escapeHtml(keyword || '-') + '</td>' +
          '<td class="px-4 py-3 text-center space-x-1">' +
            '<button type="button" data-edit-question-row="' + idx + '" class="px-2.5 py-1.5 rounded-lg border border-amber-200 bg-amber-50 text-amber-700 text-xs font-black hover:bg-amber-100 transition">수정</button>' +
            '<button type="button" data-remove-question-row="' + idx + '" class="px-2.5 py-1.5 rounded-lg border border-rose-200 bg-rose-50 text-rose-700 text-xs font-black hover:bg-rose-100 transition">삭제</button>' +
          '</td>' +
        '</tr>';
      }).join('');
      updateQuestionTotalScore(safeRows);
    }

    function updateQuestionTotalScore(rows) {
      const label = document.getElementById('questionsTotalScoreLabel');
      if (!label) return;
      const total = (Array.isArray(rows) ? rows : []).reduce(function(acc, row) { return acc + Number(row?.score || 0); }, 0);
      const target = Number((document.getElementById('questions_total_target') || {}).value || 0);
      label.textContent = total + '점' + (target > 0 ? (' / 목표 ' + target + '점') : '');
      label.classList.toggle('text-rose-600', target > 0 && total > target);
      label.classList.toggle('text-slate-900', !(target > 0 && total > target));
    }

    function addQuestionFromInputs() {
      const noEl = document.getElementById('questionInputNo');
      const typeEl = document.getElementById('questionInputType');
      const textEl = document.getElementById('questionInputText');
      const scoreEl = document.getElementById('questionInputScore');
      const keywordEl = document.getElementById('questionInputKeyword');
      const noVal = Number((noEl?.value || '').trim());
      const typeVal = (typeEl?.value || '').trim();
      const textVal = (textEl?.value || '').trim();
      const scoreVal = Number((scoreEl?.value || '').trim() || 0);
      const keywordVal = (keywordEl?.value || '').trim();

      if (!textVal) {
        alert('문항 내용을 입력해 주세요.');
        return;
      }
      if (!Number.isFinite(noVal) || noVal < 1) {
        alert('문항번호를 입력해 주세요.');
        return;
      }

      const rows = readQuestionRowsFromTable();
      const duplicated = rows.findIndex(function(r) { return Number(r.no) === noVal; });
      if (duplicated >= 0) {
        rows[duplicated] = { no: noVal, type: typeVal || '객관식', text: textVal, score: scoreVal, keyword: keywordVal };
      } else {
        rows.push({ no: noVal, type: typeVal || '객관식', text: textVal, score: scoreVal, keyword: keywordVal });
      }
      renderQuestionRows(rows);

      if (noEl) noEl.value = '';
      if (textEl) textEl.value = '';
      if (scoreEl) scoreEl.value = '';
      if (keywordEl) keywordEl.value = '';
    }

    function readToolRowsFromTable() {
      const body = document.getElementById('toolsRowsBody');
      if (!body) return [];
      const rows = [];
      body.querySelectorAll('tr[data-tool-row]').forEach(function(tr) {
        rows.push({
          name: tr.getAttribute('data-name') || '',
          type: tr.getAttribute('data-type') || '',
          materials: tr.getAttribute('data-materials') || '',
          duration: tr.getAttribute('data-duration') || '',
          score: Number(tr.getAttribute('data-score') || 0)
        });
      });
      return rows;
    }

    function renderToolRows(rows) {
      const body = document.getElementById('toolsRowsBody');
      if (!body) return;
      const safeRows = Array.isArray(rows) ? rows : [];
      if (!safeRows.length) {
        body.innerHTML = '<tr><td colspan="6" class="px-4 py-8 text-center text-sm text-slate-400">등록된 도구 항목이 없습니다.</td></tr>';
        updateToolsTotalScore([]);
        return;
      }
      body.innerHTML = safeRows.map(function(row, idx) {
        const name = String(row?.name || '');
        const type = String(row?.type || '');
        const materials = String(row?.materials || '');
        const duration = String(row?.duration || '');
        const score = Number(row?.score || 0);
        return '<tr data-tool-row data-name="' + escapeHtml(name) + '" data-type="' + escapeHtml(type) + '" data-materials="' + escapeHtml(materials) + '" data-duration="' + escapeHtml(duration) + '" data-score="' + score + '">' +
          '<td class="px-4 py-3 text-sm font-semibold text-slate-700">' + escapeHtml(name || '-') + '</td>' +
          '<td class="px-4 py-3 text-sm text-slate-700">' + escapeHtml(type || '-') + '</td>' +
          '<td class="px-4 py-3 text-sm text-slate-700">' + escapeHtml(materials || '-') + '</td>' +
          '<td class="px-4 py-3 text-sm text-slate-700 text-center">' + escapeHtml(duration || '-') + '</td>' +
          '<td class="px-4 py-3 text-sm text-slate-800 text-center font-semibold">' + score + '</td>' +
          '<td class="px-4 py-3 text-center space-x-1">' +
            '<button type="button" data-edit-tool-row="' + idx + '" class="px-2.5 py-1.5 rounded-lg border border-amber-200 bg-amber-50 text-amber-700 text-xs font-black hover:bg-amber-100 transition">수정</button>' +
            '<button type="button" data-remove-tool-row="' + idx + '" class="px-2.5 py-1.5 rounded-lg border border-rose-200 bg-rose-50 text-rose-700 text-xs font-black hover:bg-rose-100 transition">삭제</button>' +
          '</td>' +
        '</tr>';
      }).join('');
      updateToolsTotalScore(safeRows);
    }

    function updateToolsTotalScore(rows) {
      const label = document.getElementById('toolsTotalScoreLabel');
      if (!label) return;
      const total = (Array.isArray(rows) ? rows : []).reduce(function(acc, row) { return acc + Number(row?.score || 0); }, 0);
      label.textContent = total + '점';
    }

    function addToolFromInputs() {
      const nameEl = document.getElementById('toolInputName');
      const typeEl = document.getElementById('toolInputType');
      const durationEl = document.getElementById('toolInputDuration');
      const scoreEl = document.getElementById('toolInputScore');
      const materialsEl = document.getElementById('toolInputMaterials');
      const name = (nameEl?.value || '').trim();
      const type = (typeEl?.value || '').trim();
      const duration = (durationEl?.value || '').trim();
      const score = Number((scoreEl?.value || '').trim() || 0);
      const materials = (materialsEl?.value || '').trim();
      if (!name) {
        alert('도구명을 입력해 주세요.');
        return;
      }

      const rows = readToolRowsFromTable();
      rows.push({
        name,
        type: type || '실습평가',
        duration,
        score,
        materials
      });
      renderToolRows(rows);

      if (nameEl) nameEl.value = '';
      if (durationEl) durationEl.value = '';
      if (scoreEl) scoreEl.value = '';
      if (materialsEl) materialsEl.value = '';
    }

    function readRubricRowsFromTable() {
      const body = document.getElementById('rubricRowsBody');
      if (!body) return [];
      const rows = [];
      body.querySelectorAll('tr[data-rubric-row]').forEach(function(tr) {
        rows.push({
          item: tr.getAttribute('data-item') || '',
          score: Number(tr.getAttribute('data-score') || 0),
          high: tr.getAttribute('data-high') || '',
          mid: tr.getAttribute('data-mid') || '',
          low: tr.getAttribute('data-low') || ''
        });
      });
      return rows;
    }

    function renderRubricRows(rows) {
      const body = document.getElementById('rubricRowsBody');
      if (!body) return;
      const safeRows = Array.isArray(rows) ? rows : [];
      if (!safeRows.length) {
        body.innerHTML = '<tr><td colspan="6" class="px-4 py-8 text-center text-sm text-slate-400">등록된 채점기준이 없습니다.</td></tr>';
        updateRubricTotalScore([]);
        return;
      }
      body.innerHTML = safeRows.map(function(row, idx) {
        const item = String(row?.item || '');
        const score = Number(row?.score || 0);
        const high = String(row?.high || '');
        const mid = String(row?.mid || '');
        const low = String(row?.low || '');
        return '<tr data-rubric-row data-item="' + escapeHtml(item) + '" data-score="' + score + '" data-high="' + escapeHtml(high) + '" data-mid="' + escapeHtml(mid) + '" data-low="' + escapeHtml(low) + '">' +
          '<td class="px-4 py-3 text-sm font-semibold text-slate-700">' + escapeHtml(item || '-') + '</td>' +
          '<td class="px-4 py-3 text-sm text-center font-semibold text-slate-800">' + score + '</td>' +
          '<td class="px-4 py-3 text-sm text-slate-700">' + escapeHtml(high || '-') + '</td>' +
          '<td class="px-4 py-3 text-sm text-slate-700">' + escapeHtml(mid || '-') + '</td>' +
          '<td class="px-4 py-3 text-sm text-slate-700">' + escapeHtml(low || '-') + '</td>' +
          '<td class="px-4 py-3 text-center space-x-1">' +
            '<button type="button" data-edit-rubric-row="' + idx + '" class="px-2.5 py-1.5 rounded-lg border border-amber-200 bg-amber-50 text-amber-700 text-xs font-black hover:bg-amber-100 transition">수정</button>' +
            '<button type="button" data-remove-rubric-row="' + idx + '" class="px-2.5 py-1.5 rounded-lg border border-rose-200 bg-rose-50 text-rose-700 text-xs font-black hover:bg-rose-100 transition">삭제</button>' +
          '</td>' +
        '</tr>';
      }).join('');
      updateRubricTotalScore(safeRows);
    }

    function updateRubricTotalScore(rows) {
      const label = document.getElementById('rubricTotalScoreLabel');
      if (!label) return;
      const total = (Array.isArray(rows) ? rows : []).reduce(function(acc, row) { return acc + Number(row?.score || 0); }, 0);
      const target = Number((document.getElementById('rubric_total_target') || {}).value || 0);
      label.textContent = total + '점' + (target > 0 ? (' / 기준 ' + target + '점') : '');
      label.classList.toggle('text-rose-600', target > 0 && total > target);
      label.classList.toggle('text-slate-900', !(target > 0 && total > target));
    }

    function addRubricRowFromInputs() {
      const itemEl = document.getElementById('rubricInputItem');
      const scoreEl = document.getElementById('rubricInputScore');
      const highEl = document.getElementById('rubricInputHigh');
      const midEl = document.getElementById('rubricInputMid');
      const lowEl = document.getElementById('rubricInputLow');
      const item = (itemEl?.value || '').trim();
      const score = Number((scoreEl?.value || '').trim() || 0);
      const high = (highEl?.value || '').trim();
      const mid = (midEl?.value || '').trim();
      const low = (lowEl?.value || '').trim();
      if (!item) {
        alert('평가항목을 입력해 주세요.');
        return;
      }
      const rows = readRubricRowsFromTable();
      rows.push({ item, score, high, mid, low });
      renderRubricRows(rows);

      if (itemEl) itemEl.value = '';
      if (scoreEl) scoreEl.value = '';
      if (highEl) highEl.value = '';
      if (midEl) midEl.value = '';
      if (lowEl) lowEl.value = '';
    }

    function readAchievementRowsFromTable() {
      const body = document.getElementById('achievementRowsBody');
      if (!body) return [];
      const rows = [];
      body.querySelectorAll('tr[data-achievement-row]').forEach(function(tr) {
        rows.push({
          level: tr.getAttribute('data-level') || '',
          min_score: Number(tr.getAttribute('data-min') || 0),
          max_score: Number(tr.getAttribute('data-max') || 0),
          rate: Number(tr.getAttribute('data-rate') || 0),
          criteria: tr.getAttribute('data-criteria') || ''
        });
      });
      return rows;
    }

    function updateAchievementRateSum(rows) {
      const label = document.getElementById('achievementRateSumLabel');
      if (!label) return;
      const sum = (Array.isArray(rows) ? rows : []).reduce(function(acc, row) { return acc + Number(row?.rate || 0); }, 0);
      label.textContent = sum + '%';
      label.classList.toggle('text-rose-600', sum > 100);
      label.classList.toggle('text-emerald-700', sum === 100);
      label.classList.toggle('text-slate-900', sum < 100);
    }

    function renderAchievementRows(rows) {
      const body = document.getElementById('achievementRowsBody');
      if (!body) return;
      const safeRows = Array.isArray(rows) ? rows : [];
      if (!safeRows.length) {
        body.innerHTML = '<tr><td colspan="6" class="px-4 py-8 text-center text-sm text-slate-400">등록된 성취수준이 없습니다.</td></tr>';
        updateAchievementRateSum([]);
        return;
      }
      body.innerHTML = safeRows.map(function(row, idx) {
        const level = String(row?.level || '');
        const minScore = Number(row?.min_score || 0);
        const maxScore = Number(row?.max_score || 0);
        const rate = Number(row?.rate || 0);
        const criteria = String(row?.criteria || '');
        return '<tr data-achievement-row data-level="' + escapeHtml(level) + '" data-min="' + minScore + '" data-max="' + maxScore + '" data-rate="' + rate + '" data-criteria="' + escapeHtml(criteria) + '">' +
          '<td class="px-4 py-3 text-sm font-semibold text-slate-700">' + escapeHtml(level || '-') + '</td>' +
          '<td class="px-4 py-3 text-sm text-slate-700 text-center">' + minScore + '</td>' +
          '<td class="px-4 py-3 text-sm text-slate-700 text-center">' + maxScore + '</td>' +
          '<td class="px-4 py-3 text-sm text-center font-semibold text-slate-800">' + rate + '%</td>' +
          '<td class="px-4 py-3 text-sm text-slate-700">' + escapeHtml(criteria || '-') + '</td>' +
          '<td class="px-4 py-3 text-center space-x-1">' +
            '<button type="button" data-edit-achievement-row="' + idx + '" class="px-2.5 py-1.5 rounded-lg border border-amber-200 bg-amber-50 text-amber-700 text-xs font-black hover:bg-amber-100 transition">수정</button>' +
            '<button type="button" data-remove-achievement-row="' + idx + '" class="px-2.5 py-1.5 rounded-lg border border-rose-200 bg-rose-50 text-rose-700 text-xs font-black hover:bg-rose-100 transition">삭제</button>' +
          '</td>' +
        '</tr>';
      }).join('');
      updateAchievementRateSum(safeRows);
    }

    function addAchievementRowFromInputs() {
      const levelEl = document.getElementById('achievementInputLevel');
      const minEl = document.getElementById('achievementInputMin');
      const maxEl = document.getElementById('achievementInputMax');
      const rateEl = document.getElementById('achievementInputRate');
      const criteriaEl = document.getElementById('achievementInputCriteria');
      const level = (levelEl?.value || '').trim();
      const minScore = Number((minEl?.value || '').trim() || 0);
      const maxScore = Number((maxEl?.value || '').trim() || 0);
      const rate = Number((rateEl?.value || '').trim() || 0);
      const criteria = (criteriaEl?.value || '').trim();
      if (!level) {
        alert('성취수준을 입력해 주세요.');
        return;
      }
      const rows = readAchievementRowsFromTable();
      rows.push({ level, min_score: minScore, max_score: maxScore, rate, criteria });
      renderAchievementRows(rows);

      if (levelEl) levelEl.value = '';
      if (minEl) minEl.value = '';
      if (maxEl) maxEl.value = '';
      if (rateEl) rateEl.value = '';
      if (criteriaEl) criteriaEl.value = '';
    }

    function readReviewRowsFromTable() {
      const body = document.getElementById('reviewRowsBody');
      if (!body) return [];
      const rows = [];
      body.querySelectorAll('tr[data-review-row]').forEach(function(tr) {
        rows.push({
          done: tr.getAttribute('data-done') === '1',
          item: tr.getAttribute('data-item') || '',
          comment: tr.getAttribute('data-comment') || '',
          owner: tr.getAttribute('data-owner') || '',
          reviewed_at: tr.getAttribute('data-reviewed-at') || ''
        });
      });
      return rows;
    }

    function updateReviewCompletion(rows) {
      const label = document.getElementById('reviewCompletionLabel');
      if (!label) return;
      const total = Array.isArray(rows) ? rows.length : 0;
      const done = (Array.isArray(rows) ? rows : []).filter(function(r) { return !!r?.done; }).length;
      const rate = total > 0 ? Math.round((done / total) * 100) : 0;
      label.textContent = rate + '% (' + done + '/' + total + ')';
      label.classList.toggle('text-emerald-700', rate === 100 && total > 0);
      label.classList.toggle('text-slate-900', !(rate === 100 && total > 0));
    }

    function renderReviewRows(rows) {
      const body = document.getElementById('reviewRowsBody');
      if (!body) return;
      const safeRows = Array.isArray(rows) ? rows : [];
      if (!safeRows.length) {
        body.innerHTML = '<tr><td colspan="6" class="px-4 py-8 text-center text-sm text-slate-400">등록된 검토항목이 없습니다.</td></tr>';
        updateReviewCompletion([]);
        return;
      }
      body.innerHTML = safeRows.map(function(row, idx) {
        const done = !!row?.done;
        const item = String(row?.item || '');
        const comment = String(row?.comment || '');
        const owner = String(row?.owner || '');
        const reviewedAt = String(row?.reviewed_at || '');
        return '<tr data-review-row data-done="' + (done ? '1' : '0') + '" data-item="' + escapeHtml(item) + '" data-comment="' + escapeHtml(comment) + '" data-owner="' + escapeHtml(owner) + '" data-reviewed-at="' + escapeHtml(reviewedAt) + '">' +
          '<td class="px-4 py-3 text-center"><input type="checkbox" data-toggle-review-done="' + idx + '" ' + (done ? 'checked' : '') + ' /></td>' +
          '<td class="px-4 py-3 text-sm font-semibold text-slate-700">' + escapeHtml(item || '-') + '</td>' +
          '<td class="px-4 py-3 text-sm text-slate-700">' + escapeHtml(comment || '-') + '</td>' +
          '<td class="px-4 py-3 text-sm text-slate-700">' + escapeHtml(owner || '-') + '</td>' +
          '<td class="px-4 py-3 text-sm text-slate-700">' + escapeHtml(reviewedAt || '-') + '</td>' +
          '<td class="px-4 py-3 text-center space-x-1">' +
            '<button type="button" data-edit-review-row="' + idx + '" class="px-2.5 py-1.5 rounded-lg border border-amber-200 bg-amber-50 text-amber-700 text-xs font-black hover:bg-amber-100 transition">수정</button>' +
            '<button type="button" data-remove-review-row="' + idx + '" class="px-2.5 py-1.5 rounded-lg border border-rose-200 bg-rose-50 text-rose-700 text-xs font-black hover:bg-rose-100 transition">삭제</button>' +
          '</td>' +
        '</tr>';
      }).join('');
      updateReviewCompletion(safeRows);
    }

    function addReviewRowFromInputs() {
      const itemEl = document.getElementById('reviewInputItem');
      const ownerEl = document.getElementById('reviewInputOwner');
      const dateEl = document.getElementById('reviewInputDate');
      const commentEl = document.getElementById('reviewInputComment');
      const item = (itemEl?.value || '').trim();
      const owner = (ownerEl?.value || '').trim();
      const reviewedAt = (dateEl?.value || '').trim();
      const comment = (commentEl?.value || '').trim();
      if (!item) {
        alert('검토항목을 입력해 주세요.');
        return;
      }
      const rows = readReviewRowsFromTable();
      rows.push({ done: false, item, owner, reviewed_at: reviewedAt, comment });
      renderReviewRows(rows);
      if (itemEl) itemEl.value = '';
      if (ownerEl) ownerEl.value = '';
      if (dateEl) dateEl.value = '';
      if (commentEl) commentEl.value = '';
    }

    function applyDocForm(tabId, data) {
      const payload = data && data.payload ? data.payload : {};
      if (tabId === 'minutes') {
        document.getElementById('minutes_doc_title').value = data?.title || '';
        var sessionEl = document.getElementById('minutes_session');
        if (sessionEl) sessionEl.value = payload.opening_session || '';
        document.getElementById('minutes_meeting_date').value = payload.meeting_date || '';
        document.getElementById('minutes_meeting_location').value = payload.meeting_location || '';
        document.getElementById('minutes_chairperson').value = payload.chairperson || '';
        document.getElementById('minutes_writer').value = payload.writer || '';
        document.getElementById('minutes_reviewer').value = payload.reviewer || '';
        var roleChairEl = document.getElementById('minutes_approval_role_chair');
        if (roleChairEl) roleChairEl.value = payload.approval_role_chair || '담당';
        var roleWriterEl = document.getElementById('minutes_approval_role_writer');
        if (roleWriterEl) roleWriterEl.value = payload.approval_role_writer || '팀장';
        var roleReviewerEl = document.getElementById('minutes_approval_role_reviewer');
        if (roleReviewerEl) roleReviewerEl.value = payload.approval_role_reviewer || '원장';
        document.getElementById('minutes_attendees').value = payload.attendees || '';
        document.getElementById('minutes_agenda').value = payload.agenda || '';
        document.getElementById('minutes_content').value = payload.content || '';
        document.getElementById('minutes_notes').value = payload.notes || '';
        renderMinutesAttachments(payload.attachments || []);
        renderMinutesSignatures(payload.signatures || {});
        return;
      }
      if (tabId === 'schedule') {
        const titleEl = document.getElementById('schedule_doc_title');
        const typeEl = document.getElementById('schedule_eval_type');
        const writerEl = document.getElementById('schedule_writer');
        const notesEl = document.getElementById('schedule_notes');
        if (titleEl) titleEl.value = data?.title || '';
        if (typeEl) typeEl.value = payload.eval_type || '';
        if (writerEl) writerEl.value = payload.writer || '';
        if (notesEl) notesEl.value = payload.notes || '';
        renderScheduleRows(payload.rows || []);
        void applyScheduleSessionSubjectFromPayload(payload || {});
        return;
      }
      if (tabId === 'questions') {
        const titleEl = document.getElementById('questions_doc_title');
        const writerEl = document.getElementById('questions_writer');
        const targetEl = document.getElementById('questions_total_target');
        const notesEl = document.getElementById('questions_notes');
        if (titleEl) titleEl.value = data?.title || '';
        if (writerEl) writerEl.value = payload.writer || '';
        if (targetEl) targetEl.value = payload.total_target || '';
        if (notesEl) notesEl.value = payload.notes || '';
        renderQuestionRows(payload.rows || []);
        return;
      }
      if (tabId === 'tools') {
        const titleEl = document.getElementById('tools_doc_title');
        const writerEl = document.getElementById('tools_writer');
        const targetTimeEl = document.getElementById('tools_target_time');
        const notesEl = document.getElementById('tools_notes');
        if (titleEl) titleEl.value = data?.title || '';
        if (writerEl) writerEl.value = payload.writer || '';
        if (targetTimeEl) targetTimeEl.value = payload.target_time || '';
        if (notesEl) notesEl.value = payload.notes || '';
        renderToolRows(payload.rows || []);
        return;
      }
      if (tabId === 'rubric') {
        const titleEl = document.getElementById('rubric_doc_title');
        const writerEl = document.getElementById('rubric_writer');
        const targetEl = document.getElementById('rubric_total_target');
        const notesEl = document.getElementById('rubric_notes');
        if (titleEl) titleEl.value = data?.title || '';
        if (writerEl) writerEl.value = payload.writer || '';
        if (targetEl) targetEl.value = payload.total_target || '';
        if (notesEl) notesEl.value = payload.notes || '';
        renderRubricRows(payload.rows || []);
        return;
      }
      if (tabId === 'achievement') {
        const titleEl = document.getElementById('achievement_doc_title');
        const writerEl = document.getElementById('achievement_writer');
        const targetEl = document.getElementById('achievement_target_score');
        const notesEl = document.getElementById('achievement_notes');
        if (titleEl) titleEl.value = data?.title || '';
        if (writerEl) writerEl.value = payload.writer || '';
        if (targetEl) targetEl.value = payload.target_score || '';
        if (notesEl) notesEl.value = payload.notes || '';
        renderAchievementRows(payload.rows || []);
        return;
      }
      if (tabId === 'review') {
        const titleEl = document.getElementById('review_doc_title');
        const writerEl = document.getElementById('review_writer');
        const reviewerEl = document.getElementById('review_reviewer');
        const notesEl = document.getElementById('review_notes');
        if (titleEl) titleEl.value = data?.title || '';
        if (writerEl) writerEl.value = payload.writer || '';
        if (reviewerEl) reviewerEl.value = payload.reviewer || '';
        if (notesEl) notesEl.value = payload.notes || '';
        renderReviewRows(payload.rows || []);
        return;
      }
      const titleEl = document.getElementById(tabId + '_doc_title');
      const bodyEl = document.getElementById(tabId + '_body');
      if (titleEl) titleEl.value = data?.title || '';
      if (bodyEl) bodyEl.value = payload.body || '';
    }

    function clearDocForm(tabId) {
      applyDocForm(tabId, { title: '', payload: {} });
      setUpdatedAt(tabId, null);
      setStatus(tabId, '저장 대기', false);
    }

    async function loadCourseOptions() {
      if (useFixedCourseId) return;
      const sel = document.getElementById('ncsPlanCourseSelect');
      if (!sel) return;
      try {
        const res = await authFetch('/api/courses?limit=500&page=1');
        const json = await res.json();
        const list = Array.isArray(json?.data) ? json.data : [];
        list.forEach(function(c) {
          if (!c || c.id == null) return;
          const opt = document.createElement('option');
          opt.value = String(c.id);
          opt.textContent = '[' + c.id + '] ' + (c.title || c.name || '과정');
          sel.appendChild(opt);
        });
      } catch (e) {
        console.error(e);
      }
    }

    async function loadNcsPlanSessionOptions(courseId) {
      var sessSel = document.getElementById('ncsPlanSessionSelect');
      if (!sessSel) return;
      if (!courseId) {
        sessSel.innerHTML = '<option value="">과정 선택 후 회차</option>';
        sessSel.disabled = true;
        return;
      }
      sessSel.disabled = false;
      sessSel.innerHTML = '<option value="">회차 선택 (선택사항)</option>';
      try {
        var res = await authFetch('/api/course-sessions?lms_course_id=' + encodeURIComponent(String(courseId)) + '&limit=100&page=1');
        var json = await res.json();
        var list = Array.isArray(json && json.data) ? json.data : [];
        list.forEach(function(s) {
          if (!s || s.id == null) return;
          var opt = document.createElement('option');
          opt.value = String(s.id);
          var sn = s.session_number != null ? String(s.session_number) + '회차' : '';
          var sd = (s.training_start_date || '').toString().substring(0, 10);
          var label = '[' + s.id + '] ' + (sn || '회차') + (sd ? ' · ' + sd : '');
          opt.textContent = label;
          sessSel.appendChild(opt);
        });
      } catch (e) {
        console.error(e);
      }
    }

    async function loadNcsPlanSubjectOptions(sessionId) {
      var subSel = document.getElementById('ncsPlanSubjectSelect');
      if (!subSel) return;
      subSel.innerHTML = '<option value="">교과목 선택 (선택사항)</option>';
      if (!sessionId) {
        subSel.disabled = true;
        return;
      }
      subSel.disabled = false;
      try {
        var res = await authFetch('/api/course-sessions/' + encodeURIComponent(String(sessionId)) + '/timetable/resources');
        var json = await res.json();
        var data = json && json.data;
        var subjects = data && Array.isArray(data.subjects) ? data.subjects : [];
        subjects.forEach(function(sub) {
          if (!sub || sub.id == null) return;
          var opt = document.createElement('option');
          opt.value = String(sub.id);
          var nm = String(sub.name || sub.job_name || '교과목');
          if (nm.length > 96) nm = nm.substring(0, 96) + '…';
          opt.textContent = nm;
          subSel.appendChild(opt);
        });
      } catch (e) {
        console.error(e);
      }
    }

    async function applyScheduleSessionSubjectFromPayload(payload) {
      var p = payload || {};
      var sessSel = document.getElementById('ncsPlanSessionSelect');
      var subSel = document.getElementById('ncsPlanSubjectSelect');
      if (!sessSel || !subSel) return;
      var cid = selectedCourseId || (useFixedCourseId ? fixedCourseId : '');
      if (!cid) {
        sessSel.innerHTML = '<option value="">과정 선택 후 회차</option>';
        sessSel.disabled = true;
        subSel.innerHTML = '<option value="">회차 선택 후 교과목</option>';
        subSel.disabled = true;
        return;
      }
      sessSel.disabled = false;
      await loadNcsPlanSessionOptions(cid);
      var wantSess = p.session_id != null && String(p.session_id).trim() !== '' ? String(p.session_id).trim() : '';
      if (wantSess) {
        sessSel.value = wantSess;
        if (sessSel.value !== wantSess) sessSel.value = '';
      } else {
        sessSel.value = '';
      }
      if (sessSel.value) {
        await loadNcsPlanSubjectOptions(sessSel.value);
        var wantCur = p.curriculum_id != null && String(p.curriculum_id).trim() !== '' ? String(p.curriculum_id).trim() : '';
        if (wantCur) {
          subSel.value = wantCur;
          if (subSel.value !== wantCur) subSel.value = '';
        } else {
          subSel.value = '';
        }
      } else {
        subSel.innerHTML = '<option value="">회차 선택 후 교과목</option>';
        subSel.disabled = true;
      }
    }

    async function loadDocument(tabId) {
      if (!selectedCourseId) {
        clearDocForm(tabId);
        setStatus(tabId, '과정을 선택해 주세요', true);
        return;
      }
      setStatus(tabId, '불러오는 중...', false);
      try {
        const res = await authFetch('/api/ncs/plan-documents?course_id=' + encodeURIComponent(selectedCourseId) + '&evaluation_round=' + encodeURIComponent(selectedRound) + '&doc_type=' + encodeURIComponent(tabId));
        const json = await res.json();
        if (!json?.success) throw new Error(json?.error || 'load failed');
        if (!json.data) {
          clearDocForm(tabId);
          setStatus(tabId, '새 문서', false);
          return;
        }
        applyDocForm(tabId, json.data);
        setUpdatedAt(tabId, json.data.updated_at || null);
        setStatus(tabId, '불러오기 완료', false);
      } catch (e) {
        console.error(e);
        setStatus(tabId, '불러오기 실패', true);
      }
    }

    async function saveDocument(tabId) {
      if (!selectedCourseId) {
        alert('먼저 과정을 선택해 주세요.');
        return;
      }
      const form = getDocForm(tabId);
      setStatus(tabId, '저장 중...', false);
      try {
        const res = await authFetch('/api/ncs/plan-documents', {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token'),
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            course_id: Number(selectedCourseId),
            evaluation_round: Number(selectedRound),
            doc_type: tabId,
            title: form.title,
            payload: form.payload
          })
        });
        const json = await res.json();
        if (!json?.success) throw new Error(json?.error || 'save failed');
        setStatus(tabId, '저장 완료', false);
        const now = new Date();
        const stamp = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0') + '-' + String(now.getDate()).padStart(2, '0') + ' ' + String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0');
        setUpdatedAt(tabId, stamp);
      } catch (e) {
        console.error(e);
        setStatus(tabId, '저장 실패', true);
      }
    }

    function applyRoundBadges() {
      const label = roundLabel(selectedRound);
      document.querySelectorAll('[id^="activeRoundBadge-"]').forEach(function(el) { el.textContent = label; });
    }

    function switchNcsPlanTab(tabId) {
      activeTab = tabId;
      document.querySelectorAll('[data-plan-tab-btn]').forEach(function(btn) {
        const isActive = btn.getAttribute('data-plan-tab-btn') === tabId;
        btn.classList.toggle('bg-slate-900', isActive);
        btn.classList.toggle('text-white', isActive);
        btn.classList.toggle('border-slate-900', isActive);
        btn.classList.toggle('bg-white', !isActive);
        btn.classList.toggle('text-slate-600', !isActive);
        btn.classList.toggle('border-slate-200', !isActive);
      });
      document.querySelectorAll('[data-plan-tab-panel]').forEach(function(panel) {
        panel.classList.toggle('hidden', panel.getAttribute('data-plan-tab-panel') !== tabId);
      });
      const activeDocLabel = document.getElementById('activeDocLabel');
      if (activeDocLabel) activeDocLabel.textContent = TAB_NAMES[tabId] || tabId;
      loadDocument(tabId);
    }

    window.addEventListener('afterprint', function() {
      document.body.removeAttribute('data-print-target');
    });

    document.addEventListener('DOMContentLoaded', async function() {
      if (useFixedCourseId) {
        const hint = document.getElementById('fixedCourseHint');
        if (hint) hint.textContent = '현재 과정 ID: ' + fixedCourseId;
      } else {
        await loadCourseOptions();
        const courseSel = document.getElementById('ncsPlanCourseSelect');
        if (courseSel) {
          courseSel.addEventListener('change', async function() {
            selectedCourseId = courseSel.value || '';
            var subSelReset = document.getElementById('ncsPlanSubjectSelect');
            if (subSelReset) {
              subSelReset.innerHTML = '<option value="">회차 선택 후 교과목</option>';
              subSelReset.disabled = true;
            }
            await loadNcsPlanSessionOptions(selectedCourseId);
            await loadDocument(activeTab);
          });
        }
      }

      var ncsPlanSessionSelect = document.getElementById('ncsPlanSessionSelect');
      if (ncsPlanSessionSelect) {
        ncsPlanSessionSelect.addEventListener('change', async function() {
          await loadNcsPlanSubjectOptions(ncsPlanSessionSelect.value || '');
        });
      }

      const roundSel = document.getElementById('ncsPlanRoundSelect');
      if (roundSel) {
        roundSel.addEventListener('change', async function() {
          selectedRound = parseInt(roundSel.value, 10) || 1;
          applyRoundBadges();
          await loadDocument(activeTab);
        });
      }

      document.querySelectorAll('[data-plan-save-btn]').forEach(function(btn) {
        btn.addEventListener('click', async function() {
          const tabId = btn.getAttribute('data-plan-save-btn');
          if (!tabId) return;
          await saveDocument(tabId);
        });
      });

      document.addEventListener('click', function(e) {
        const target = e.target;
        if (!(target instanceof Element)) return;
        const rmMinutesAtt = target.getAttribute('data-remove-minutes-attachment');
        if (rmMinutesAtt != null) {
          removeMinutesAttachment(parseInt(rmMinutesAtt, 10));
          return;
        }
        const rmMinutesSign = target.getAttribute('data-remove-minutes-signature');
        if (rmMinutesSign != null) {
          removeMinutesSignature(rmMinutesSign);
          return;
        }
        if (target.id === 'scheduleAddRowBtn') {
          addScheduleRowFromInputs();
          return;
        }
        if (target.id === 'questionAddRowBtn') {
          addQuestionFromInputs();
          return;
        }
        if (target.id === 'toolAddRowBtn') {
          addToolFromInputs();
          return;
        }
        if (target.id === 'rubricAddRowBtn') {
          addRubricRowFromInputs();
          return;
        }
        if (target.id === 'achievementAddRowBtn') {
          addAchievementRowFromInputs();
          return;
        }
        if (target.id === 'reviewAddRowBtn') {
          addReviewRowFromInputs();
          return;
        }
        const removeIdx = target.getAttribute('data-remove-schedule-row');
        if (removeIdx != null) {
          const rows = readScheduleRowsFromTable();
          const index = parseInt(removeIdx, 10);
          if (Number.isFinite(index) && index >= 0 && index < rows.length) {
            rows.splice(index, 1);
            renderScheduleRows(rows);
          }
          return;
        }
        const removeQuestionIdx = target.getAttribute('data-remove-question-row');
        if (removeQuestionIdx != null) {
          const rows = readQuestionRowsFromTable();
          const index = parseInt(removeQuestionIdx, 10);
          if (Number.isFinite(index) && index >= 0 && index < rows.length) {
            rows.splice(index, 1);
            renderQuestionRows(rows);
          }
          return;
        }
        const editQuestionIdx = target.getAttribute('data-edit-question-row');
        if (editQuestionIdx != null) {
          const rows = readQuestionRowsFromTable();
          const index = parseInt(editQuestionIdx, 10);
          const row = rows[index];
          if (!row) return;
          const noEl = document.getElementById('questionInputNo');
          const typeEl = document.getElementById('questionInputType');
          const textEl = document.getElementById('questionInputText');
          const scoreEl = document.getElementById('questionInputScore');
          const keywordEl = document.getElementById('questionInputKeyword');
          if (noEl) noEl.value = String(row.no || '');
          if (typeEl) typeEl.value = row.type || '객관식';
          if (textEl) textEl.value = row.text || '';
          if (scoreEl) scoreEl.value = String(row.score || 0);
          if (keywordEl) keywordEl.value = row.keyword || '';
          rows.splice(index, 1);
          renderQuestionRows(rows);
          return;
        }
        const removeToolIdx = target.getAttribute('data-remove-tool-row');
        if (removeToolIdx != null) {
          const rows = readToolRowsFromTable();
          const index = parseInt(removeToolIdx, 10);
          if (Number.isFinite(index) && index >= 0 && index < rows.length) {
            rows.splice(index, 1);
            renderToolRows(rows);
          }
          return;
        }
        const editToolIdx = target.getAttribute('data-edit-tool-row');
        if (editToolIdx != null) {
          const rows = readToolRowsFromTable();
          const index = parseInt(editToolIdx, 10);
          const row = rows[index];
          if (!row) return;
          const nameEl = document.getElementById('toolInputName');
          const typeEl = document.getElementById('toolInputType');
          const durationEl = document.getElementById('toolInputDuration');
          const scoreEl = document.getElementById('toolInputScore');
          const materialsEl = document.getElementById('toolInputMaterials');
          if (nameEl) nameEl.value = row.name || '';
          if (typeEl) typeEl.value = row.type || '실습평가';
          if (durationEl) durationEl.value = row.duration || '';
          if (scoreEl) scoreEl.value = String(row.score || 0);
          if (materialsEl) materialsEl.value = row.materials || '';
          rows.splice(index, 1);
          renderToolRows(rows);
          return;
        }
        const removeRubricIdx = target.getAttribute('data-remove-rubric-row');
        if (removeRubricIdx != null) {
          const rows = readRubricRowsFromTable();
          const index = parseInt(removeRubricIdx, 10);
          if (Number.isFinite(index) && index >= 0 && index < rows.length) {
            rows.splice(index, 1);
            renderRubricRows(rows);
          }
          return;
        }
        const editRubricIdx = target.getAttribute('data-edit-rubric-row');
        if (editRubricIdx != null) {
          const rows = readRubricRowsFromTable();
          const index = parseInt(editRubricIdx, 10);
          const row = rows[index];
          if (!row) return;
          const itemEl = document.getElementById('rubricInputItem');
          const scoreEl = document.getElementById('rubricInputScore');
          const highEl = document.getElementById('rubricInputHigh');
          const midEl = document.getElementById('rubricInputMid');
          const lowEl = document.getElementById('rubricInputLow');
          if (itemEl) itemEl.value = row.item || '';
          if (scoreEl) scoreEl.value = String(row.score || 0);
          if (highEl) highEl.value = row.high || '';
          if (midEl) midEl.value = row.mid || '';
          if (lowEl) lowEl.value = row.low || '';
          rows.splice(index, 1);
          renderRubricRows(rows);
          return;
        }
        const removeAchievementIdx = target.getAttribute('data-remove-achievement-row');
        if (removeAchievementIdx != null) {
          const rows = readAchievementRowsFromTable();
          const index = parseInt(removeAchievementIdx, 10);
          if (Number.isFinite(index) && index >= 0 && index < rows.length) {
            rows.splice(index, 1);
            renderAchievementRows(rows);
          }
          return;
        }
        const editAchievementIdx = target.getAttribute('data-edit-achievement-row');
        if (editAchievementIdx != null) {
          const rows = readAchievementRowsFromTable();
          const index = parseInt(editAchievementIdx, 10);
          const row = rows[index];
          if (!row) return;
          const levelEl = document.getElementById('achievementInputLevel');
          const minEl = document.getElementById('achievementInputMin');
          const maxEl = document.getElementById('achievementInputMax');
          const rateEl = document.getElementById('achievementInputRate');
          const criteriaEl = document.getElementById('achievementInputCriteria');
          if (levelEl) levelEl.value = row.level || '';
          if (minEl) minEl.value = String(row.min_score || 0);
          if (maxEl) maxEl.value = String(row.max_score || 0);
          if (rateEl) rateEl.value = String(row.rate || 0);
          if (criteriaEl) criteriaEl.value = row.criteria || '';
          rows.splice(index, 1);
          renderAchievementRows(rows);
          return;
        }
        const removeReviewIdx = target.getAttribute('data-remove-review-row');
        if (removeReviewIdx != null) {
          const rows = readReviewRowsFromTable();
          const index = parseInt(removeReviewIdx, 10);
          if (Number.isFinite(index) && index >= 0 && index < rows.length) {
            rows.splice(index, 1);
            renderReviewRows(rows);
          }
          return;
        }
        const editReviewIdx = target.getAttribute('data-edit-review-row');
        if (editReviewIdx != null) {
          const rows = readReviewRowsFromTable();
          const index = parseInt(editReviewIdx, 10);
          const row = rows[index];
          if (!row) return;
          const itemEl = document.getElementById('reviewInputItem');
          const ownerEl = document.getElementById('reviewInputOwner');
          const dateEl = document.getElementById('reviewInputDate');
          const commentEl = document.getElementById('reviewInputComment');
          if (itemEl) itemEl.value = row.item || '';
          if (ownerEl) ownerEl.value = row.owner || '';
          if (dateEl) dateEl.value = row.reviewed_at || '';
          if (commentEl) commentEl.value = row.comment || '';
          rows.splice(index, 1);
          renderReviewRows(rows);
          return;
        }
        const toggleReviewDoneIdx = target.getAttribute('data-toggle-review-done');
        if (toggleReviewDoneIdx != null) {
          const rows = readReviewRowsFromTable();
          const index = parseInt(toggleReviewDoneIdx, 10);
          if (Number.isFinite(index) && index >= 0 && index < rows.length) {
            rows[index].done = !rows[index].done;
            renderReviewRows(rows);
          }
          return;
        }
      });

      const totalTarget = document.getElementById('questions_total_target');
      if (totalTarget) {
        totalTarget.addEventListener('input', function() {
          updateQuestionTotalScore(readQuestionRowsFromTable());
        });
      }
      const rubricTotalTarget = document.getElementById('rubric_total_target');
      if (rubricTotalTarget) {
        rubricTotalTarget.addEventListener('input', function() {
          updateRubricTotalScore(readRubricRowsFromTable());
        });
      }
      const achievementTargetScore = document.getElementById('achievement_target_score');
      if (achievementTargetScore) {
        achievementTargetScore.addEventListener('input', function() {
          updateAchievementRateSum(readAchievementRowsFromTable());
        });
      }

      applyRoundBadges();
      switchNcsPlanTab('minutes');
      if (useFixedCourseId) {
        selectedCourseId = fixedCourseId;
        try {
          var cr = await authFetch('/api/courses/' + encodeURIComponent(fixedCourseId));
          var cj = await cr.json();
          var cd = cj && cj.data;
          if (cd && (cd.title || cd.name)) window.__ncsEvalPlanCourseTitle = cd.title || cd.name;
        } catch (e) {}
        await loadNcsPlanSessionOptions(fixedCourseId);
        await loadDocument('minutes');
      }

      var minutesPrintBtn = document.getElementById('minutesPrintBtn');
      if (minutesPrintBtn) {
        minutesPrintBtn.addEventListener('click', function() { printMinutesDocument(); });
      }

      var questionsPreviewBtn = document.getElementById('questionsPreviewBtn');
      if (questionsPreviewBtn) {
        questionsPreviewBtn.addEventListener('click', function() { void openQuestionsPrintPreview(); });
      }
      var questionsPrintBtn = document.getElementById('questionsPrintBtn');
      if (questionsPrintBtn) {
        questionsPrintBtn.addEventListener('click', function() { void printQuestionsDocument(); });
      }
      var questionsPrintPreviewCloseBtn = document.getElementById('questionsPrintPreviewCloseBtn');
      if (questionsPrintPreviewCloseBtn) {
        questionsPrintPreviewCloseBtn.addEventListener('click', function() { closeQuestionsPrintPreview(); });
      }

      var minutesFileAttachBtn = document.getElementById('minutesFileAttachBtn');
      var minutesFileAttachInput = document.getElementById('minutesFileAttachInput');
      if (minutesFileAttachBtn && minutesFileAttachInput) {
        minutesFileAttachBtn.addEventListener('click', function() { minutesFileAttachInput.click(); });
        minutesFileAttachInput.addEventListener('change', async function(ev) {
          var files = ev.target.files;
          if (!files || !files.length) return;
          var items = readMinutesAttachmentsFromDom();
          for (var i = 0; i < files.length; i++) {
            var data = await uploadMinutesFile(files[i], false);
            if (data && data.url) {
              items.push({ url: data.url, name: data.originalName || data.fileName || files[i].name });
            }
          }
          renderMinutesAttachments(items);
          ev.target.value = '';
        });
      }
      var minutesImageInsertBtn = document.getElementById('minutesImageInsertBtn');
      var minutesImageInsertInput = document.getElementById('minutesImageInsertInput');
      if (minutesImageInsertBtn && minutesImageInsertInput) {
        minutesImageInsertBtn.addEventListener('click', function() { minutesImageInsertInput.click(); });
        minutesImageInsertInput.addEventListener('change', async function(ev) {
          var f = ev.target.files && ev.target.files[0];
          if (!f) return;
          var data = await uploadMinutesFile(f, true);
          if (data && data.url) {
            var ta = document.getElementById('minutes_content');
            insertAtCursor(ta, '\\n![이미지](' + data.url + ')\\n');
          }
          ev.target.value = '';
        });
      }

      function bindMinutesSignatureInput(btnId, inputId, previewId) {
        var btn = document.getElementById(btnId);
        var input = document.getElementById(inputId);
        if (!btn || !input) return;
        btn.addEventListener('click', function() { input.click(); });
        input.addEventListener('change', async function(ev) {
          var f = ev.target.files && ev.target.files[0];
          if (!f) return;
          var data = await uploadMinutesFile(f, true);
          if (data && data.url) {
            renderMinutesSignaturePreview(previewId, data.url);
          }
          ev.target.value = '';
        });
      }
      bindMinutesSignatureInput('minutesSignChairBtn', 'minutesSignChairInput', 'minutesSignChairPreview');
      bindMinutesSignatureInput('minutesSignWriterBtn', 'minutesSignWriterInput', 'minutesSignWriterPreview');
      bindMinutesSignatureInput('minutesSignReviewerBtn', 'minutesSignReviewerInput', 'minutesSignReviewerPreview');
    });
  </script>
  `;
}

export const adminNcsEvalPlanHtml = (sidebar = hrdSidebar('ncs-eval-plan')) => `
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>NCS평가계획 - 교육행정 시스템</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
  ${NCS_PLAN_PRINT_STYLES}
</head>
<body class="bg-slate-50">
  <div class="flex h-screen overflow-hidden">
    ${sidebar}
    <div class="flex-1 overflow-y-auto custom-scrollbar">
      <header class="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-200/60">
        <div class="px-6 py-5">
          <h1 class="text-2xl font-black tracking-tight text-slate-900">NCS평가계획</h1>
          <p class="text-sm text-slate-500 mt-1">본평가 준비를 위한 회의록/일정/문항/도구 관련 문서를 탭별로 관리합니다.</p>
        </div>
      </header>
      <main class="p-6">
        ${ncsPlanTabsHtml('admin-ncs-plan', false)}
      </main>
    </div>
  </div>
  ${ncsPlanTabScript(false)}
</body>
</html>
`;

export const adminLmsNcsEvalPlanHtml = (sidebar: string = hrdSidebar('courses')) => `
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>LMS NCS평가계획</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
  ${NCS_PLAN_PRINT_STYLES}
</head>
<body class="bg-slate-50 overflow-hidden">
  <div class="flex h-screen overflow-hidden">
    ${sidebar}
    <div class="flex-1 overflow-y-auto custom-scrollbar">
      ${lmsHeaderHtml('ncs-eval', 'hrd')}
      <section class="px-6 py-6 border-b border-slate-200/60 bg-white">
        <h2 class="text-2xl font-black tracking-tight text-slate-900">NCS평가계획</h2>
        <p class="text-sm text-slate-500 mt-1">LMS 과정 단위에서 NCS 본평가 계획 문서를 탭으로 구분해 관리합니다.</p>
      </section>
      <main class="p-6">
        ${ncsPlanTabsHtml('lms-ncs-plan', true)}
      </main>
    </div>
  </div>
  ${ncsPlanTabScript(true)}
</body>
</html>
`;
