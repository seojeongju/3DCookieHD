import { hrdSidebar } from './components/hrd_sidebar';
import { lmsHeaderHtml } from './components/lms_header';
import { lmsNcsSubnavTabsHtml } from './components/lms_ncs_subnav';

const NCS_PLAN_TAB_ITEMS = [
  { id: 'minutes', label: '평가계획회의록', icon: 'fa-clipboard' },
  { id: 'schedule', label: '평가실시일자', icon: 'fa-calendar-check' },
  { id: 'questions', label: '평가문항제작', icon: 'fa-list-check' },
  { id: 'tools', label: '평가도구제작', icon: 'fa-screwdriver-wrench' },
  { id: 'rubric', label: '평가도구채점기준표', icon: 'fa-table-list' },
  { id: 'achievement', label: '평가성취수준기준표', icon: 'fa-chart-column' },
  { id: 'review', label: '평가도구검토', icon: 'fa-magnifying-glass-chart' },
] as const;

/** 강사 읽기 전용 안내 — body 직하위에 두어 overflow/transform 조상에 가리지 않게 함 */
function ncsTeacherMinutesNoticeModalHtml() {
  return `
    <div id="ncsTeacherMinutesNoticeModal" class="fixed inset-0 bg-black/50 hidden z-[9999] flex items-center justify-center p-4" role="alertdialog" aria-modal="true" aria-labelledby="ncsTeacherMinutesNoticeText">
      <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-200">
        <p id="ncsTeacherMinutesNoticeText" class="text-slate-800 font-bold text-base leading-relaxed">평가계획 회의록 수정에 대한 권한이 없습니다.</p>
        <div class="mt-5 flex justify-end">
          <button type="button" id="ncsTeacherMinutesNoticeOk" class="px-5 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-black hover:bg-slate-800">확인</button>
        </div>
      </div>
    </div>
  `;
}

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
          <div class="bg-slate-100 px-2 py-1.5 font-bold border-b border-black">첨부파일</div>
          <div id="questionsPrintAttachments" class="px-3 py-2 text-[10pt] align-top"></div>
        </div>
        <div class="border border-black mb-2">
          <div class="bg-slate-100 px-2 py-1.5 font-bold text-center border-b border-black">평가문항</div>
          <div class="overflow-x-auto">
            <table class="w-full border-collapse text-[10pt]">
              <thead>
                <tr class="bg-slate-50">
                  <th class="border border-black px-2 py-2 w-24 text-left">과목</th>
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

/** 인쇄·미리보기: 평가 도구제작 */
function toolsPrintSheetHtml() {
  return `
    <div id="toolsPrintRoot" class="ncs-tools-print-root" aria-hidden="true">
      <div class="tools-print-doc max-w-[210mm] mx-auto text-black text-[11pt] leading-relaxed bg-white print:p-0">
        <div class="text-center border-b-2 border-black pb-3 mb-3">
          <h1 class="text-xl font-black tracking-tight">평가 도구제작</h1>
          <p id="toolsPrintSubtitle" class="text-sm mt-1 text-slate-700"></p>
        </div>
        <table class="w-full border-collapse border border-black text-[10pt] mb-4">
          <tbody>
            <tr>
              <td class="border border-black w-[18%] bg-slate-100 px-2 py-2 font-bold text-center">과정명</td>
              <td class="border border-black px-2 py-2" colspan="3" id="toolsPrintCourseName"></td>
            </tr>
            <tr>
              <td class="border border-black bg-slate-100 px-2 py-2 font-bold text-center">평가일시</td>
              <td class="border border-black px-2 py-2" id="toolsPrintEvalDatetime"></td>
              <td class="border border-black bg-slate-100 px-2 py-2 font-bold text-center">평가차수</td>
              <td class="border border-black px-2 py-2" id="toolsPrintRound"></td>
            </tr>
            <tr>
              <td class="border border-black bg-slate-100 px-2 py-2 font-bold text-center">교과목(하위)</td>
              <td class="border border-black px-2 py-2" id="toolsPrintSubject"></td>
              <td class="border border-black bg-slate-100 px-2 py-2 font-bold text-center">훈련생</td>
              <td class="border border-black px-2 py-2" id="toolsPrintTrainee"></td>
            </tr>
            <tr>
              <td class="border border-black bg-slate-100 px-2 py-2 font-bold text-center leading-tight">능력단위명<br/>/ 수준</td>
              <td class="border border-black px-2 py-2" id="toolsPrintUnitLevel"></td>
              <td class="border border-black bg-slate-100 px-2 py-2 font-bold text-center">훈련교사</td>
              <td class="border border-black px-2 py-2" id="toolsPrintInstructor"></td>
            </tr>
            <tr>
              <td class="border border-black bg-slate-100 px-2 py-2 font-bold text-center leading-tight">능력단위<br/>요소명</td>
              <td class="border border-black px-2 py-2" id="toolsPrintElementFocus"></td>
              <td class="border border-black bg-slate-100 px-2 py-2 font-bold text-center">평가시간</td>
              <td class="border border-black px-2 py-2" id="toolsPrintEvalDuration"></td>
            </tr>
            <tr>
              <td class="border border-black bg-slate-100 px-2 py-2 font-bold text-center align-top">성취기준</td>
              <td class="border border-black px-2 py-2" colspan="3" id="toolsPrintAchievement"></td>
            </tr>
            <tr>
              <td class="border border-black bg-slate-100 px-2 py-2 font-bold text-center">문서제목</td>
              <td class="border border-black px-2 py-2" id="toolsPrintDocTitle"></td>
              <td class="border border-black bg-slate-100 px-2 py-2 font-bold text-center">작성자</td>
              <td class="border border-black px-2 py-2" id="toolsPrintWriter"></td>
            </tr>
            <tr>
              <td class="border border-black bg-slate-100 px-2 py-2 font-bold text-center">시간·배점(참고)</td>
              <td class="border border-black px-2 py-2" colspan="3" id="toolsPrintSummary"></td>
            </tr>
          </tbody>
        </table>
        <div class="border border-black mb-2">
          <div class="bg-slate-100 px-2 py-1.5 font-bold border-b border-black">첨부파일</div>
          <div id="toolsPrintAttachments" class="px-3 py-2 text-[10pt] align-top"></div>
        </div>
        <div class="border border-black mb-2">
          <div class="bg-slate-100 px-2 py-1.5 font-bold text-center border-b border-black">평가내용 (NCS 평가준거)</div>
          <div class="overflow-x-auto">
            <table class="w-full border-collapse text-[10pt]">
              <thead>
                <tr class="bg-slate-50">
                  <th class="border border-black px-2 py-2 text-center w-[22%]">능력단위요소</th>
                  <th class="border border-black px-2 py-2 text-center">평가내용</th>
                  <th class="border border-black px-2 py-2 text-center w-[12%]">성취 수준</th>
                </tr>
              </thead>
              <tbody id="toolsPrintCriteriaBody"></tbody>
            </table>
          </div>
        </div>
        <div class="border border-black">
          <div class="bg-slate-100 px-2 py-1.5 font-bold border-b border-black">비고</div>
          <div id="toolsPrintNotes" class="px-3 py-2 whitespace-pre-wrap min-h-[3rem] text-[10pt]"></div>
        </div>
      </div>
    </div>
  `;
}

/** 인쇄·미리보기: 평가 도구 채점기준표 */
function rubricPrintSheetHtml() {
  return `
    <div id="rubricPrintRoot" class="ncs-rubric-print-root" aria-hidden="true">
      <div class="rubric-print-doc max-w-[210mm] mx-auto text-black text-[11pt] leading-relaxed bg-white print:p-0">
        <div class="text-center border-b-2 border-black pb-3 mb-3">
          <h1 class="text-xl font-black tracking-tight">평가도구 채점기준표</h1>
          <p id="rubricPrintSubtitle" class="text-sm mt-1 text-slate-700"></p>
        </div>
        <table class="w-full border-collapse border border-black text-[10pt] mb-4">
          <tbody>
            <tr>
              <td class="border border-black w-[18%] bg-slate-100 px-2 py-2 font-bold text-center">과정명</td>
              <td class="border border-black px-2 py-2" colspan="3" id="rubricPrintCourseName"></td>
            </tr>
            <tr>
              <td class="border border-black bg-slate-100 px-2 py-2 font-bold text-center">교과목(하위)</td>
              <td class="border border-black px-2 py-2" id="rubricPrintSubject"></td>
              <td class="border border-black w-[18%] bg-slate-100 px-2 py-2 font-bold text-center">평가차수</td>
              <td class="border border-black px-2 py-2" id="rubricPrintRound"></td>
            </tr>
            <tr>
              <td class="border border-black bg-slate-100 px-2 py-2 font-bold text-center">문서제목</td>
              <td class="border border-black px-2 py-2" id="rubricPrintDocTitle"></td>
              <td class="border border-black bg-slate-100 px-2 py-2 font-bold text-center">작성자</td>
              <td class="border border-black px-2 py-2" id="rubricPrintWriter"></td>
            </tr>
            <tr>
              <td class="border border-black bg-slate-100 px-2 py-2 font-bold text-center">배점</td>
              <td class="border border-black px-2 py-2" colspan="3" id="rubricPrintScoreSummary"></td>
            </tr>
          </tbody>
        </table>
        <div class="border border-black mb-2">
          <div class="bg-slate-100 px-2 py-1.5 font-bold border-b border-black">첨부파일</div>
          <div id="rubricPrintAttachments" class="px-3 py-2 text-[10pt] align-top"></div>
        </div>
        <div class="border border-black mb-2">
          <div class="bg-slate-100 px-2 py-1.5 font-bold text-center border-b border-black">채점기준 항목</div>
          <div class="overflow-x-auto">
            <table class="w-full border-collapse text-[10pt]">
              <thead>
                <tr class="bg-slate-50">
                  <th class="border border-black px-2 py-2 text-left">평가항목</th>
                  <th class="border border-black px-2 py-2 w-14 text-center">배점</th>
                  <th class="border border-black px-2 py-2 text-left">상(우수)</th>
                  <th class="border border-black px-2 py-2 text-left">중(보통)</th>
                  <th class="border border-black px-2 py-2 text-left">하(미흡)</th>
                </tr>
              </thead>
              <tbody id="rubricPrintRowsBody"></tbody>
            </table>
          </div>
        </div>
        <div class="border border-black">
          <div class="bg-slate-100 px-2 py-1.5 font-bold border-b border-black">비고</div>
          <div id="rubricPrintNotes" class="px-3 py-2 whitespace-pre-wrap min-h-[3rem] text-[10pt]"></div>
        </div>
      </div>
    </div>
  `;
}

/** 인쇄·미리보기: 평가 성취수준 기준표 */
function achievementPrintSheetHtml() {
  return `
    <div id="achievementPrintRoot" class="ncs-achievement-print-root" aria-hidden="true">
      <div class="achievement-print-doc max-w-[210mm] mx-auto text-black text-[11pt] leading-relaxed bg-white print:p-0">
        <div class="text-center border-b-2 border-black pb-3 mb-3">
          <h1 class="text-xl font-black tracking-tight">평가성취수준기준표</h1>
          <p id="achievementPrintSubtitle" class="text-sm mt-1 text-slate-700"></p>
        </div>
        <table class="w-full border-collapse border border-black text-[10pt] mb-4">
          <tbody>
            <tr>
              <td class="border border-black w-[18%] bg-slate-100 px-2 py-2 font-bold text-center">과정명</td>
              <td class="border border-black px-2 py-2" colspan="3" id="achievementPrintCourseName"></td>
            </tr>
            <tr>
              <td class="border border-black bg-slate-100 px-2 py-2 font-bold text-center">교과목(하위)</td>
              <td class="border border-black px-2 py-2" id="achievementPrintSubject"></td>
              <td class="border border-black w-[18%] bg-slate-100 px-2 py-2 font-bold text-center">평가차수</td>
              <td class="border border-black px-2 py-2" id="achievementPrintRound"></td>
            </tr>
            <tr>
              <td class="border border-black bg-slate-100 px-2 py-2 font-bold text-center">문서제목</td>
              <td class="border border-black px-2 py-2" id="achievementPrintDocTitle"></td>
              <td class="border border-black bg-slate-100 px-2 py-2 font-bold text-center">작성자</td>
              <td class="border border-black px-2 py-2" id="achievementPrintWriter"></td>
            </tr>
            <tr>
              <td class="border border-black bg-slate-100 px-2 py-2 font-bold text-center">만점·합계비율</td>
              <td class="border border-black px-2 py-2" colspan="3" id="achievementPrintSummary"></td>
            </tr>
          </tbody>
        </table>
        <div class="border border-black mb-2">
          <div class="bg-slate-100 px-2 py-1.5 font-bold border-b border-black">첨부파일</div>
          <div id="achievementPrintAttachments" class="px-3 py-2 text-[10pt] align-top"></div>
        </div>
        <div class="border border-black mb-2">
          <div class="bg-slate-100 px-2 py-1.5 font-bold text-center border-b border-black">성취수준 항목</div>
          <div class="overflow-x-auto">
            <table class="w-full border-collapse text-[10pt]">
              <thead>
                <tr class="bg-slate-50">
                  <th class="border border-black px-2 py-2 w-16 text-center">성취수준</th>
                  <th class="border border-black px-2 py-2 text-left">종합 성취기준</th>
                  <th class="border border-black px-2 py-2 w-20 text-center">점수분배</th>
                  <th class="border border-black px-2 py-2 w-16 text-center">Fail</th>
                </tr>
              </thead>
              <tbody id="achievementPrintRowsBody"></tbody>
            </table>
          </div>
        </div>
        <div class="border border-black">
          <div class="bg-slate-100 px-2 py-1.5 font-bold border-b border-black">비고</div>
          <div id="achievementPrintNotes" class="px-3 py-2 whitespace-pre-wrap min-h-[3rem] text-[10pt]"></div>
        </div>
      </div>
    </div>
  `;
}

/** 인쇄·미리보기: 평가 도구 검토 */
function reviewPrintSheetHtml() {
  return `
    <div id="reviewPrintRoot" class="ncs-review-print-root" aria-hidden="true">
      <div class="review-print-doc max-w-[210mm] mx-auto text-black text-[11pt] leading-relaxed bg-white print:p-0">
        <div class="flex items-start justify-between gap-4 border border-black mb-0">
          <div class="flex-1 py-4 px-3 text-center">
            <h1 class="text-xl font-black tracking-tight">평가도구 검토</h1>
            <p id="reviewPrintSubtitle" class="text-sm mt-1 text-slate-700"></p>
          </div>
          <table class="border-collapse border-l border-black text-center text-[10pt] shrink-0">
            <tbody>
              <tr>
                <td class="border border-black px-1 py-1 w-8 align-middle bg-slate-100 font-bold" rowspan="2">결<br/>재</td>
                <td class="border border-black px-3 py-1 w-16 bg-slate-50" id="reviewPrintApprovalRoleChair">팀장</td>
                <td class="border border-black px-3 py-1 w-16 bg-slate-50" id="reviewPrintApprovalRoleWriter">실장</td>
                <td class="border border-black px-3 py-1 w-16 bg-slate-50" id="reviewPrintApprovalRoleReviewer">원장</td>
              </tr>
              <tr>
                <td class="border border-black h-14 align-middle text-center text-[9pt] text-slate-400" id="reviewPrintSignChair">(서명)</td>
                <td class="border border-black h-14 align-middle text-center text-[9pt] text-slate-400" id="reviewPrintSignWriter">(서명)</td>
                <td class="border border-black h-14 align-middle text-center text-[9pt] text-slate-400" id="reviewPrintSignReviewer">(서명)</td>
              </tr>
            </tbody>
          </table>
        </div>
        <table class="w-full border-collapse border border-t-0 border-black text-[10pt] mb-4">
          <tbody>
            <tr>
              <td class="border border-black w-[18%] bg-slate-100 px-2 py-2 font-bold text-center">과정명</td>
              <td class="border border-black px-2 py-2" colspan="3" id="reviewPrintCourseName"></td>
            </tr>
            <tr>
              <td class="border border-black bg-slate-100 px-2 py-2 font-bold text-center">교과목(하위)</td>
              <td class="border border-black px-2 py-2" id="reviewPrintSubject"></td>
              <td class="border border-black w-[18%] bg-slate-100 px-2 py-2 font-bold text-center">평가차수</td>
              <td class="border border-black px-2 py-2" id="reviewPrintRound"></td>
            </tr>
            <tr>
              <td class="border border-black bg-slate-100 px-2 py-2 font-bold text-center">문서제목</td>
              <td class="border border-black px-2 py-2" id="reviewPrintDocTitle"></td>
              <td class="border border-black bg-slate-100 px-2 py-2 font-bold text-center">작성자</td>
              <td class="border border-black px-2 py-2" id="reviewPrintWriter"></td>
            </tr>
            <tr>
              <td class="border border-black bg-slate-100 px-2 py-2 font-bold text-center">검토자</td>
              <td class="border border-black px-2 py-2" id="reviewPrintReviewer"></td>
              <td class="border border-black bg-slate-100 px-2 py-2 font-bold text-center">완료율</td>
              <td class="border border-black px-2 py-2" id="reviewPrintCompletion"></td>
            </tr>
          </tbody>
        </table>
        <div class="border border-black mb-2">
          <div class="bg-slate-100 px-2 py-1.5 font-bold border-b border-black">첨부파일</div>
          <div id="reviewPrintAttachments" class="px-3 py-2 text-[10pt] align-top"></div>
        </div>
        <div class="border border-black mb-2">
          <div class="bg-slate-100 px-2 py-1.5 font-bold text-center border-b border-black">검토 항목</div>
          <div class="overflow-x-auto">
            <table class="w-full border-collapse text-[10pt]">
              <thead>
                <tr class="bg-slate-50">
                  <th class="border border-black px-2 py-2 text-left w-[26%]">검토항목</th>
                  <th class="border border-black px-2 py-2 text-left">1안 검토사항</th>
                  <th class="border border-black px-2 py-2 w-16 text-center">적절</th>
                  <th class="border border-black px-2 py-2 w-24 text-center">수정 필요</th>
                </tr>
              </thead>
              <tbody id="reviewPrintRowsBody"></tbody>
            </table>
          </div>
        </div>
        <div class="border border-black">
          <div class="bg-slate-100 px-2 py-1.5 font-bold border-b border-black">종합의견</div>
          <div id="reviewPrintNotes" class="px-3 py-2 whitespace-pre-wrap min-h-[3rem] text-[10pt]"></div>
        </div>
      </div>
    </div>
  `;
}

const NCS_PLAN_PRINT_STYLES = `
<style>
.ncs-minutes-print-root,
.ncs-questions-print-root,
.ncs-tools-print-root,
.ncs-rubric-print-root,
.ncs-achievement-print-root,
.ncs-review-print-root {
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
.minutes-image-resizable {
  display: inline-block;
  vertical-align: top;
  resize: both;
  overflow: auto;
  min-width: 120px;
  min-height: 80px;
  max-width: 100%;
  border: 1px solid #d0d7de;
  background: #fff;
  padding: 2px;
  margin: 4px 0;
}
.minutes-image-resizable img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
  pointer-events: none;
  user-select: none;
}
.minutes-image-resizable.is-selected {
  border: 2px solid #0ea5e9;
  box-shadow: 0 0 0 2px rgba(14, 165, 233, 0.2);
}
#minutes_content:empty::before {
  content: "회의 내용을 입력하세요.";
  color: #94a3b8;
}
#questionInputText:empty::before {
  content: "문항 내용을 입력하세요.";
  color: #94a3b8;
}
#tools_notes:empty::before {
  content: "비고를 입력하세요.";
  color: #94a3b8;
}
#achievement_notes:empty::before {
  content: "필독/비고 내용을 입력하세요.";
  color: #94a3b8;
}
#review_notes:empty::before {
  content: "기타의견/종합의견을 입력하세요.";
  color: #94a3b8;
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
.ncs-tools-print-root.is-preview {
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
.ncs-tools-print-root.is-preview .tools-print-doc {
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.35);
  padding: 12mm;
}
.ncs-rubric-print-root.is-preview {
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
.ncs-rubric-print-root.is-preview .rubric-print-doc {
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.35);
  padding: 12mm;
}
.ncs-achievement-print-root.is-preview {
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
.ncs-achievement-print-root.is-preview .achievement-print-doc {
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.35);
  padding: 12mm;
}
.ncs-review-print-root.is-preview {
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
.ncs-review-print-root.is-preview .review-print-doc {
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
  body[data-print-target="tools"] .ncs-tools-print-root,
  body[data-print-target="tools"] .ncs-tools-print-root * {
    visibility: visible !important;
  }
  body[data-print-target="tools"] .ncs-tools-print-root {
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
  body[data-print-target="tools"] .ncs-tools-print-root.is-preview {
    display: block !important;
    background: #fff !important;
  }
  body[data-print-target="rubric"] .ncs-rubric-print-root,
  body[data-print-target="rubric"] .ncs-rubric-print-root * {
    visibility: visible !important;
  }
  body[data-print-target="rubric"] .ncs-rubric-print-root {
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
  body[data-print-target="rubric"] .ncs-rubric-print-root.is-preview {
    display: block !important;
    background: #fff !important;
  }
  body[data-print-target="achievement"] .ncs-achievement-print-root,
  body[data-print-target="achievement"] .ncs-achievement-print-root * {
    visibility: visible !important;
  }
  body[data-print-target="achievement"] .ncs-achievement-print-root {
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
  body[data-print-target="achievement"] .ncs-achievement-print-root.is-preview {
    display: block !important;
    background: #fff !important;
  }
  body[data-print-target="review"] .ncs-review-print-root,
  body[data-print-target="review"] .ncs-review-print-root * {
    visibility: visible !important;
  }
  body[data-print-target="review"] .ncs-review-print-root {
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
  body[data-print-target="review"] .ncs-review-print-root.is-preview {
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
                      <label class="inline-flex items-center gap-2">
                        <span class="text-[11px] text-slate-500 font-bold">저장문서</span>
                        <select id="planDocSelect-${item.id}" data-plan-doc-select="${item.id}" class="px-2.5 py-2 rounded-xl border border-slate-200 text-xs bg-white min-w-[13rem]">
                          <option value="">최신 문서</option>
                        </select>
                      </label>
                      <button type="button" data-plan-doc-list-reload="${item.id}" class="px-2.5 py-2 rounded-xl border border-slate-200 bg-white text-xs font-black text-slate-700 hover:bg-slate-50 transition" title="저장 목록 새로고침">
                        <i class="fas fa-rotate-right"></i>
                      </button>
                      ${item.id === 'minutes' ? `
                      <button type="button" id="minutesPrintBtn" class="px-3 py-2 rounded-xl bg-amber-500 text-white text-xs font-black hover:bg-amber-600 transition">
                        <i class="fas fa-print mr-1"></i>인쇄
                      </button>
                      ` : ''}
                      ${(item.id === 'minutes' || item.id === 'questions' || item.id === 'tools' || item.id === 'rubric' || item.id === 'achievement' || item.id === 'review') ? `
                      <button type="button" data-plan-new-btn="${item.id}" class="px-3 py-2 rounded-xl bg-indigo-500 text-white text-xs font-black hover:bg-indigo-600 transition">
                        <i class="fas fa-file-circle-plus mr-1"></i>새문서 작성
                      </button>
                      ` : ''}
                      ${item.id === 'questions' ? `
                      <button type="button" id="questionsPrintBtn" class="px-3 py-2 rounded-xl bg-amber-500 text-white text-xs font-black hover:bg-amber-600 transition">
                        <i class="fas fa-print mr-1"></i>인쇄
                      </button>
                      ` : ''}
                      ${item.id === 'tools' ? `
                      <button type="button" id="toolsPrintBtn" class="px-3 py-2 rounded-xl bg-amber-500 text-white text-xs font-black hover:bg-amber-600 transition">
                        <i class="fas fa-print mr-1"></i>인쇄
                      </button>
                      ` : ''}
                      ${item.id === 'rubric' ? `
                      <button type="button" id="rubricPrintBtn" class="px-3 py-2 rounded-xl bg-amber-500 text-white text-xs font-black hover:bg-amber-600 transition">
                        <i class="fas fa-print mr-1"></i>인쇄
                      </button>
                      ` : ''}
                      ${item.id === 'achievement' ? `
                      <button type="button" id="achievementPrintBtn" class="px-3 py-2 rounded-xl bg-amber-500 text-white text-xs font-black hover:bg-amber-600 transition">
                        <i class="fas fa-print mr-1"></i>인쇄
                      </button>
                      ` : ''}
                      ${item.id === 'review' ? `
                      <button type="button" id="reviewPrintBtn" class="px-3 py-2 rounded-xl bg-amber-500 text-white text-xs font-black hover:bg-amber-600 transition">
                        <i class="fas fa-print mr-1"></i>인쇄
                      </button>
                      ` : ''}
                      <button type="button" data-plan-save-btn="${item.id}" class="px-3 py-2 rounded-xl bg-emerald-500 text-white text-xs font-black hover:bg-emerald-600 transition">
                        <i class="fas fa-floppy-disk mr-1"></i>문서 저장
                      </button>
                      <button type="button" id="planDocUpdateBtn-${item.id}" data-plan-update-btn="${item.id}" class="px-3 py-2 rounded-xl bg-blue-500 text-white text-xs font-black hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed" disabled>
                        <i class="fas fa-pen-to-square mr-1"></i>저장문서 수정
                      </button>
                      <button type="button" id="planDocDeleteBtn-${item.id}" data-plan-delete-btn="${item.id}" class="px-3 py-2 rounded-xl bg-rose-500 text-white text-xs font-black hover:bg-rose-600 transition disabled:opacity-50 disabled:cursor-not-allowed" disabled>
                        <i class="fas fa-trash mr-1"></i>저장문서 삭제
                      </button>
                  </div>
              </div>
              ${item.id === 'minutes' ? `
                <div class="rounded-2xl border border-slate-200/70 overflow-hidden">
                  <input type="file" id="minutesFileAttachInput" multiple class="hidden" />
                  <input type="file" id="minutesImageInsertInput" accept="image/jpeg,image/png,image/gif,image/webp" class="hidden" />
                  <input type="file" id="minutesSignChairInput" accept="image/jpeg,image/png,image/gif,image/webp" class="hidden" />
                  <input type="file" id="minutesSignWriterInput" accept="image/jpeg,image/png,image/gif,image/webp" class="hidden" />
                  <input type="file" id="minutesSignReviewerInput" accept="image/jpeg,image/png,image/gif,image/webp" class="hidden" />
                  <input type="hidden" id="minutes_chairperson" />
                  <input type="hidden" id="minutes_writer" />
                  <input type="hidden" id="minutes_reviewer" />

                  <div class="p-3 border-b border-slate-200/70 bg-slate-50/80 flex flex-wrap items-center justify-between gap-2">
                    <div class="flex flex-wrap items-center gap-2">
                      <button type="button" id="minutesImageInsertBtn" class="px-3 py-1.5 rounded-lg bg-sky-500 text-white text-xs font-black hover:bg-sky-600 transition"><i class="fas fa-image mr-1"></i>이미지 삽입</button>
                      <button type="button" id="minutesImageDeleteBtn" class="px-3 py-1.5 rounded-lg border border-rose-200 bg-rose-50 text-rose-700 text-xs font-black hover:bg-rose-100 transition"><i class="fas fa-trash mr-1"></i>이미지 삭제</button>
                      <button type="button" id="minutesPrintBtnInline" class="px-3 py-1.5 rounded-lg bg-amber-500 text-white text-xs font-black hover:bg-amber-600 transition"><i class="fas fa-print mr-1"></i>프린트</button>
                      <button type="button" id="minutesFileAttachBtn" class="px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-black text-slate-700 hover:bg-slate-100 transition">파일첨부</button>
                    </div>
                    <div class="flex flex-wrap items-center gap-2">
                      <button type="button" id="minutesQuickTodayBtn" class="px-2.5 py-1.5 rounded-lg border border-sky-200 bg-white text-xs font-black text-sky-700 hover:bg-sky-50 transition">오늘 날짜</button>
                      <button type="button" id="minutesQuickTitleBtn" class="px-2.5 py-1.5 rounded-lg border border-sky-200 bg-white text-xs font-black text-sky-700 hover:bg-sky-50 transition">제목 자동입력</button>
                      <button type="button" id="minutesQuickAttendeesBtn" class="px-2.5 py-1.5 rounded-lg border border-sky-200 bg-white text-xs font-black text-sky-700 hover:bg-sky-50 transition">참석자 초안</button>
                    </div>
                  </div>

                  <div class="p-4 bg-white overflow-x-auto">
                    <table class="w-full min-w-[980px] border border-black text-xs">
                      <tr>
                        <td class="border border-black text-center font-black text-3xl py-8" colspan="6">평가 계획 회의록</td>
                        <td class="border border-black text-center font-bold w-12">결<br/>재</td>
                        <td class="border border-black p-0">
                          <table class="w-full h-full text-center">
                            <tr>
                              <td class="border-b border-black font-bold"><div id="minutes_approval_role_chair" contenteditable="true" class="px-2 py-1 outline-none">담당</div></td>
                              <td class="border-b border-black border-l border-black font-bold"><div id="minutes_approval_role_writer" contenteditable="true" class="px-2 py-1 outline-none">팀장</div></td>
                              <td class="border-b border-black border-l border-black font-bold"><div id="minutes_approval_role_reviewer" contenteditable="true" class="px-2 py-1 outline-none">원장</div></td>
                            </tr>
                            <tr class="h-16">
                              <td><div id="minutesSignChairPreview" class="h-full flex items-center justify-center text-[11px] text-slate-400">(서명 없음)</div></td>
                              <td class="border-l border-black"><div id="minutesSignWriterPreview" class="h-full flex items-center justify-center text-[11px] text-slate-400">(서명 없음)</div></td>
                              <td class="border-l border-black"><div id="minutesSignReviewerPreview" class="h-full flex items-center justify-center text-[11px] text-slate-400">(서명 없음)</div></td>
                            </tr>
                            <tr>
                              <td class="border-t border-black">
                                <div class="flex">
                                  <button type="button" id="minutesSignChairBtn" class="flex-1 text-[10px] py-1 hover:bg-slate-50">서명</button>
                                  <button type="button" data-remove-minutes-signature="chairperson" class="px-1.5 text-[10px] text-rose-600 hover:bg-rose-50 border-l border-black">삭제</button>
                                </div>
                              </td>
                              <td class="border-t border-black border-l border-black">
                                <div class="flex">
                                  <button type="button" id="minutesSignWriterBtn" class="flex-1 text-[10px] py-1 hover:bg-slate-50">서명</button>
                                  <button type="button" data-remove-minutes-signature="writer" class="px-1.5 text-[10px] text-rose-600 hover:bg-rose-50 border-l border-black">삭제</button>
                                </div>
                              </td>
                              <td class="border-t border-black border-l border-black">
                                <div class="flex">
                                  <button type="button" id="minutesSignReviewerBtn" class="flex-1 text-[10px] py-1 hover:bg-slate-50">서명</button>
                                  <button type="button" data-remove-minutes-signature="reviewer" class="px-1.5 text-[10px] text-rose-600 hover:bg-rose-50 border-l border-black">삭제</button>
                                </div>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td class="border border-black text-center bg-slate-50 font-bold w-24">과정명</td>
                        <td class="border border-black px-2 py-1" colspan="5"><div id="minutes_doc_title" contenteditable="true" class="outline-none min-h-[1.25rem]"></div></td>
                        <td class="border border-black text-center bg-slate-50 font-bold w-24">개설회차</td>
                        <td class="border border-black px-2 py-1"><div id="minutes_session" contenteditable="true" class="outline-none min-h-[1.25rem] text-center"></div></td>
                      </tr>
                      <tr>
                        <td class="border border-black text-center bg-slate-50 font-bold">회의일시</td>
                        <td class="border border-black px-2 py-1" colspan="3"><div id="minutes_meeting_date" contenteditable="true" class="outline-none min-h-[1.25rem]"></div></td>
                        <td class="border border-black text-center bg-slate-50 font-bold">회의장소</td>
                        <td class="border border-black px-2 py-1" colspan="3"><div id="minutes_meeting_location" contenteditable="true" class="outline-none min-h-[1.25rem]"></div></td>
                      </tr>
                      <tr>
                        <td class="border border-black text-center bg-slate-50 font-bold">참석자</td>
                        <td class="border border-black px-2 py-1" colspan="5"><div id="minutes_attendees" contenteditable="true" class="outline-none min-h-[1.25rem]"></div></td>
                        <td class="border border-black text-center bg-slate-50 font-bold">평가차수</td>
                        <td class="border border-black px-2 py-1 text-center"><span id="minutesRoundCell">1차</span></td>
                      </tr>
                      <tr>
                        <td class="border border-black text-center bg-slate-50 font-bold">회의안건</td>
                        <td class="border border-black px-2 py-1" colspan="7"><div id="minutes_agenda" contenteditable="true" class="outline-none min-h-[1.5rem]"></div></td>
                      </tr>
                      <tr>
                        <td class="border border-black text-center bg-slate-50 font-bold align-top py-2">회의내용</td>
                        <td class="border border-black p-0" colspan="7">
                          <div id="minutes_content" contenteditable="true" class="w-full min-h-[360px] px-3 py-2 outline-none border-0 text-sm whitespace-pre-wrap leading-relaxed"></div>
                        </td>
                      </tr>
                      <tr>
                        <td class="border border-black text-center bg-slate-50 font-bold">비고</td>
                        <td class="border border-black p-0" colspan="7">
                          <textarea id="minutes_notes" class="w-full h-20 px-3 py-2 outline-none resize-y border-0 text-sm"></textarea>
                        </td>
                      </tr>
                    </table>
                  </div>

                  <div class="p-4 border-t border-slate-200/70 bg-slate-50/80">
                    <div class="flex items-center justify-between gap-3 mb-1.5">
                      <label class="block text-xs font-black text-slate-600">회의 내용</label>
                      <span id="minutesContentCount" class="text-[11px] text-slate-500">0자</span>
                    </div>
                    <div class="flex items-center justify-between gap-3 mb-1.5">
                      <label class="block text-xs font-black text-slate-600">비고</label>
                      <span id="minutesNotesCount" class="text-[11px] text-slate-500">0자</span>
                    </div>
                    <label class="block text-xs font-black text-slate-600 mb-1.5">첨부파일</label>
                    <div id="minutesAttachmentsList" class="flex flex-wrap gap-2 min-h-[2.5rem]"></div>
                    <div class="mt-3 text-[11px] text-slate-500">이미지는 커서 위치에 삽입됩니다. 본문 작성은 회의록 양식 셀에서 직접 입력하세요.</div>
                  </div>
                </div>
              ` : item.id === 'schedule' ? `
                <div class="rounded-2xl border border-slate-200/70 overflow-hidden">
                  <div class="p-4 bg-white overflow-x-auto">
                    <table class="w-full min-w-[980px] border border-black text-xs">
                      <tr>
                        <td class="border border-black text-center font-black text-3xl py-6" colspan="8">평가 실시 일자</td>
                      </tr>
                      <tr>
                        <td class="border border-black text-center bg-slate-50 font-bold w-24">문서제목</td>
                        <td class="border border-black px-2 py-1" colspan="7">
                          <input id="schedule_doc_title" class="w-full min-h-[1.25rem] px-1 py-0.5 border-0 outline-none bg-transparent text-sm" placeholder="평가차수 선택 시 자동 입력됩니다" />
                        </td>
                      </tr>
                      <tr>
                        <td class="border border-black text-center bg-slate-50 font-bold">작성자</td>
                        <td class="border border-black px-2 py-1" colspan="7">
                          <input id="schedule_writer" class="w-full min-h-[1.25rem] px-1 py-0.5 border-0 outline-none bg-transparent text-sm" placeholder="작성자" />
                        </td>
                      </tr>
                      <tr>
                        <td class="border border-black text-center bg-slate-50 font-bold align-top py-2">일정 입력</td>
                        <td class="border border-black p-2" colspan="7">
                          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-2 items-end">
                            <label class="block text-[11px] font-bold text-slate-600 lg:col-span-2">교과목 · 하위 과목
                              <select id="scheduleSubjectSelect" class="mt-0.5 w-full px-2 py-1.5 border border-slate-200 rounded bg-white text-sm disabled:opacity-60" disabled>
                                <option value="">과정 선택 후 교과목</option>
                              </select>
                            </label>
                            <label class="block text-[11px] font-bold text-slate-600 sm:col-span-1">평가일정
                              <input id="scheduleInputDate" type="date" class="mt-0.5 w-full px-2 py-1.5 border border-slate-200 rounded bg-white text-sm" />
                            </label>
                            <label class="block text-[11px] font-bold text-slate-600 sm:col-span-1">시간
                              <input id="scheduleInputTime" type="time" class="mt-0.5 w-full px-2 py-1.5 border border-slate-200 rounded bg-white text-sm" />
                            </label>
                            <label class="block text-[11px] font-bold text-slate-600 sm:col-span-1">장소
                              <input id="scheduleInputPlace" class="mt-0.5 w-full px-2 py-1.5 border border-slate-200 rounded bg-white text-sm" placeholder="장소" />
                            </label>
                            <label class="block text-[11px] font-bold text-slate-600 sm:col-span-1">배정 강사
                              <select id="scheduleInstructorSelect" class="mt-0.5 w-full px-2 py-1.5 border border-slate-200 rounded bg-white text-sm disabled:opacity-60" disabled>
                                <option value="">강사 선택</option>
                              </select>
                            </label>
                            <div class="sm:col-span-2 lg:col-span-1 flex justify-end pt-4 sm:pt-0">
                              <button type="button" id="scheduleAddRowBtn" class="w-full sm:w-auto px-4 py-2 rounded-lg bg-sky-600 text-white text-sm font-black hover:bg-sky-700 transition whitespace-nowrap">
                                <i class="fas fa-plus mr-1"></i><span id="scheduleAddRowBtnLabel">일정 추가</span>
                              </button>
                            </div>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td class="border border-black text-center bg-slate-50 font-bold align-top py-2">평가일정</td>
                        <td class="border border-black p-0" colspan="7">
                          <div class="overflow-x-auto">
                            <table class="w-full min-w-[800px] border-collapse">
                              <thead>
                                <tr>
                                  <th class="border border-black px-2 py-2 text-center text-xs font-black text-slate-800 bg-slate-50 min-w-[8rem]">과목</th>
                                  <th class="border border-black px-2 py-2 text-center text-xs font-black text-slate-800 bg-slate-50">평가일정</th>
                                  <th class="border border-black px-2 py-2 text-center text-xs font-black text-slate-800 bg-slate-50 w-28">시간</th>
                                  <th class="border border-black px-2 py-2 text-center text-xs font-black text-slate-800 bg-slate-50">장소</th>
                                  <th class="border border-black px-2 py-2 text-center text-xs font-black text-slate-800 bg-slate-50 min-w-[7rem]">배정 강사</th>
                                  <th class="border border-black px-2 py-2 text-center text-xs font-black text-slate-800 bg-slate-50 w-24">수정</th>
                                  <th class="border border-black px-2 py-2 text-center text-xs font-black text-slate-800 bg-slate-50 w-24">삭제</th>
                                </tr>
                              </thead>
                              <tbody id="scheduleRowsBody" class="bg-white"></tbody>
                            </table>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td class="border border-black text-center bg-slate-50 font-bold">비고</td>
                        <td class="border border-black p-0" colspan="7">
                          <textarea id="schedule_notes" class="w-full h-28 px-3 py-2 outline-none resize-y border-0 text-sm"></textarea>
                        </td>
                      </tr>
                    </table>
                  </div>
                </div>
              ` : item.id === 'questions' ? `
                <div class="rounded-2xl border border-slate-200/70 overflow-hidden">
                  <input type="file" id="questionsFileAttachInput" multiple class="hidden" />
                  <input type="file" id="questionsImageInsertInput" accept="image/jpeg,image/png,image/gif,image/webp" class="hidden" />

                  <div class="p-3 border-b border-slate-200/70 bg-slate-50/80 flex flex-wrap items-center justify-between gap-2">
                    <div class="flex flex-wrap items-center gap-2">
                      <button type="button" id="questionsImageInsertBtn" class="px-3 py-1.5 rounded-lg bg-sky-500 text-white text-xs font-black hover:bg-sky-600 transition"><i class="fas fa-image mr-1"></i>이미지 삽입</button>
                      <button type="button" id="questionsImageDeleteBtn" class="px-3 py-1.5 rounded-lg border border-rose-200 bg-rose-50 text-rose-700 text-xs font-black hover:bg-rose-100 transition"><i class="fas fa-trash mr-1"></i>이미지 삭제</button>
                      <button type="button" id="questionsFileAttachBtn" class="px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-black text-slate-700 hover:bg-slate-100 transition"><i class="fas fa-paperclip mr-1"></i>파일첨부</button>
                    </div>
                    <div class="text-[11px] text-slate-500">문항 작성란에서 이미지 즉시표시/리사이즈/삭제를 지원합니다.</div>
                  </div>

                  <div class="p-4 bg-white overflow-x-auto">
                    <table class="w-full min-w-[980px] border border-black text-xs">
                      <tr>
                        <td class="border border-black text-center font-black text-3xl py-6" colspan="8">평가 문항제작</td>
                      </tr>
                      <tr>
                        <td class="border border-black text-center bg-slate-50 font-bold w-20">과정명</td>
                        <td class="border border-black px-2 py-1" colspan="5"><div id="questions_doc_title" contenteditable="true" class="outline-none min-h-[1.25rem]"></div></td>
                        <td class="border border-black text-center bg-slate-50 font-bold w-20">출제자</td>
                        <td class="border border-black px-2 py-1"><div id="questions_writer" contenteditable="true" class="outline-none min-h-[1.25rem]"></div></td>
                      </tr>
                      <tr>
                        <td class="border border-black text-center bg-slate-50 font-bold">배점</td>
                        <td class="border border-black px-2 py-1" colspan="7">
                          <div class="flex items-center justify-between gap-2">
                            <div class="text-slate-700"><span id="questionsTotalScoreLabel" class="font-black">0점</span></div>
                            <div class="flex items-center gap-2">
                              <span class="text-slate-500">목표 총점</span>
                              <input id="questions_total_target" type="number" min="0" step="1" class="w-28 px-2 py-1 border border-slate-200 rounded bg-white text-right" />
                            </div>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td class="border border-black text-center bg-slate-50 font-bold align-top py-2">첨부파일</td>
                        <td class="border border-black px-2 py-2" colspan="7">
                          <div id="questionsAttachmentsList" class="flex flex-wrap gap-2 min-h-[2.5rem]"></div>
                        </td>
                      </tr>
                      <tr>
                        <td class="border border-black text-center bg-slate-50 font-bold align-top py-2">문항작성</td>
                        <td class="border border-black p-2" colspan="7">
                          <div class="grid grid-cols-1 md:grid-cols-8 gap-2 mb-2">
                            <label class="block text-[11px] font-bold text-slate-600 md:col-span-2">교과목 · 하위 과목
                              <select id="questionsSubjectSelect" class="mt-0.5 w-full px-2 py-1 border border-slate-200 rounded bg-white text-sm disabled:opacity-60" disabled>
                                <option value="">과정 선택 후 교과목</option>
                              </select>
                            </label>
                            <input id="questionInputNo" type="number" min="1" step="1" class="px-2 py-1 border border-slate-200 rounded bg-white" placeholder="번호" />
                            <select id="questionInputType" class="px-2 py-1 border border-slate-200 rounded bg-white">
                              <option value="포트폴리오">포트폴리오</option>
                              <option value="문제해결시나리오">문제해결시나리오</option>
                              <option value="서술형시험">서술형시험</option>
                              <option value="논술형시험">논술형시험</option>
                              <option value="사례연구">사례연구</option>
                              <option value="평가자 질문">평가자 질문</option>
                              <option value="평가자체크리스트">평가자체크리스트</option>
                              <option value="피평가자 체크리스트">피평가자 체크리스트</option>
                              <option value="일지/저널">일지/저널</option>
                              <option value="역할연기">역할연기</option>
                              <option value="구두발표">구두발표</option>
                              <option value="작업장평가">작업장평가</option>
                              <option value="기타(단일평가)">기타(단일평가)</option>
                              <option value="혼합형(복수평가방법)">혼합형(복수평가방법)</option>
                            </select>
                            <input id="questionInputScore" type="number" min="0" step="1" class="px-2 py-1 border border-slate-200 rounded bg-white" placeholder="배점" />
                            <input id="questionInputKeyword" class="px-2 py-1 border border-slate-200 rounded bg-white md:col-span-2" placeholder="평가기준/키워드" />
                            <button type="button" id="questionAddRowBtn" class="px-2 py-1 rounded bg-sky-600 text-white font-black hover:bg-sky-700 transition md:col-span-1">문항 추가</button>
                          </div>
                          <div id="questionInputText" contenteditable="true" class="w-full min-h-[120px] px-3 py-2 border border-slate-200 rounded bg-white whitespace-pre-wrap leading-relaxed"></div>
                        </td>
                      </tr>
                      <tr>
                        <td class="border border-black text-center bg-slate-50 font-bold align-top py-2">평가문항</td>
                        <td class="border border-black p-0" colspan="7">
                          <table class="w-full text-left">
                            <thead class="bg-slate-50 border-b border-slate-200">
                              <tr>
                                <th class="px-3 py-2 text-xs font-black text-slate-600 min-w-[12rem]">교과목</th>
                                <th class="px-3 py-2 text-xs font-black text-slate-600 w-16">번호</th>
                                <th class="px-3 py-2 text-xs font-black text-slate-600 w-24">유형</th>
                                <th class="px-3 py-2 text-xs font-black text-slate-600">문항</th>
                                <th class="px-3 py-2 text-xs font-black text-slate-600 w-20 text-center">배점</th>
                                <th class="px-3 py-2 text-xs font-black text-slate-600">평가기준</th>
                                <th class="px-3 py-2 text-xs font-black text-slate-600 w-32 text-center">작업</th>
                              </tr>
                            </thead>
                            <tbody id="questionsRowsBody" class="divide-y divide-slate-100 bg-white"></tbody>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td class="border border-black text-center bg-slate-50 font-bold">비고</td>
                        <td class="border border-black p-0" colspan="7">
                          <textarea id="questions_notes" class="w-full h-24 px-3 py-2 outline-none resize-y border-0 text-sm"></textarea>
                        </td>
                      </tr>
                    </table>
                  </div>
                </div>
              ` : item.id === 'tools' ? `
                <div class="rounded-2xl border border-slate-200/70 overflow-hidden">
                  <input type="file" id="toolsFileAttachInput" multiple class="hidden" />
                  <input type="file" id="toolsImageInsertInput" accept="image/jpeg,image/png,image/gif,image/webp" class="hidden" />

                  <div class="p-3 border-b border-slate-200/70 bg-slate-50/80 flex flex-wrap items-center justify-between gap-2">
                    <div class="flex flex-wrap items-center gap-2">
                      <button type="button" id="toolsImageInsertBtn" class="px-3 py-1.5 rounded-lg bg-sky-500 text-white text-xs font-black hover:bg-sky-600 transition"><i class="fas fa-image mr-1"></i>이미지 삽입</button>
                      <button type="button" id="toolsImageDeleteBtn" class="px-3 py-1.5 rounded-lg border border-rose-200 bg-rose-50 text-rose-700 text-xs font-black hover:bg-rose-100 transition"><i class="fas fa-trash mr-1"></i>이미지 삭제</button>
                      <button type="button" id="toolsFileAttachBtn" class="px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-black text-slate-700 hover:bg-slate-100 transition"><i class="fas fa-paperclip mr-1"></i>파일첨부</button>
                    </div>
                    <div class="text-[11px] text-slate-500">비고 영역에서 이미지 즉시표시/리사이즈/삭제를 지원합니다.</div>
                  </div>

                  <div class="p-4 bg-white overflow-x-auto">
                    <table class="w-full min-w-[900px] border border-black text-xs border-collapse">
                      <tr>
                        <td class="border border-black text-center font-black text-2xl sm:text-3xl py-5" colspan="4">평가 도구제작</td>
                      </tr>
                      <tr>
                        <td class="border border-black text-center bg-slate-50 font-bold w-[14%]">문서제목</td>
                        <td class="border border-black px-2 py-1.5 w-[36%]"><div id="tools_doc_title" contenteditable="true" class="outline-none min-h-[1.25rem]"></div></td>
                        <td class="border border-black text-center bg-slate-50 font-bold w-[14%]">작성자</td>
                        <td class="border border-black px-2 py-1.5 w-[36%]"><div id="tools_writer" contenteditable="true" class="outline-none min-h-[1.25rem]"></div></td>
                      </tr>
                      <tr>
                        <td class="border border-black text-center bg-slate-50 font-bold">과정명</td>
                        <td class="border border-black px-2 py-1.5"><div id="tools_display_course" contenteditable="true" class="outline-none min-h-[1.25rem] text-sm"></div></td>
                        <td class="border border-black text-center bg-slate-50 font-bold">평가일시</td>
                        <td class="border border-black px-2 py-1.5"><input type="text" id="tools_eval_datetime" class="w-full border-0 outline-none bg-transparent text-sm" placeholder="예: 2026-03-15 14:00" autocomplete="off" /></td>
                      </tr>
                      <tr>
                        <td class="border border-black text-center bg-slate-50 font-bold align-top py-2">교과목 · 하위 과목</td>
                        <td class="border border-black px-2 py-2" colspan="3">
                          <div class="flex flex-wrap items-center gap-2">
                            <select id="toolsSubjectSelect" class="flex-1 min-w-[200px] max-w-xl px-2 py-1.5 border border-slate-200 rounded bg-white text-sm disabled:opacity-60" disabled>
                              <option value="">과정 선택 후 교과목</option>
                            </select>
                            <button type="button" id="toolsLoadNcsCriteriaBtn" class="shrink-0 px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-black hover:bg-indigo-700 disabled:opacity-45 disabled:cursor-not-allowed" disabled>NCS 평가준거 불러오기</button>
                          </div>
                          <p class="mt-2 text-[11px] text-slate-500 leading-snug">표에서 요소명·평가 내용을 직접 수정할 수 있습니다. <strong class="text-slate-600">저장</strong> 시 이 과정·교과목·평가회차별로 서버에 보관되며, 이후 「NCS 평가준거 불러오기」·교수계획서 연동 시 저장된 문구가 우선 반영됩니다.</p>
                        </td>
                      </tr>
                      <tr>
                        <td class="border border-black text-center bg-slate-50 font-bold">교과목</td>
                        <td class="border border-black px-2 py-1.5 text-sm text-slate-800"><div id="tools_display_subject" class="min-h-[1.25rem] font-semibold">-</div></td>
                        <td class="border border-black text-center bg-slate-50 font-bold">훈련생</td>
                        <td class="border border-black px-2 py-1.5"><input type="text" id="tools_trainee" class="w-full border-0 outline-none bg-transparent text-sm" autocomplete="off" /></td>
                      </tr>
                      <tr>
                        <td class="border border-black text-center bg-slate-50 font-bold leading-tight">능력단위명<br/>/ 수준</td>
                        <td class="border border-black px-2 py-1.5"><div id="tools_unit_name_level" contenteditable="true" class="outline-none min-h-[1.25rem] text-sm"></div></td>
                        <td class="border border-black text-center bg-slate-50 font-bold">훈련교사</td>
                        <td class="border border-black px-2 py-1.5"><input type="text" id="tools_instructor" class="w-full border-0 outline-none bg-transparent text-sm" autocomplete="off" /></td>
                      </tr>
                      <tr>
                        <td class="border border-black text-center bg-slate-50 font-bold leading-tight">능력단위<br/>요소명</td>
                        <td class="border border-black px-2 py-1.5"><div id="tools_element_focus" contenteditable="true" class="outline-none min-h-[1.25rem] text-sm" placeholder="- 세부 요소명"></div></td>
                        <td class="border border-black text-center bg-slate-50 font-bold">평가시간</td>
                        <td class="border border-black px-2 py-1.5"><input type="text" id="tools_eval_duration" class="w-full border-0 outline-none bg-transparent text-sm" placeholder="분 단위 등" autocomplete="off" /></td>
                      </tr>
                      <tr>
                        <td class="border border-black text-center bg-slate-50 font-bold align-top py-2">성취기준</td>
                        <td class="border border-black px-2 py-2" colspan="3">
                          <textarea id="tools_achievement_note" rows="2" class="w-full border border-slate-200 rounded px-2 py-1.5 text-sm outline-none focus:ring-2 focus:ring-indigo-200"></textarea>
                        </td>
                      </tr>
                      <tr>
                        <td class="border border-black text-center bg-slate-50 font-bold align-top py-2">평가내용<br/><span class="text-[10px] font-normal text-slate-500">(NCS 평가준거)</span></td>
                        <td class="border border-black p-0" colspan="3">
                          <table class="w-full text-left border-collapse">
                            <thead class="bg-slate-100 border-b border-black">
                              <tr>
                                <th class="border border-black px-2 py-2 text-center text-[11px] font-black text-slate-800 w-[22%]">능력단위요소</th>
                                <th class="border border-black px-2 py-2 text-center text-[11px] font-black text-slate-800">평가내용</th>
                                <th class="border border-black px-2 py-2 text-center text-[11px] font-black text-slate-800 w-[12%]">성취 수준</th>
                              </tr>
                            </thead>
                            <tbody id="toolsCriteriaBody" class="bg-white"></tbody>
                          </table>
                          <p class="text-[10px] text-slate-500 px-2 py-1">교과목 선택 후 「NCS 평가준거 불러오기」로 능력단위 요소별 평가준거를 채웁니다. 평가준거가 없으면 수행준거 문구가 사용됩니다. 셀을 직접 수정할 수 있습니다.</p>
                        </td>
                      </tr>
                      <tr>
                        <td class="border border-black text-center bg-slate-50 font-bold align-top py-2">첨부파일</td>
                        <td class="border border-black px-2 py-2" colspan="3">
                          <div id="toolsAttachmentsList" class="flex flex-wrap gap-2 min-h-[2.5rem]"></div>
                        </td>
                      </tr>
                      <tr>
                        <td class="border border-black text-center bg-slate-50 font-bold">비고</td>
                        <td class="border border-black p-2" colspan="3">
                          <div id="tools_notes" contenteditable="true" class="w-full min-h-[120px] px-3 py-2 border border-slate-200 rounded bg-white whitespace-pre-wrap leading-relaxed"></div>
                        </td>
                      </tr>
                      <tr class="hidden" aria-hidden="true">
                        <td colspan="4" class="p-0 border-0">
                          <span id="toolsTotalScoreLabel" class="sr-only">0점</span>
                          <div id="tools_target_time" class="hidden" contenteditable="true"></div>
                          <table class="hidden"><tbody id="toolsRowsBody"></tbody></table>
                        </td>
                      </tr>
                    </table>
                  </div>
                </div>
              ` : item.id === 'rubric' ? `
                <div class="space-y-4">
                  <div class="rounded-2xl border border-slate-200/70 bg-white p-4 space-y-4">
                    <div class="overflow-x-auto">
                      <table class="w-full border-collapse text-[12px] leading-relaxed bg-white">
                        <colgroup>
                          <col style="width: 11%" />
                          <col style="width: 44%" />
                          <col style="width: 9%" />
                          <col style="width: 8%" />
                          <col style="width: 10%" />
                          <col style="width: 18%" />
                        </colgroup>
                        <tbody>
                          <tr>
                            <td class="border border-black text-center bg-slate-50 font-bold py-1.5">과정명</td>
                            <td class="border border-black px-2 py-1.5" colspan="3">
                              <div id="rubric_doc_title" contenteditable="true" class="min-h-[1.5rem] whitespace-pre-wrap focus:outline-none focus:ring-2 focus:ring-sky-200 rounded px-1"></div>
                            </td>
                            <td class="border border-black text-center bg-slate-50 font-bold py-1.5">수준</td>
                            <td class="border border-black px-2 py-1.5 text-center">
                              <div id="rubric_total_target" contenteditable="true" class="min-h-[1.5rem] text-center whitespace-pre-wrap focus:outline-none focus:ring-2 focus:ring-sky-200 rounded px-1">2</div>
                            </td>
                          </tr>
                          <tr>
                            <td class="border border-black text-center bg-slate-50 font-bold py-1.5">교과목</td>
                            <td class="border border-black px-2 py-1.5" colspan="3">
                              <select id="rubric_subject_name" class="w-full px-2 py-1.5 border border-slate-200 rounded bg-white text-sm disabled:opacity-60" disabled>
                                <option value="">과정 선택 후 교과목</option>
                              </select>
                            </td>
                            <td class="border border-black text-center bg-slate-50 font-bold py-1.5">훈련교사</td>
                            <td class="border border-black px-2 py-1.5">
                              <div id="rubric_writer" contenteditable="true" class="min-h-[1.5rem] whitespace-pre-wrap focus:outline-none focus:ring-2 focus:ring-sky-200 rounded px-1"></div>
                            </td>
                          </tr>
                          <tr>
                            <td class="border border-black text-center bg-slate-50 font-bold py-1.5">능력단위명</td>
                            <td class="border border-black px-2 py-1.5" colspan="5">
                              <div id="rubric_unit_name" contenteditable="true" class="min-h-[1.5rem] whitespace-pre-wrap focus:outline-none focus:ring-2 focus:ring-sky-200 rounded px-1"></div>
                            </td>
                          </tr>
                          <tr>
                            <td class="border border-black text-center bg-slate-50 font-bold py-1.5">능력단위요소</td>
                            <td class="border border-black text-center bg-slate-50 font-bold py-1.5">성취기준(채점기준) 설명</td>
                            <td class="border border-black text-center bg-slate-50 font-bold py-1.5" colspan="2">성취수준</td>
                            <td class="border border-black text-center bg-slate-50 font-bold py-1.5" colspan="2">성취기준 등록</td>
                          </tr>
                          <tr>
                            <td class="border border-black p-0 align-top" colspan="6">
                              <table class="w-full border-collapse text-[12px] leading-relaxed">
                                <colgroup>
                                  <col style="width: 18%" />
                                  <col style="width: 47%" />
                                  <col style="width: 9%" />
                                  <col style="width: 26%" />
                                </colgroup>
                                <tbody id="rubricRowsBody" class="bg-white"></tbody>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <p id="rubricTotalScoreLabel" class="hidden">0점</p>
                    <div class="rounded-xl border border-slate-200/80 bg-slate-50 p-3">
                      <div class="flex flex-wrap items-center gap-2 mb-2">
                        <button type="button" id="rubricImageDeleteBtn" class="px-3 py-2 rounded-xl border border-rose-200 bg-rose-50 text-xs font-black text-rose-700 hover:bg-rose-100 transition">
                          <i class="fas fa-trash mr-1"></i>선택 이미지 삭제
                        </button>
                        <span class="text-[11px] text-slate-500">이미지 삽입 후 바로 보이며, 모서리 드래그로 크기 조절/선택 삭제가 가능합니다.</span>
                      </div>
                      <div class="flex flex-wrap items-center gap-2">
                        <input type="file" id="rubricFileAttachInput" multiple class="hidden" />
                        <button type="button" id="rubricFileAttachBtn" class="px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-black text-slate-700 hover:bg-slate-50 transition">
                          <i class="fas fa-paperclip mr-1"></i>파일 첨부
                        </button>
                        <input type="file" id="rubricImageInsertInput" accept="image/jpeg,image/png,image/gif,image/webp" class="hidden" />
                        <button type="button" id="rubricImageInsertBtn" class="px-3 py-2 rounded-xl border border-sky-200 bg-sky-50 text-xs font-black text-sky-800 hover:bg-sky-100 transition">
                          <i class="fas fa-image mr-1"></i>이미지 삽입
                        </button>
                      </div>
                      <label class="block text-xs font-black text-slate-600 mb-1.5 mt-3">첨부파일</label>
                      <div id="rubricAttachmentsList" class="flex flex-wrap gap-2 min-h-[2.5rem]"></div>
                    </div>
                  </div>

                  <div class="rounded-2xl border border-slate-200/70 bg-white p-4">
                    <label class="block text-xs font-black text-slate-600 mb-1.5">비고</label>
                    <div id="rubric_notes" contenteditable="true" class="w-full min-h-[120px] px-3 py-2 border border-slate-200 rounded bg-white whitespace-pre-wrap leading-relaxed"></div>
                  </div>
                </div>
              ` : item.id === 'achievement' ? `
                <div class="rounded-2xl border border-slate-200/70 overflow-hidden">
                  <input type="file" id="achievementFileAttachInput" multiple class="hidden" />
                  <input type="file" id="achievementImageInsertInput" accept="image/jpeg,image/png,image/gif,image/webp" class="hidden" />

                  <div class="p-3 border-b border-slate-200/70 bg-slate-50/80 flex flex-wrap items-center justify-between gap-2">
                    <div class="flex flex-wrap items-center gap-2">
                      <button type="button" id="achievementImageInsertBtn" class="px-3 py-1.5 rounded-lg bg-sky-500 text-white text-xs font-black hover:bg-sky-600 transition"><i class="fas fa-image mr-1"></i>이미지 삽입</button>
                      <button type="button" id="achievementImageDeleteBtn" class="px-3 py-1.5 rounded-lg border border-rose-200 bg-rose-50 text-rose-700 text-xs font-black hover:bg-rose-100 transition"><i class="fas fa-trash mr-1"></i>이미지 삭제</button>
                      <button type="button" id="achievementFileAttachBtn" class="px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-black text-slate-700 hover:bg-slate-100 transition"><i class="fas fa-paperclip mr-1"></i>파일첨부</button>
                    </div>
                    <div class="text-[11px] text-slate-500">비고 영역에서 이미지 즉시표시/리사이즈/삭제를 지원합니다.</div>
                  </div>

                  <div class="p-4 bg-white overflow-x-auto">
                    <table class="w-full min-w-[1080px] border border-black text-[12px] leading-relaxed">
                      <colgroup>
                        <col style="width: 13%" />
                        <col style="width: 41%" />
                        <col style="width: 10%" />
                        <col style="width: 10%" />
                        <col style="width: 10%" />
                        <col style="width: 16%" />
                      </colgroup>
                      <tbody>
                        <tr>
                          <td class="border border-black text-center bg-slate-50 font-bold py-1">과정명</td>
                          <td class="border border-black px-2 py-1" colspan="2"><div id="achievement_doc_title" contenteditable="true" class="outline-none min-h-[1.25rem] whitespace-pre-wrap"></div></td>
                          <td class="border border-black text-center bg-slate-50 font-bold py-1">평가일자</td>
                          <td class="border border-black px-2 py-1" colspan="2"><div id="achievement_eval_date" contenteditable="true" class="outline-none min-h-[1.25rem] whitespace-pre-wrap"></div></td>
                        </tr>
                        <tr>
                          <td class="border border-black text-center bg-slate-50 font-bold py-1">교과목</td>
                          <td class="border border-black px-2 py-1" colspan="2">
                            <select id="achievement_subject_name" class="w-full px-2 py-1 border border-slate-200 rounded bg-white text-sm disabled:opacity-60" disabled>
                              <option value="">과정 선택 후 교과목</option>
                            </select>
                          </td>
                          <td class="border border-black text-center bg-slate-50 font-bold py-1">훈련생</td>
                          <td class="border border-black px-2 py-1" colspan="2"><div id="achievement_trainee" contenteditable="true" class="outline-none min-h-[1.25rem] whitespace-pre-wrap"></div></td>
                        </tr>
                        <tr>
                          <td class="border border-black text-center bg-slate-50 font-bold py-1">능력단위명/수준</td>
                          <td class="border border-black px-2 py-1" colspan="2"><div id="achievement_unit_level" contenteditable="true" class="outline-none min-h-[1.25rem] whitespace-pre-wrap"></div></td>
                          <td class="border border-black text-center bg-slate-50 font-bold py-1">훈련교사</td>
                          <td class="border border-black px-2 py-1"><div id="achievement_writer" contenteditable="true" class="outline-none min-h-[1.25rem] whitespace-pre-wrap"></div></td>
                          <td class="border border-black px-2 py-1 text-center"><div id="achievement_target_score" contenteditable="true" class="outline-none min-h-[1.25rem] whitespace-pre-wrap">100</div></td>
                        </tr>
                      </tbody>
                    </table>

                    <h3 class="text-center text-3xl font-black my-4">종합 환산점수별 성취기준</h3>

                    <table class="w-full min-w-[1080px] border border-black text-[12px] leading-relaxed">
                      <thead class="bg-slate-50">
                        <tr>
                          <th class="border border-black px-2 py-1 text-center font-bold w-20">성취수준</th>
                          <th class="border border-black px-2 py-1 text-center font-bold">종합 성취기준</th>
                          <th class="border border-black px-2 py-1 text-center font-bold w-24">점수분배</th>
                          <th class="border border-black px-2 py-1 text-center font-bold w-16">Fail</th>
                        </tr>
                      </thead>
                      <tbody id="achievementRowsBody" class="bg-white"></tbody>
                    </table>

                    <div class="mt-3 border border-black bg-white p-2">
                      <p class="text-xs font-black mb-1">필독</p>
                      <div id="achievement_notes" contenteditable="true" class="min-h-[78px] whitespace-pre-wrap focus:outline-none focus:ring-2 focus:ring-sky-200 rounded px-1"></div>
                    </div>

                    <h3 class="text-center text-3xl font-black my-4">능력단위요소별 취득 점수 및 환산점수</h3>
                    <table class="w-full border border-black text-[12px] leading-relaxed">
                      <thead class="bg-slate-50">
                        <tr>
                          <th class="border border-black px-2 py-1 text-center font-bold">능력단위요소명</th>
                          <th class="border border-black px-2 py-1 text-center font-bold w-24">취득점수</th>
                          <th class="border border-black px-2 py-1 text-center font-bold w-24">환산점수</th>
                          <th class="border border-black px-2 py-1 text-center font-bold">지도교사 평가</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td class="border border-black px-2 py-1"><div id="achievement_score_item_name" contenteditable="true" class="outline-none min-h-[1.25rem] whitespace-pre-wrap"></div></td>
                          <td class="border border-black px-2 py-1 text-center"><div id="achievement_score_raw" contenteditable="true" class="outline-none min-h-[1.25rem] whitespace-pre-wrap"></div></td>
                          <td class="border border-black px-2 py-1 text-center"><div id="achievement_score_converted" contenteditable="true" class="outline-none min-h-[1.25rem] whitespace-pre-wrap"></div></td>
                          <td class="border border-black px-2 py-1"><div id="achievement_score_comment" contenteditable="true" class="outline-none min-h-[1.25rem] whitespace-pre-wrap"></div></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <p id="achievementRateSumLabel" class="hidden">0점</p>
                  <div class="px-4 pb-4">
                    <label class="block text-xs font-black text-slate-600 mb-1.5">첨부파일</label>
                    <div id="achievementAttachmentsList" class="flex flex-wrap gap-2 min-h-[2.5rem]"></div>
                  </div>
                </div>
              ` : item.id === 'review' ? `
                <div class="rounded-2xl border border-slate-200/70 overflow-hidden">
                  <input type="file" id="reviewFileAttachInput" multiple class="hidden" />
                  <input type="file" id="reviewImageInsertInput" accept="image/jpeg,image/png,image/gif,image/webp" class="hidden" />
                  <input type="file" id="reviewSignChairInput" accept="image/jpeg,image/png,image/gif,image/webp" class="hidden" />
                  <input type="file" id="reviewSignWriterInput" accept="image/jpeg,image/png,image/gif,image/webp" class="hidden" />
                  <input type="file" id="reviewSignReviewerInput" accept="image/jpeg,image/png,image/gif,image/webp" class="hidden" />

                  <div class="p-3 border-b border-slate-200/70 bg-slate-50/80 flex flex-wrap items-center justify-between gap-2">
                    <div class="flex flex-wrap items-center gap-2">
                      <button type="button" id="reviewImageInsertBtn" class="px-3 py-1.5 rounded-lg bg-sky-500 text-white text-xs font-black hover:bg-sky-600 transition"><i class="fas fa-image mr-1"></i>이미지 삽입</button>
                      <button type="button" id="reviewImageDeleteBtn" class="px-3 py-1.5 rounded-lg border border-rose-200 bg-rose-50 text-rose-700 text-xs font-black hover:bg-rose-100 transition"><i class="fas fa-trash mr-1"></i>이미지 삭제</button>
                      <button type="button" id="reviewFileAttachBtn" class="px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-black text-slate-700 hover:bg-slate-100 transition"><i class="fas fa-paperclip mr-1"></i>파일첨부</button>
                    </div>
                    <div class="text-[11px] text-slate-500">기타의견 영역에서 이미지 즉시표시/리사이즈/삭제를 지원합니다.</div>
                  </div>

                  <div class="p-4 bg-white overflow-x-auto">
                    <table class="w-full border border-black text-[12px] leading-relaxed min-w-[1100px]">
                      <colgroup>
                        <col style="width: 26%" />
                        <col style="width: 28%" />
                        <col style="width: 15.33%" />
                        <col style="width: 15.33%" />
                        <col style="width: 15.33%" />
                      </colgroup>
                      <tbody>
                        <tr>
                          <td class="border border-black px-4 py-3 text-5xl font-black text-center" rowspan="2" colspan="2">평가지 검토 체크리스트</td>
                          <td class="border border-black text-center bg-slate-50 font-bold py-1.5">
                            <div id="review_approval_role_chair" contenteditable="true" class="outline-none min-h-[1.25rem] whitespace-pre-wrap">검토자</div>
                          </td>
                          <td class="border border-black text-center bg-slate-50 font-bold py-1.5">
                            <div id="review_approval_role_writer" contenteditable="true" class="outline-none min-h-[1.25rem] whitespace-pre-wrap">실장</div>
                          </td>
                          <td class="border border-black text-center bg-slate-50 font-bold py-1.5">
                            <div id="review_approval_role_reviewer" contenteditable="true" class="outline-none min-h-[1.25rem] whitespace-pre-wrap">원장</div>
                          </td>
                        </tr>
                        <tr>
                          <td class="border border-black p-1.5 align-top">
                            <div id="reviewSignChairPreview" class="h-20 rounded border border-dashed border-slate-300 flex items-center justify-center text-xs text-slate-400 mb-1">(서명 없음)</div>
                            <div class="flex items-center justify-center gap-1.5">
                              <button type="button" id="reviewSignChairBtn" class="px-2 py-1 rounded border border-slate-200 text-[11px] font-black text-slate-700 hover:bg-slate-50 transition">서명 삽입</button>
                              <button type="button" class="px-2 py-1 rounded border border-rose-200 text-[11px] font-black text-rose-700 hover:bg-rose-50 transition" data-remove-review-signature="chairperson">삭제</button>
                            </div>
                          </td>
                          <td class="border border-black p-1.5 align-top">
                            <div id="reviewSignWriterPreview" class="h-20 rounded border border-dashed border-slate-300 flex items-center justify-center text-xs text-slate-400 mb-1">(서명 없음)</div>
                            <div class="flex items-center justify-center gap-1.5">
                              <button type="button" id="reviewSignWriterBtn" class="px-2 py-1 rounded border border-slate-200 text-[11px] font-black text-slate-700 hover:bg-slate-50 transition">서명 삽입</button>
                              <button type="button" class="px-2 py-1 rounded border border-rose-200 text-[11px] font-black text-rose-700 hover:bg-rose-50 transition" data-remove-review-signature="writer">삭제</button>
                            </div>
                          </td>
                          <td class="border border-black p-1.5 align-top">
                            <div id="reviewSignReviewerPreview" class="h-20 rounded border border-dashed border-slate-300 flex items-center justify-center text-xs text-slate-400 mb-1">(서명 없음)</div>
                            <div class="flex items-center justify-center gap-1.5">
                              <button type="button" id="reviewSignReviewerBtn" class="px-2 py-1 rounded border border-slate-200 text-[11px] font-black text-slate-700 hover:bg-slate-50 transition">서명 삽입</button>
                              <button type="button" class="px-2 py-1 rounded border border-rose-200 text-[11px] font-black text-rose-700 hover:bg-rose-50 transition" data-remove-review-signature="reviewer">삭제</button>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>

                    <p class="text-center text-[11px] text-slate-700 my-4">본 과정의 평가지에 대한 의견을 아래와 같이 의뢰하오니 검토 부탁드립니다.</p>

                    <table class="w-full border border-black text-[12px] leading-relaxed min-w-[1100px]">
                      <colgroup>
                        <col style="width: 18%" />
                        <col style="width: 30%" />
                        <col style="width: 18%" />
                        <col style="width: 34%" />
                      </colgroup>
                      <tbody>
                        <tr>
                          <td class="border border-black text-center bg-slate-50 font-bold py-1">과정명</td>
                          <td class="border border-black px-2 py-1" colspan="3"><div id="review_doc_title" contenteditable="true" class="outline-none min-h-[1.25rem] whitespace-pre-wrap"></div></td>
                        </tr>
                        <tr>
                          <td class="border border-black text-center bg-slate-50 font-bold py-1">교과목명</td>
                          <td class="border border-black px-2 py-1">
                            <select id="review_subject_name" class="w-full px-2 py-1 border border-slate-200 rounded bg-white text-sm disabled:opacity-60" disabled>
                              <option value="">과정 선택 후 교과목</option>
                            </select>
                          </td>
                          <td class="border border-black text-center bg-slate-50 font-bold py-1">능력단위명/수준</td>
                          <td class="border border-black px-2 py-1"><div id="review_unit_level" contenteditable="true" class="outline-none min-h-[1.25rem] whitespace-pre-wrap"></div></td>
                        </tr>
                        <tr>
                          <td class="border border-black text-center bg-slate-50 font-bold py-1">평가도구</td>
                          <td class="border border-black px-2 py-1"><div id="review_tool_name" contenteditable="true" class="outline-none min-h-[1.25rem] whitespace-pre-wrap"></div></td>
                          <td class="border border-black text-center bg-slate-50 font-bold py-1">검토인</td>
                          <td class="border border-black px-2 py-1"><div id="review_writer" contenteditable="true" class="outline-none min-h-[1.25rem] whitespace-pre-wrap"></div></td>
                        </tr>
                        <tr>
                          <td class="border border-black text-center bg-slate-50 font-bold py-1">검토일</td>
                          <td class="border border-black px-2 py-1"><div id="review_reviewer" contenteditable="true" class="outline-none min-h-[1.25rem] whitespace-pre-wrap"></div></td>
                          <td class="border border-black text-center bg-slate-50 font-bold py-1">검토일</td>
                          <td class="border border-black px-2 py-1"><div id="review_review_date" contenteditable="true" class="outline-none min-h-[1.25rem] whitespace-pre-wrap"></div></td>
                        </tr>
                      </tbody>
                    </table>

                    <table class="w-full border border-black text-[12px] leading-relaxed mt-3 min-w-[1100px]">
                      <thead class="bg-slate-50">
                        <tr>
                          <th class="border border-black px-2 py-1 text-center font-bold w-44">검토항목</th>
                          <th class="border border-black px-2 py-1 text-center font-bold">1안 검토사항</th>
                          <th class="border border-black px-2 py-1 text-center font-bold w-14">적절</th>
                          <th class="border border-black px-2 py-1 text-center font-bold w-14">수정 필요</th>
                        </tr>
                      </thead>
                      <tbody id="reviewRowsBody" class="bg-white"></tbody>
                    </table>

                    <div class="mt-3 border border-black bg-white p-2">
                      <p class="text-xs font-black mb-1">기타의견</p>
                      <div id="review_notes" contenteditable="true" class="min-h-[92px] whitespace-pre-wrap focus:outline-none focus:ring-2 focus:ring-sky-200 rounded px-1"></div>
                    </div>
                  </div>
                  <p id="reviewCompletionLabel" class="hidden">0%</p>
                  <div class="px-4 pb-4">
                    <label class="block text-xs font-black text-slate-600 mb-1.5">첨부파일</label>
                    <div id="reviewAttachmentsList" class="flex flex-wrap gap-2 min-h-[2.5rem]"></div>
                  </div>
                </div>
              ` : ''}
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
    ${toolsPrintSheetHtml()}
    ${rubricPrintSheetHtml()}
    ${achievementPrintSheetHtml()}
    ${reviewPrintSheetHtml()}
    <div id="ncsPlanImageInsertModal" class="fixed inset-0 bg-black/45 hidden z-[250] p-4">
      <div class="max-w-3xl mx-auto mt-8 bg-white rounded-xl border border-slate-200 shadow-2xl overflow-hidden">
        <div class="px-5 py-3 border-b border-slate-200 flex items-center justify-between">
          <h4 class="text-lg font-black text-slate-800">이미지</h4>
          <button type="button" id="ncsPlanImageInsertCloseBtn" class="text-slate-400 hover:text-slate-600 text-xl leading-none">&times;</button>
        </div>
        <div class="p-4">
          <input type="file" id="ncsPlanImageInsertModalInput" accept="image/jpeg,image/png,image/gif,image/webp" class="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm bg-white" />
          <div class="mt-3 grid grid-cols-1 md:grid-cols-[1.2fr_1fr] gap-4">
            <div class="rounded-lg border border-slate-200 bg-slate-50 min-h-[220px] flex items-center justify-center overflow-hidden">
              <img id="ncsPlanImageInsertPreview" alt="미리보기" class="max-w-full max-h-[320px] hidden" />
              <p id="ncsPlanImageInsertPreviewEmpty" class="text-sm text-slate-400">미리보기</p>
            </div>
            <div class="rounded-lg border border-sky-200 bg-sky-50 p-4 text-sky-800 text-sm leading-relaxed">
              <p class="font-black mb-1">문서에 이미지 첨부하기</p>
              <ol class="list-decimal ml-4 space-y-1">
                <li>이미지 파일을 선택합니다.</li>
                <li>삽입할 입력란(본문/비고)에 커서를 둡니다.</li>
                <li><strong>문서에 삽입</strong> 버튼을 누릅니다.</li>
              </ol>
              <p class="mt-2 text-xs text-slate-500">삽입 형식: <code class="text-slate-600">![이미지](URL)</code></p>
            </div>
          </div>
        </div>
        <div class="px-5 py-3 border-t border-slate-200 flex items-center justify-end gap-2 bg-slate-50">
          <button type="button" id="ncsPlanImageInsertApplyBtn" class="px-4 py-2 rounded-lg bg-sky-600 text-white font-black text-sm hover:bg-sky-700">문서에 삽입</button>
          <button type="button" id="ncsPlanImageInsertCancelBtn" class="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-bold text-sm hover:bg-slate-100">닫기</button>
        </div>
      </div>
    </div>
    <div id="ncsQuestionPreviewModal" class="fixed inset-0 bg-black/45 hidden z-[250] p-4" role="dialog" aria-modal="true" aria-labelledby="ncsQuestionPreviewTitle">
      <div class="max-w-3xl mx-auto mt-8 bg-white rounded-xl border border-slate-200 shadow-2xl overflow-hidden">
        <div class="px-5 py-3 border-b border-slate-200 flex items-center justify-between">
          <h4 id="ncsQuestionPreviewTitle" class="text-lg font-black text-slate-800">문항 미리보기</h4>
          <button type="button" id="ncsQuestionPreviewCloseBtn" class="text-slate-400 hover:text-slate-600 text-xl leading-none">&times;</button>
        </div>
        <div class="p-4">
          <div class="text-xs text-slate-600 font-black mb-2" id="ncsQuestionPreviewMeta"></div>
          <div id="ncsQuestionPreviewContent" class="border border-slate-200 rounded-lg p-3 max-h-[60vh] overflow-y-auto bg-white"></div>
        </div>
      </div>
    </div>
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
    var imageInsertContext = { targetId: '', folder: 'minutes', file: null };
    var lastFocusedEditableId = '';
    var autoEditableSeq = 1;
    var selectedDocIdByTab = {};
    var selectedSessionIdForSubject = '';
    /** 평가실시일자: 수정 중일 때 행 삽입 위치 (null이면 맨 뒤 추가) */
    var schedulePendingEditIndex = null;
    var scheduleInstructorOptions = [];
    /** 평가도구 제작: NCS 평가준거 그리드 상태 */
    var toolsCriteriaGroupsState = [];
    var toolsCriteriaInputBound = false;
    var TOOLS_ACHIEVEMENT_DEFAULT = '5점(매우 우수), 4점(우수), 3점(보통), 2점(부족), 1점(매우부족) - 채점기준표 참고';
    /** NCS 평가문항 유형 기본값 (과정심사 참고 평가방법 목록과 동일) */
    var NCS_QUESTION_TYPE_DEFAULT = '포트폴리오';
    const isTeacherLmsPath = window.location.pathname.startsWith('/teacher/');

    function hasTeacherLmsChrome() {
      try {
        return !!document.getElementById('teacherSidebarWrap');
      } catch (e) {
        return false;
      }
    }

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

    function isMinutesReadOnlyMode() {
      return isTeacherLmsPath || hasTeacherLmsChrome();
    }

    function showTeacherMinutesNoticeModal() {
      var m = document.getElementById('ncsTeacherMinutesNoticeModal');
      if (!m) {
        try { window.alert('평가계획 회의록 수정에 대한 권한이 없습니다.'); } catch (e) {}
        return;
      }
      m.classList.remove('hidden');
      m.style.display = 'flex';
      m.style.zIndex = '99999';
      try {
        document.body.style.overflow = 'hidden';
      } catch (e) {}
    }
    function hideTeacherMinutesNoticeModal() {
      var m = document.getElementById('ncsTeacherMinutesNoticeModal');
      if (m) {
        m.classList.add('hidden');
        m.style.display = '';
        m.style.zIndex = '';
      }
      try {
        document.body.style.overflow = '';
      } catch (e) {}
    }

    function blockIfMinutesAdminOnly(tabId) {
      if (String(tabId || '') !== 'minutes') return false;
      if (!isMinutesReadOnlyMode()) return false;
      showTeacherMinutesNoticeModal();
      return true;
    }

    function applyMinutesReadOnlyMode() {
      if (!isMinutesReadOnlyMode()) return;
      var panel = document.querySelector('[data-plan-tab-panel="minutes"]');
      if (!panel) return;
      panel.querySelectorAll('[contenteditable="true"]').forEach(function(el) {
        el.setAttribute('contenteditable', 'false');
      });
      panel.querySelectorAll('input, textarea, select').forEach(function(el) {
        var inputType = String(el.type || '').toLowerCase();
        if (inputType === 'file') {
          el.disabled = true;
          return;
        }
        if (inputType === 'hidden') return;
        if (String(el.tagName || '').toUpperCase() === 'SELECT') {
          // 저장문서 드롭다운은 열람(조회)용이므로 비활성화하지 않음
          if (el.hasAttribute('data-plan-doc-select')) return;
          el.disabled = true;
          return;
        }
        el.readOnly = true;
      });
      // 저장/수정/작성/삭제는 클릭 시 blockIfMinutesAdminOnly에서 알림만 띄움 (disabled 시 알림이 안 뜸)
      panel.querySelectorAll('[data-plan-save-btn="minutes"], [data-plan-update-btn="minutes"], [data-plan-new-btn="minutes"], [data-plan-delete-btn="minutes"]').forEach(function(btn) {
        btn.classList.add('opacity-60', 'cursor-not-allowed');
        btn.setAttribute('title', '평가계획 회의록 수정에 대한 권한이 없습니다.');
      });
      panel.querySelectorAll('#minutesImageInsertBtn, #minutesImageDeleteBtn, #minutesFileAttachBtn, #minutesQuickTodayBtn, #minutesQuickTitleBtn, #minutesQuickAttendeesBtn, #minutesSignChairBtn, #minutesSignWriterBtn, #minutesSignReviewerBtn, [data-remove-minutes-signature], [data-remove-minutes-attachment]').forEach(function(btn) {
        btn.disabled = true;
        btn.classList.add('opacity-50', 'cursor-not-allowed');
        btn.setAttribute('title', '평가계획 회의록 수정에 대한 권한이 없습니다.');
      });
    }

    function getMinutesFieldValue(id) {
      var el = document.getElementById(id);
      if (!el) return '';
      var tag = el.tagName ? String(el.tagName).toUpperCase() : '';
      // 읽기 전용( contenteditable=false )에서도 회의내용은 HTML로 저장·복원해야 이미지가 보임
      if (id === 'minutes_content') return String(el.innerHTML || '');
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return String(el.value || '');
      if (el.isContentEditable) return String(el.textContent || '');
      return String(el.textContent || '');
    }

    function setMinutesFieldValue(id, value) {
      var el = document.getElementById(id);
      if (!el) return;
      var next = value != null ? String(value) : '';
      var tag = el.tagName ? String(el.tagName).toUpperCase() : '';
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') {
        el.value = next;
        return;
      }
      if (id === 'minutes_content') {
        el.innerHTML = normalizeMinutesContentForEditor(next);
        return;
      }
      if (el.isContentEditable) {
        el.textContent = next;
        return;
      }
      el.textContent = next;
    }

    async function authFetch(url, options) {
      const token = localStorage.getItem('token');
      const base = { headers: { 'Authorization': 'Bearer ' + token } };
      return fetch(url, Object.assign({}, base, options || {}));
    }

    /** LMS 상단 헤더와 동일: 회차 ID가 legacy courses.id와 겹칠 때는 ?type=hrd 로 course_sessions 기준 조회 */
    function buildLmsCourseApiUrl(courseId) {
      try {
        var params = new URLSearchParams(window.location.search);
        var type = params.get('type') || '';
        if (typeof type !== 'string') type = '';
        if (!type && window.location.pathname.indexOf('/lms') !== -1) type = 'hrd';
        if (type && type.startsWith('hrd')) type = 'hrd';
        if (type === 'undefined') type = 'hrd';
        var base = '/api/courses/' + encodeURIComponent(courseId);
        return type ? base + '?type=' + encodeURIComponent(type) : base;
      } catch (e) {
        return '/api/courses/' + encodeURIComponent(courseId) + '?type=hrd';
      }
    }

    async function fetchLmsCourseDetail(courseId) {
      var url = buildLmsCourseApiUrl(courseId);
      var res = await authFetch(url);
      if (res.status === 404) {
        url = '/api/courses/' + encodeURIComponent(courseId) + '?type=hrd';
        res = await authFetch(url);
      }
      var json = await res.json();
      return json && json.success ? json.data : null;
    }

    async function refreshFixedCourseHint() {
      if (!useFixedCourseId) return;
      var hint = document.getElementById('fixedCourseHint');
      if (!hint) return;
      hint.textContent = '과정 정보를 불러오는 중…';
      try {
        var cd = await fetchLmsCourseDetail(fixedCourseId);
        if (cd && (cd.title || cd.name)) {
          window.__ncsEvalPlanCourseTitle = cd.title || cd.name;
          hint.textContent = window.__ncsEvalPlanCourseTitle;
          try {
            var tdc = document.getElementById('tools_display_course');
            if (tdc && !String(getToolsFieldValue('tools_display_course') || '').trim()) {
              setToolsFieldValue('tools_display_course', window.__ncsEvalPlanCourseTitle);
            }
          } catch (e2) {}
          return;
        }
      } catch (e) {}
      hint.textContent = '과정 정보를 불러올 수 없습니다. (회차 ID: ' + fixedCourseId + ')';
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

    function minutesMarkdownToEditorHtml(text) {
      if (!text) return '';
      var lines = String(text).split('\\n');
      var parts = [];
      for (var i = 0; i < lines.length; i++) {
        var line = lines[i];
        var m = line.match(/^!\\[([^\\]]*)\\]\\(([^)]+)\\)\\s*$/);
        if (m && isSafeMinutesAssetUrl(m[2])) {
          var src = m[2].trim();
          parts.push('<div class="minutes-image-resizable" contenteditable="false"><img src="' + escapeHtml(src) + '" alt="' + escapeHtml(m[1] || '이미지') + '" /></div>');
        } else if (line.trim() === '') {
          parts.push('<div><br/></div>');
        } else {
          parts.push('<div>' + escapeHtml(line) + '</div>');
        }
      }
      return parts.join('');
    }

    function normalizeMinutesContentForEditor(raw) {
      var text = String(raw || '');
      if (!text.trim()) return '';
      if (/<[a-z][\\s\\S]*>/i.test(text)) return text;
      return minutesMarkdownToEditorHtml(text);
    }

    function questionMarkdownToEditorHtml(text) {
      return minutesMarkdownToEditorHtml(text);
    }

    function normalizeQuestionContentForEditor(raw) {
      var text = String(raw || '');
      if (!text.trim()) return '';
      if (/<[a-z][\\s\\S]*>/i.test(text)) return text;
      return questionMarkdownToEditorHtml(text);
    }

    function getQuestionInputValue() {
      var el = document.getElementById('questionInputText');
      if (!el) return '';
      if (el.isContentEditable) return String(el.innerHTML || '');
      return String(el.value || '');
    }

    function setQuestionInputValue(value) {
      var el = document.getElementById('questionInputText');
      if (!el) return;
      var next = value != null ? String(value) : '';
      if (el.isContentEditable) {
        el.innerHTML = normalizeQuestionContentForEditor(next);
      } else {
        el.value = next;
      }
    }

    function questionInputHasContent() {
      var el = document.getElementById('questionInputText');
      if (!el) return false;
      var plain = String(el.textContent || '').trim();
      if (plain) return true;
      return !!el.querySelector('img');
    }

    function getQuestionsFieldValue(id) {
      var el = document.getElementById(id);
      if (!el) return '';
      var tag = el.tagName ? String(el.tagName).toUpperCase() : '';
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return String(el.value || '');
      if (el.isContentEditable) return String(el.textContent || '');
      return String(el.textContent || '');
    }

    function setQuestionsFieldValue(id, value) {
      var el = document.getElementById(id);
      if (!el) return;
      var next = value != null ? String(value) : '';
      var tag = el.tagName ? String(el.tagName).toUpperCase() : '';
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') {
        el.value = next;
        return;
      }
      if (el.isContentEditable) {
        el.textContent = next;
        return;
      }
      el.textContent = next;
    }

    function questionContentToDisplayHtml(raw) {
      var text = String(raw || '');
      if (!text.trim()) return '-';
      if (/<[a-z][\\s\\S]*>/i.test(text)) return text;
      if (/!\[[^\]]*\]\([^)]+\)/.test(text)) return questionMarkdownToEditorHtml(text);
      return '<div class="whitespace-pre-wrap">' + escapeHtml(text) + '</div>';
    }

    function normalizeToolsNotesForEditor(raw) {
      var text = String(raw || '');
      if (!text.trim()) return '';
      if (/<[a-z][\\s\\S]*>/i.test(text)) return text;
      return minutesMarkdownToEditorHtml(text);
    }

    function getToolsFieldValue(id) {
      var el = document.getElementById(id);
      if (!el) return '';
      var tag = el.tagName ? String(el.tagName).toUpperCase() : '';
      if (id === 'tools_notes' && el.isContentEditable) return String(el.innerHTML || '');
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return String(el.value || '');
      if (el.isContentEditable) return String(el.textContent || '');
      return String(el.textContent || '');
    }

    function setToolsFieldValue(id, value) {
      var el = document.getElementById(id);
      if (!el) return;
      var next = value != null ? String(value) : '';
      var tag = el.tagName ? String(el.tagName).toUpperCase() : '';
      if (id === 'tools_notes' && el.isContentEditable) {
        el.innerHTML = normalizeToolsNotesForEditor(next);
        return;
      }
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') {
        el.value = next;
        return;
      }
      if (el.isContentEditable) {
        el.textContent = next;
        return;
      }
      el.textContent = next;
    }

    function normalizeRubricNotesForEditor(raw) {
      var text = String(raw || '');
      if (!text.trim()) return '';
      if (/<[a-z][\s\S]*>/i.test(text)) return text;
      return minutesMarkdownToEditorHtml(text);
    }

    function getRubricFieldValue(id) {
      var el = document.getElementById(id);
      if (!el) return '';
      var tag = el.tagName ? String(el.tagName).toUpperCase() : '';
      if (id === 'rubric_notes' && el.isContentEditable) return String(el.innerHTML || '');
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return String(el.value || '');
      if (el.isContentEditable) return String(el.textContent || '');
      return String(el.textContent || '');
    }

    function setRubricFieldValue(id, value) {
      var el = document.getElementById(id);
      if (!el) return;
      var next = value != null ? String(value) : '';
      var tag = el.tagName ? String(el.tagName).toUpperCase() : '';
      if (id === 'rubric_notes' && el.isContentEditable) {
        el.innerHTML = normalizeRubricNotesForEditor(next);
        return;
      }
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') {
        el.value = next;
        return;
      }
      if (el.isContentEditable) {
        el.textContent = next;
        return;
      }
      el.textContent = next;
    }

    function normalizeAchievementNotesForEditor(raw) {
      var text = String(raw || '');
      if (!text.trim()) return '';
      if (/<[a-z][\s\S]*>/i.test(text)) return text;
      return minutesMarkdownToEditorHtml(text);
    }

    function getAchievementFieldValue(id) {
      var el = document.getElementById(id);
      if (!el) return '';
      var tag = el.tagName ? String(el.tagName).toUpperCase() : '';
      if (id === 'achievement_notes' && el.isContentEditable) return String(el.innerHTML || '');
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return String(el.value || '');
      if (el.isContentEditable) return String(el.textContent || '');
      return String(el.textContent || '');
    }

    function setAchievementFieldValue(id, value) {
      var el = document.getElementById(id);
      if (!el) return;
      var next = value != null ? String(value) : '';
      var tag = el.tagName ? String(el.tagName).toUpperCase() : '';
      if (id === 'achievement_notes' && el.isContentEditable) {
        el.innerHTML = normalizeAchievementNotesForEditor(next);
        return;
      }
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') {
        el.value = next;
        return;
      }
      if (el.isContentEditable) {
        el.textContent = next;
        return;
      }
      el.textContent = next;
    }

    function normalizeReviewNotesForEditor(raw) {
      var text = String(raw || '');
      if (!text.trim()) return '';
      if (/<[a-z][\s\S]*>/i.test(text)) return text;
      return minutesMarkdownToEditorHtml(text);
    }

    function getReviewFieldValue(id) {
      var el = document.getElementById(id);
      if (!el) return '';
      var tag = el.tagName ? String(el.tagName).toUpperCase() : '';
      if (id === 'review_notes' && el.isContentEditable) return String(el.innerHTML || '');
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return String(el.value || '');
      if (el.isContentEditable) return String(el.textContent || '');
      return String(el.textContent || '');
    }

    function setReviewFieldValue(id, value) {
      var el = document.getElementById(id);
      if (!el) return;
      var next = value != null ? String(value) : '';
      var tag = el.tagName ? String(el.tagName).toUpperCase() : '';
      if (id === 'review_notes' && el.isContentEditable) {
        el.innerHTML = normalizeReviewNotesForEditor(next);
        return;
      }
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') {
        el.value = next;
        return;
      }
      if (el.isContentEditable) {
        el.textContent = next;
        return;
      }
      el.textContent = next;
    }

    function minutesContentToPrintHtml(text) {
      if (!text) return '';
      var raw = String(text);
      if (/<[a-z][\\s\\S]*>/i.test(raw)) {
        return raw
          .replace(/class="minutes-image-resizable"[^>]*contenteditable="false"/g, 'style="display:inline-block;resize:both;overflow:auto;max-width:100%;min-width:120px;min-height:80px;border:1px solid #d0d7de;background:#fff;padding:2px"')
          .replace(/<img([^>]*?)>/g, '<img$1 style="width:100%;height:100%;object-fit:contain;display:block;max-width:100%;border:1px solid #ccc" />');
      }
      var lines = raw.split('\\n');
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

    function readQuestionsAttachmentsFromDom() {
      var box = document.getElementById('questionsAttachmentsList');
      if (!box) return [];
      var out = [];
      box.querySelectorAll('[data-questions-attachment-url]').forEach(function(el) {
        out.push({
          url: el.getAttribute('data-questions-attachment-url') || '',
          name: el.getAttribute('data-questions-attachment-name') || 'file'
        });
      });
      return out;
    }

    function renderQuestionsAttachments(items) {
      var box = document.getElementById('questionsAttachmentsList');
      if (!box) return;
      var list = Array.isArray(items) ? items : [];
      if (!list.length) {
        box.innerHTML = '<p class="text-xs text-slate-400 py-1">첨부된 파일이 없습니다.</p>';
        return;
      }
      box.innerHTML = list.map(function(it, idx) {
        var u = escapeHtml(it.url || '');
        var n = escapeHtml(it.name || 'file');
        return '<div class="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm max-w-full" data-questions-attachment-url="' + u + '" data-questions-attachment-name="' + n + '">' +
          '<a href="' + u + '" target="_blank" rel="noopener noreferrer" class="text-sky-700 font-semibold truncate flex-1 min-w-0">' + n + '</a>' +
          '<button type="button" class="text-rose-600 text-xs font-black shrink-0" data-remove-questions-attachment="' + idx + '">삭제</button></div>';
      }).join('');
    }

    function removeQuestionsAttachment(index) {
      var items = readQuestionsAttachmentsFromDom();
      if (index >= 0 && index < items.length) items.splice(index, 1);
      renderQuestionsAttachments(items);
    }

    function readToolsAttachmentsFromDom() {
      var box = document.getElementById('toolsAttachmentsList');
      if (!box) return [];
      var out = [];
      box.querySelectorAll('[data-tools-attachment-url]').forEach(function(el) {
        out.push({
          url: el.getAttribute('data-tools-attachment-url') || '',
          name: el.getAttribute('data-tools-attachment-name') || 'file'
        });
      });
      return out;
    }

    function renderToolsAttachments(items) {
      var box = document.getElementById('toolsAttachmentsList');
      if (!box) return;
      var list = Array.isArray(items) ? items : [];
      if (!list.length) {
        box.innerHTML = '<p class="text-xs text-slate-400 py-1">첨부된 파일이 없습니다.</p>';
        return;
      }
      box.innerHTML = list.map(function(it, idx) {
        var u = escapeHtml(it.url || '');
        var n = escapeHtml(it.name || 'file');
        return '<div class="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm max-w-full" data-tools-attachment-url="' + u + '" data-tools-attachment-name="' + n + '">' +
          '<a href="' + u + '" target="_blank" rel="noopener noreferrer" class="text-sky-700 font-semibold truncate flex-1 min-w-0">' + n + '</a>' +
          '<button type="button" class="text-rose-600 text-xs font-black shrink-0" data-remove-tools-attachment="' + idx + '">삭제</button></div>';
      }).join('');
    }

    function removeToolsAttachment(index) {
      var items = readToolsAttachmentsFromDom();
      if (index >= 0 && index < items.length) items.splice(index, 1);
      renderToolsAttachments(items);
    }

    function readRubricAttachmentsFromDom() {
      var box = document.getElementById('rubricAttachmentsList');
      if (!box) return [];
      var out = [];
      box.querySelectorAll('[data-rubric-attachment-url]').forEach(function(el) {
        out.push({
          url: el.getAttribute('data-rubric-attachment-url') || '',
          name: el.getAttribute('data-rubric-attachment-name') || 'file'
        });
      });
      return out;
    }

    function renderRubricAttachments(items) {
      var box = document.getElementById('rubricAttachmentsList');
      if (!box) return;
      var list = Array.isArray(items) ? items : [];
      if (!list.length) {
        box.innerHTML = '<p class="text-xs text-slate-400 py-1">첨부된 파일이 없습니다.</p>';
        return;
      }
      box.innerHTML = list.map(function(it, idx) {
        var u = escapeHtml(it.url || '');
        var n = escapeHtml(it.name || 'file');
        return '<div class="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm max-w-full" data-rubric-attachment-url="' + u + '" data-rubric-attachment-name="' + n + '">' +
          '<a href="' + u + '" target="_blank" rel="noopener noreferrer" class="text-sky-700 font-semibold truncate flex-1 min-w-0">' + n + '</a>' +
          '<button type="button" class="text-rose-600 text-xs font-black shrink-0" data-remove-rubric-attachment="' + idx + '">삭제</button></div>';
      }).join('');
    }

    function removeRubricAttachment(index) {
      var items = readRubricAttachmentsFromDom();
      if (index >= 0 && index < items.length) items.splice(index, 1);
      renderRubricAttachments(items);
    }

    function readAchievementAttachmentsFromDom() {
      var box = document.getElementById('achievementAttachmentsList');
      if (!box) return [];
      var out = [];
      box.querySelectorAll('[data-achievement-attachment-url]').forEach(function(el) {
        out.push({
          url: el.getAttribute('data-achievement-attachment-url') || '',
          name: el.getAttribute('data-achievement-attachment-name') || 'file'
        });
      });
      return out;
    }

    function renderAchievementAttachments(items) {
      var box = document.getElementById('achievementAttachmentsList');
      if (!box) return;
      var list = Array.isArray(items) ? items : [];
      if (!list.length) {
        box.innerHTML = '<p class="text-xs text-slate-400 py-1">첨부된 파일이 없습니다.</p>';
        return;
      }
      box.innerHTML = list.map(function(it, idx) {
        var u = escapeHtml(it.url || '');
        var n = escapeHtml(it.name || 'file');
        return '<div class="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm max-w-full" data-achievement-attachment-url="' + u + '" data-achievement-attachment-name="' + n + '">' +
          '<a href="' + u + '" target="_blank" rel="noopener noreferrer" class="text-sky-700 font-semibold truncate flex-1 min-w-0">' + n + '</a>' +
          '<button type="button" class="text-rose-600 text-xs font-black shrink-0" data-remove-achievement-attachment="' + idx + '">삭제</button></div>';
      }).join('');
    }

    function removeAchievementAttachment(index) {
      var items = readAchievementAttachmentsFromDom();
      if (index >= 0 && index < items.length) items.splice(index, 1);
      renderAchievementAttachments(items);
    }

    function readReviewAttachmentsFromDom() {
      var box = document.getElementById('reviewAttachmentsList');
      if (!box) return [];
      var out = [];
      box.querySelectorAll('[data-review-attachment-url]').forEach(function(el) {
        out.push({
          url: el.getAttribute('data-review-attachment-url') || '',
          name: el.getAttribute('data-review-attachment-name') || 'file'
        });
      });
      return out;
    }

    function renderReviewAttachments(items) {
      var box = document.getElementById('reviewAttachmentsList');
      if (!box) return;
      var list = Array.isArray(items) ? items : [];
      if (!list.length) {
        box.innerHTML = '<p class="text-xs text-slate-400 py-1">첨부된 파일이 없습니다.</p>';
        return;
      }
      box.innerHTML = list.map(function(it, idx) {
        var u = escapeHtml(it.url || '');
        var n = escapeHtml(it.name || 'file');
        return '<div class="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm max-w-full" data-review-attachment-url="' + u + '" data-review-attachment-name="' + n + '">' +
          '<a href="' + u + '" target="_blank" rel="noopener noreferrer" class="text-sky-700 font-semibold truncate flex-1 min-w-0">' + n + '</a>' +
          '<button type="button" class="text-rose-600 text-xs font-black shrink-0" data-remove-review-attachment="' + idx + '">삭제</button></div>';
      }).join('');
    }

    function removeReviewAttachment(index) {
      var items = readReviewAttachmentsFromDom();
      if (index >= 0 && index < items.length) items.splice(index, 1);
      renderReviewAttachments(items);
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

    function readReviewSignaturesFromDom() {
      var chair = document.getElementById('reviewSignChairPreview');
      var writer = document.getElementById('reviewSignWriterPreview');
      var reviewer = document.getElementById('reviewSignReviewerPreview');
      return {
        chairperson: chair ? (chair.getAttribute('data-signature-url') || '') : '',
        writer: writer ? (writer.getAttribute('data-signature-url') || '') : '',
        reviewer: reviewer ? (reviewer.getAttribute('data-signature-url') || '') : ''
      };
    }

    function renderReviewSignaturePreview(previewId, url) {
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

    function renderReviewSignatures(signatures) {
      var s = signatures || {};
      renderReviewSignaturePreview('reviewSignChairPreview', s.chairperson || '');
      renderReviewSignaturePreview('reviewSignWriterPreview', s.writer || '');
      renderReviewSignaturePreview('reviewSignReviewerPreview', s.reviewer || '');
    }

    function removeReviewSignature(role) {
      if (role === 'chairperson') renderReviewSignaturePreview('reviewSignChairPreview', '');
      if (role === 'writer') renderReviewSignaturePreview('reviewSignWriterPreview', '');
      if (role === 'reviewer') renderReviewSignaturePreview('reviewSignReviewerPreview', '');
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

    function insertImageIntoEditable(targetEl, url) {
      if (!targetEl || !url) return false;
      var tag = targetEl.tagName ? String(targetEl.tagName).toUpperCase() : '';
      if (tag === 'TEXTAREA') {
        insertAtCursor(targetEl, '\\n![이미지](' + url + ')\\n');
        return true;
      }
      if (tag === 'INPUT') {
        insertAtCursor(targetEl, ' ![이미지](' + url + ') ');
        return true;
      }
      if (targetEl.isContentEditable && window.getSelection) {
        var sel = window.getSelection();
        if (!sel) return false;
        var range = sel.rangeCount > 0 ? sel.getRangeAt(0) : null;
        if (!range) {
          range = document.createRange();
          range.selectNodeContents(targetEl);
          range.collapse(false);
        }
        var wrap = document.createElement('div');
        wrap.className = 'minutes-image-resizable';
        wrap.setAttribute('contenteditable', 'false');
        wrap.style.width = '320px';
        var img = document.createElement('img');
        img.src = url;
        img.alt = '이미지';
        wrap.appendChild(img);
        var br = document.createElement('div');
        br.appendChild(document.createElement('br'));
        range.insertNode(br);
        range.insertNode(wrap);
        range.setStartAfter(br);
        range.setEndAfter(br);
        sel.removeAllRanges();
        sel.addRange(range);
        return true;
      }
      return false;
    }

    function openNcsPlanImageInsertModal(targetId, folder) {
      var modal = document.getElementById('ncsPlanImageInsertModal');
      var input = document.getElementById('ncsPlanImageInsertModalInput');
      var preview = document.getElementById('ncsPlanImageInsertPreview');
      var empty = document.getElementById('ncsPlanImageInsertPreviewEmpty');
      imageInsertContext = { targetId: String(targetId || ''), folder: String(folder || 'minutes'), file: null };
      if (input) input.value = '';
      if (preview) {
        preview.removeAttribute('src');
        preview.classList.add('hidden');
      }
      if (empty) empty.classList.remove('hidden');
      if (modal) modal.classList.remove('hidden');
    }

    function closeNcsPlanImageInsertModal() {
      var modal = document.getElementById('ncsPlanImageInsertModal');
      if (modal) modal.classList.add('hidden');
      imageInsertContext = { targetId: '', folder: 'minutes', file: null };
    }

    function openQuestionsPreviewModal(rowEl) {
      var modal = document.getElementById('ncsQuestionPreviewModal');
      var meta = document.getElementById('ncsQuestionPreviewMeta');
      var content = document.getElementById('ncsQuestionPreviewContent');
      if (!modal || !rowEl) return;

      var subject = String(rowEl.getAttribute('data-subject') || '');
      var no = String(rowEl.getAttribute('data-no') || '');
      var type = String(rowEl.getAttribute('data-type') || '');
      var score = String(rowEl.getAttribute('data-score') || '');
      var keyword = String(rowEl.getAttribute('data-keyword') || '');

      if (meta) {
        meta.textContent = [
          subject ? ('과목: ' + subject) : '',
          no ? ('번호: ' + no) : '',
          type ? ('유형: ' + type) : '',
          score ? ('배점: ' + score) : '',
          keyword ? ('평가기준: ' + keyword) : ''
        ].filter(Boolean).join(' | ');
      }

      // renderQuestionRows()에서 문항 내용은 4번째 td의 div 내부에 들어갑니다.
      var qHtml = '';
      try {
        var td = rowEl.querySelector('td:nth-child(4)');
        var div = td ? td.querySelector('div') : null;
        qHtml = div ? String(div.innerHTML || '') : '';
      } catch (e) {
        qHtml = '';
      }

      if (content) {
        content.innerHTML = qHtml || '<span class="text-slate-500 text-sm">내용 없음</span>';
      }

      modal.classList.remove('hidden');
    }

    function closeQuestionsPreviewModal() {
      var modal = document.getElementById('ncsQuestionPreviewModal');
      if (modal) modal.classList.add('hidden');
    }

    async function uploadNcsEvalPlanFile(file, isImage, planDocFolder) {
      if (!selectedCourseId) {
        alert('과정을 선택해 주세요.');
        return null;
      }
      var folder = 'ncs-plan-minutes/' + String(selectedCourseId);
      if (planDocFolder === 'questions') folder = 'ncs-plan-questions/' + String(selectedCourseId);
      if (planDocFolder === 'tools') folder = 'ncs-plan-tools/' + String(selectedCourseId);
      if (planDocFolder === 'rubric') folder = 'ncs-plan-rubric/' + String(selectedCourseId);
      if (planDocFolder === 'achievement') folder = 'ncs-plan-achievement/' + String(selectedCourseId);
      if (planDocFolder === 'review') folder = 'ncs-plan-review/' + String(selectedCourseId);
      var fd = new FormData();
      fd.append('file', file);
      fd.append('category', isImage ? 'images' : 'documents');
      fd.append('folder', folder);
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

    async function uploadMinutesFile(file, isImage) {
      return uploadNcsEvalPlanFile(file, isImage, 'minutes');
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
        var d = await fetchLmsCourseDetail(fixedCourseId);
        if (d && (d.title || d.name)) {
          window.__ncsEvalPlanCourseTitle = d.title || d.name;
          return window.__ncsEvalPlanCourseTitle;
        }
      } catch (e) {}
      var hint = document.getElementById('fixedCourseHint');
      return hint ? hint.textContent : '';
    }

    async function autoFillQuestionsCourseNameIfEmpty() {
      const current = String(getQuestionsFieldValue('questions_doc_title') || '').trim();
      if (current) return;
      var courseTitle = await resolveCourseTitleForPrint();
      if (!courseTitle) return;
      setQuestionsFieldValue('questions_doc_title', courseTitle);
    }

    async function printMinutesDocument() {
      if (!selectedCourseId) {
        alert('과정을 선택해 주세요.');
        return;
      }
      var courseTitle = await resolveCourseTitleForPrint();
      var subEl = document.getElementById('minutesPrintSubtitle');
      var docTitle = getMinutesFieldValue('minutes_doc_title');
      if (subEl) subEl.textContent = docTitle ? ('(' + docTitle + ')') : '';

      setMinutesPrintText('minutesPrintCourseName', courseTitle);
      setMinutesPrintText('minutesPrintSession', getMinutesFieldValue('minutes_session'));
      setMinutesPrintText('minutesPrintEvalRound', roundLabel(selectedRound));
      setMinutesPrintText('minutesPrintMeetingWhen', formatMinutesDateKorean(getMinutesFieldValue('minutes_meeting_date')));
      setMinutesPrintText('minutesPrintPlace', getMinutesFieldValue('minutes_meeting_location'));
      setMinutesPrintText('minutesPrintAttendees', getMinutesFieldValue('minutes_attendees'));
      setMinutesPrintText('minutesPrintAgenda', getMinutesFieldValue('minutes_agenda'));
      var rawContent = getMinutesFieldValue('minutes_content');
      setMinutesPrintHtml('minutesPrintContent', minutesContentToPrintHtml(rawContent));
      setMinutesPrintText('minutesPrintNotes', getMinutesFieldValue('minutes_notes'));
      setMinutesPrintApprovalRole('minutesPrintApprovalRoleChair', getMinutesFieldValue('minutes_approval_role_chair'), '담당');
      setMinutesPrintApprovalRole('minutesPrintApprovalRoleWriter', getMinutesFieldValue('minutes_approval_role_writer'), '팀장');
      setMinutesPrintApprovalRole('minutesPrintApprovalRoleReviewer', getMinutesFieldValue('minutes_approval_role_reviewer'), '원장');
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
      var docTitle = getQuestionsFieldValue('questions_doc_title');
      if (subEl) subEl.textContent = docTitle ? ('(' + docTitle + ')') : '';

      var subjLabel = getNcsSubjectSelectText('questionsSubjectSelect');

      setMinutesPrintText('questionsPrintCourseName', courseTitle || '-');
      setMinutesPrintText('questionsPrintSubject', subjLabel || '-');
      setMinutesPrintText('questionsPrintRound', roundLabel(selectedRound));
      setMinutesPrintText('questionsPrintDocTitle', docTitle || '-');
      setMinutesPrintText('questionsPrintWriter', getQuestionsFieldValue('questions_writer') || '-');

      var qAtt = readQuestionsAttachmentsFromDom();
      var qAttPrint = document.getElementById('questionsPrintAttachments');
      if (qAttPrint) {
        if (!qAtt.length) {
          qAttPrint.innerHTML = '<span class="text-slate-500">없음</span>';
        } else {
          qAttPrint.innerHTML = qAtt.map(function(a) {
            var u = escapeHtml(a.url || '');
            var n = escapeHtml(a.name || 'file');
            return '<div class="mb-1"><a href="' + u + '" class="text-sky-800 underline">' + n + '</a></div>';
          }).join('');
        }
      }

      var rows = readQuestionRowsFromTable();
      var total = rows.reduce(function(acc, r) { return acc + Number(r && r.score != null ? r.score : 0); }, 0);
      var target = Number(getQuestionsFieldValue('questions_total_target') || 0);
      var sumText = '총배점 ' + total + '점';
      if (target > 0) sumText += ' / 목표 ' + target + '점';
      setMinutesPrintText('questionsPrintScoreSummary', sumText);

      var tbody = document.getElementById('questionsPrintRowsBody');
      if (tbody) {
        if (!rows.length) {
          tbody.innerHTML = '<tr><td colspan="6" class="border border-black px-2 py-3 text-center text-slate-500 text-[10pt]">등록된 문항이 없습니다.</td></tr>';
        } else {
          var trNodes = document.querySelectorAll('#questionsRowsBody tr[data-question-row]');
          var qRowsForPrint = Array.prototype.slice.call(trNodes).map(function(tr) {
            var subject = String((tr.querySelector('td:nth-child(1)') || {}).textContent || '').trim();
            var noEl = tr.querySelector('td:nth-child(2)');
            var noText = noEl ? String(noEl.textContent || '').trim() : '';
            var typEl = tr.querySelector('td:nth-child(3)');
            var typText = typEl ? String(typEl.textContent || '').trim() : '-';
            var qDiv = tr.querySelector('td:nth-child(4) > div');
            var qHtml = qDiv ? String(qDiv.innerHTML || '') : '';
            var scEl = tr.querySelector('td:nth-child(5)');
            var scText = scEl ? String(scEl.textContent || '').trim() : '0';
            var kwEl = tr.querySelector('td:nth-child(6)');
            var kwText = kwEl ? String(kwEl.textContent || '').trim() : '-';
            return { subject: subject, noText: noText, typText: typText, qHtml: qHtml, scText: scText, kwText: kwText };
          });

          // 상단 교과목(하위) 표시도 문서에 포함된 과목 전체 기준으로 갱신
          var subjSet = {};
          qRowsForPrint.forEach(function(r) {
            var s = String(r?.subject || '').trim();
            if (s) subjSet[s] = true;
          });
          var allSubj = Object.keys(subjSet).join(', ');
          if (allSubj) setMinutesPrintText('questionsPrintSubject', allSubj);

          tbody.innerHTML = qRowsForPrint.map(function(r, idx) {
            var noVal = r.noText ? escapeHtml(r.noText) : String(idx + 1);
            var typ = escapeHtml(String(r.typText || '-'));
            var subject = escapeHtml(String(r.subject || '-'));
            var qHtml = r.qHtml ? String(r.qHtml) : '';
            var sc = escapeHtml(String(r.scText || '0'));
            var kw = escapeHtml(String(r.kwText || '-'));
            return '<tr>' +
              '<td class="border border-black px-2 py-2 text-left align-top whitespace-pre-wrap text-[10pt]">' + subject + '</td>' +
              '<td class="border border-black px-2 py-2 text-center align-top">' + noVal + '</td>' +
              '<td class="border border-black px-2 py-2 text-center align-top">' + typ + '</td>' +
              '<td class="border border-black px-2 py-2 text-left align-top text-[10pt]">' + (qHtml || '<span class="text-slate-500">-</span>') + '</td>' +
              '<td class="border border-black px-2 py-2 text-center align-top">' + sc + '</td>' +
              '<td class="border border-black px-2 py-2 text-left align-top whitespace-pre-wrap text-[10pt]">' + kw + '</td>' +
              '</tr>';
          }).join('');
        }
      }

      setMinutesPrintText('questionsPrintNotes', getQuestionsFieldValue('questions_notes'));
    }

    async function printQuestionsDocument() {
      if (!selectedCourseId) {
        alert('과정을 선택해 주세요.');
        return;
      }
      await fillQuestionsPrintSheet();
      document.body.setAttribute('data-print-target', 'questions');
      window.setTimeout(function() { window.print(); }, 50);
    }

    async function fillToolsPrintSheet() {
      var courseTitle = await resolveCourseTitleForPrint();
      var subEl = document.getElementById('toolsPrintSubtitle');
      var docTitle = getToolsFieldValue('tools_doc_title');
      if (subEl) subEl.textContent = docTitle ? ('(' + docTitle + ')') : '';

      var subjLabel = getNcsSubjectSelectText('toolsSubjectSelect');

      setMinutesPrintText('toolsPrintCourseName', courseTitle || '-');
      setMinutesPrintText('toolsPrintSubject', subjLabel || '-');
      setMinutesPrintText('toolsPrintRound', roundLabel(selectedRound));
      setMinutesPrintText('toolsPrintDocTitle', docTitle || '-');
      setMinutesPrintText('toolsPrintWriter', getToolsFieldValue('tools_writer') || '-');
      setMinutesPrintText('toolsPrintEvalDatetime', getToolsFieldValue('tools_eval_datetime') || '-');
      setMinutesPrintText('toolsPrintTrainee', getToolsFieldValue('tools_trainee') || '-');
      setMinutesPrintText('toolsPrintUnitLevel', getToolsFieldValue('tools_unit_name_level') || '-');
      setMinutesPrintText('toolsPrintInstructor', getToolsFieldValue('tools_instructor') || '-');
      setMinutesPrintText('toolsPrintElementFocus', getToolsFieldValue('tools_element_focus') || '-');
      setMinutesPrintText('toolsPrintEvalDuration', getToolsFieldValue('tools_eval_duration') || '-');
      setMinutesPrintText('toolsPrintAchievement', getToolsFieldValue('tools_achievement_note') || TOOLS_ACHIEVEMENT_DEFAULT);

      var tAtt = readToolsAttachmentsFromDom();
      var tAttPrint = document.getElementById('toolsPrintAttachments');
      if (tAttPrint) {
        if (!tAtt.length) {
          tAttPrint.innerHTML = '<span class="text-slate-500">없음</span>';
        } else {
          tAttPrint.innerHTML = tAtt.map(function(a) {
            var u = escapeHtml(a.url || '');
            var n = escapeHtml(a.name || 'file');
            return '<div class="mb-1"><a href="' + u + '" class="text-sky-800 underline">' + n + '</a></div>';
          }).join('');
        }
      }

      var critBody = document.getElementById('toolsPrintCriteriaBody');
      if (critBody) {
        var groups = toolsCriteriaGroupsState && toolsCriteriaGroupsState.length ? toolsCriteriaGroupsState : [];
        if (!groups.length) {
          critBody.innerHTML = '<tr><td colspan="3" class="border border-black px-2 py-3 text-center text-slate-500 text-[10pt]">평가내용 없음</td></tr>';
        } else {
          var html = '';
          for (var g = 0; g < groups.length; g++) {
            var grp = groups[g];
            var lines = Array.isArray(grp.lines) ? grp.lines : [];
            var rs = lines.length;
            if (rs < 1) continue;
            var title = escapeHtml(String(grp.element_title || '-'));
            for (var ln = 0; ln < lines.length; ln++) {
              var line = lines[ln] || {};
              var isFirst = ln === 0;
              html += '<tr>';
              if (isFirst) {
                html += '<td rowspan="' + rs + '" class="border border-black px-2 py-2 align-top text-[10pt] font-semibold whitespace-pre-wrap">' + title + '</td>';
              }
              var lineTxt = escapeHtml(String(line.label || '')) + ' ' + escapeHtml(String(line.text || ''));
              html += '<td class="border border-black px-2 py-2 align-top text-[10pt] whitespace-pre-wrap">' + lineTxt.trim() + '</td>';
              html += '<td class="border border-black px-2 py-2 w-20 bg-white">&nbsp;</td>';
              html += '</tr>';
            }
          }
          critBody.innerHTML = html || '<tr><td colspan="3" class="border border-black px-2 py-3 text-center text-slate-500 text-[10pt]">평가내용 없음</td></tr>';
        }
      }

      var rows = readToolRowsFromTable();
      var totalScore = rows.reduce(function(acc, r) { return acc + Number(r && r.score != null ? r.score : 0); }, 0);
      var targetTime = getToolsFieldValue('tools_target_time').toString().trim();
      var summary = '총배점(레거시) ' + totalScore + '점';
      if (targetTime) summary = '총시간 ' + targetTime + ' / ' + summary;
      setMinutesPrintText('toolsPrintSummary', summary);

      setMinutesPrintHtml('toolsPrintNotes', minutesContentToPrintHtml(getToolsFieldValue('tools_notes')));
    }

    async function printToolsDocument() {
      if (!selectedCourseId) {
        alert('과정을 선택해 주세요.');
        return;
      }
      await fillToolsPrintSheet();
      document.body.setAttribute('data-print-target', 'tools');
      window.setTimeout(function() { window.print(); }, 50);
    }

    async function fillRubricPrintSheet() {
      var courseTitle = await resolveCourseTitleForPrint();
      var subEl = document.getElementById('rubricPrintSubtitle');
      var docTitle = getRubricFieldValue('rubric_doc_title');
      if (subEl) subEl.textContent = docTitle ? ('(' + docTitle + ')') : '';

      var subjLabel = getNcsSubjectSelectText('rubric_subject_name');

      setMinutesPrintText('rubricPrintCourseName', courseTitle || '-');
      setMinutesPrintText('rubricPrintSubject', subjLabel || '-');
      setMinutesPrintText('rubricPrintRound', roundLabel(selectedRound));
      setMinutesPrintText('rubricPrintDocTitle', docTitle || '-');
      setMinutesPrintText('rubricPrintWriter', getRubricFieldValue('rubric_writer') || '-');

      var rAtt = readRubricAttachmentsFromDom();
      var rAttPrint = document.getElementById('rubricPrintAttachments');
      if (rAttPrint) {
        if (!rAtt.length) {
          rAttPrint.innerHTML = '<span class="text-slate-500">없음</span>';
        } else {
          rAttPrint.innerHTML = rAtt.map(function(a) {
            var u = escapeHtml(a.url || '');
            var n = escapeHtml(a.name || 'file');
            return '<div class="mb-1"><a href="' + u + '" class="text-sky-800 underline">' + n + '</a></div>';
          }).join('');
        }
      }

      var rows = readRubricRowsFromTable();
      var total = rows.reduce(function(acc, r) { return acc + Number(r && r.score != null ? r.score : 0); }, 0);
      var target = Number(getRubricFieldValue('rubric_total_target') || 0);
      var sumText = '총배점 ' + total + '점';
      if (target > 0) sumText += ' / 기준 ' + target + '점';
      setMinutesPrintText('rubricPrintScoreSummary', sumText);

      var tbody = document.getElementById('rubricPrintRowsBody');
      if (tbody) {
        if (!rows.length) {
          tbody.innerHTML = '<tr><td colspan="5" class="border border-black px-2 py-3 text-center text-slate-500 text-[10pt]">등록된 채점기준이 없습니다.</td></tr>';
        } else {
          tbody.innerHTML = rows.map(function(row) {
            var item = escapeHtml(String(row && row.item != null ? row.item : '-'));
            var score = Number(row && row.score != null ? row.score : 0);
            var high = escapeHtml(String(row && row.high != null ? row.high : '-'));
            var mid = escapeHtml(String(row && row.mid != null ? row.mid : '-'));
            var low = escapeHtml(String(row && row.low != null ? row.low : '-'));
            return '<tr>' +
              '<td class="border border-black px-2 py-2 text-left align-top whitespace-pre-wrap text-[10pt]">' + item + '</td>' +
              '<td class="border border-black px-2 py-2 text-center align-top">' + score + '</td>' +
              '<td class="border border-black px-2 py-2 text-left align-top whitespace-pre-wrap text-[10pt]">' + high + '</td>' +
              '<td class="border border-black px-2 py-2 text-left align-top whitespace-pre-wrap text-[10pt]">' + mid + '</td>' +
              '<td class="border border-black px-2 py-2 text-left align-top whitespace-pre-wrap text-[10pt]">' + low + '</td>' +
              '</tr>';
          }).join('');
        }
      }

      setMinutesPrintHtml('rubricPrintNotes', minutesContentToPrintHtml(getRubricFieldValue('rubric_notes')));
    }

    async function printRubricDocument() {
      if (!selectedCourseId) {
        alert('과정을 선택해 주세요.');
        return;
      }
      await fillRubricPrintSheet();
      document.body.setAttribute('data-print-target', 'rubric');
      window.setTimeout(function() { window.print(); }, 50);
    }

    async function fillAchievementPrintSheet() {
      var courseTitle = await resolveCourseTitleForPrint();
      var subEl = document.getElementById('achievementPrintSubtitle');
      var docTitle = getAchievementFieldValue('achievement_doc_title');
      if (subEl) subEl.textContent = docTitle ? ('(' + docTitle + ')') : '';

      var subjLabel = getNcsSubjectSelectText('achievement_subject_name');

      setMinutesPrintText('achievementPrintCourseName', courseTitle || '-');
      setMinutesPrintText('achievementPrintSubject', subjLabel || '-');
      setMinutesPrintText('achievementPrintRound', roundLabel(selectedRound));
      setMinutesPrintText('achievementPrintDocTitle', docTitle || '-');
      setMinutesPrintText('achievementPrintWriter', getAchievementFieldValue('achievement_writer') || '-');

      var aAtt = readAchievementAttachmentsFromDom();
      var aAttPrint = document.getElementById('achievementPrintAttachments');
      if (aAttPrint) {
        if (!aAtt.length) {
          aAttPrint.innerHTML = '<span class="text-slate-500">없음</span>';
        } else {
          aAttPrint.innerHTML = aAtt.map(function(a) {
            var u = escapeHtml(a.url || '');
            var n = escapeHtml(a.name || 'file');
            return '<div class="mb-1"><a href="' + u + '" class="text-sky-800 underline">' + n + '</a></div>';
          }).join('');
        }
      }

      var rows = readAchievementRowsFromTable();
      var sumScore = rows.reduce(function(acc, r) { return acc + Number(r && r.score_distribution != null ? r.score_distribution : (r && r.max_score != null ? r.max_score : 0)); }, 0);
      var targetScore = Number(getAchievementFieldValue('achievement_target_score') || 0);
      var summary = '점수분배 합계 ' + sumScore + '점';
      if (targetScore > 0) summary = '만점 ' + targetScore + '점 / ' + summary;
      setMinutesPrintText('achievementPrintSummary', summary);

      var tbody = document.getElementById('achievementPrintRowsBody');
      if (tbody) {
        if (!rows.length) {
          tbody.innerHTML = '<tr><td colspan="4" class="border border-black px-2 py-3 text-center text-slate-500 text-[10pt]">등록된 성취수준 항목이 없습니다.</td></tr>';
        } else {
          tbody.innerHTML = rows.map(function(row) {
            var level = escapeHtml(String(row && row.level != null ? row.level : '-'));
            var criteria = escapeHtml(String(row && row.criteria != null ? row.criteria : ''));
            var scoreDistribution = Number(row && row.score_distribution != null ? row.score_distribution : (row && row.max_score != null ? row.max_score : 0));
            var fail = escapeHtml(String(row && row.fail != null ? row.fail : ''));
            return '<tr>' +
              '<td class="border border-black px-2 py-2 text-center align-top">' + level + '</td>' +
              '<td class="border border-black px-2 py-2 text-left align-top whitespace-pre-wrap text-[10pt]">' + criteria + '</td>' +
              '<td class="border border-black px-2 py-2 text-center align-top">' + scoreDistribution + '</td>' +
              '<td class="border border-black px-2 py-2 text-center align-top">' + fail + '</td>' +
              '</tr>';
          }).join('');
        }
      }

      setMinutesPrintHtml('achievementPrintNotes', minutesContentToPrintHtml(getAchievementFieldValue('achievement_notes')));
    }

    async function printAchievementDocument() {
      if (!selectedCourseId) {
        alert('과정을 선택해 주세요.');
        return;
      }
      await fillAchievementPrintSheet();
      document.body.setAttribute('data-print-target', 'achievement');
      window.setTimeout(function() { window.print(); }, 50);
    }

    async function fillReviewPrintSheet() {
      var courseTitle = await resolveCourseTitleForPrint();
      var subEl = document.getElementById('reviewPrintSubtitle');
      var docTitle = getReviewFieldValue('review_doc_title');
      if (subEl) subEl.textContent = docTitle ? ('(' + docTitle + ')') : '';

      var subjLabel = getNcsSubjectSelectText('review_subject_name');

      setMinutesPrintText('reviewPrintCourseName', courseTitle || '-');
      setMinutesPrintText('reviewPrintSubject', subjLabel || '-');
      setMinutesPrintText('reviewPrintRound', roundLabel(selectedRound));
      setMinutesPrintText('reviewPrintDocTitle', docTitle || '-');

      setMinutesPrintText('reviewPrintWriter', getReviewFieldValue('review_writer') || '-');
      setMinutesPrintText('reviewPrintReviewer', getReviewFieldValue('review_reviewer') || '-');
      setMinutesPrintApprovalRole('reviewPrintApprovalRoleChair', getReviewFieldValue('review_approval_role_chair') || '', '팀장');
      setMinutesPrintApprovalRole('reviewPrintApprovalRoleWriter', getReviewFieldValue('review_approval_role_writer') || '', '실장');
      setMinutesPrintApprovalRole('reviewPrintApprovalRoleReviewer', getReviewFieldValue('review_approval_role_reviewer') || '', '원장');
      var rsig = readReviewSignaturesFromDom();
      setMinutesPrintSignature('reviewPrintSignChair', rsig.chairperson);
      setMinutesPrintSignature('reviewPrintSignWriter', rsig.writer);
      setMinutesPrintSignature('reviewPrintSignReviewer', rsig.reviewer);

      var rows = readReviewRowsFromTable();
      var total = rows.length;
      var judged = rows.filter(function(r) { return !!(r && (r.adequate || r.needs_revision)); }).length;
      var rate = total > 0 ? Math.round((judged / total) * 100) : 0;
      setMinutesPrintText('reviewPrintCompletion', rate + '% (' + judged + '/' + total + ')');

      var rvAtt = readReviewAttachmentsFromDom();
      var rvAttPrint = document.getElementById('reviewPrintAttachments');
      if (rvAttPrint) {
        if (!rvAtt.length) {
          rvAttPrint.innerHTML = '<span class="text-slate-500">없음</span>';
        } else {
          rvAttPrint.innerHTML = rvAtt.map(function(a) {
            var u = escapeHtml(a.url || '');
            var n = escapeHtml(a.name || 'file');
            return '<div class="mb-1"><a href="' + u + '" class="text-sky-800 underline">' + n + '</a></div>';
          }).join('');
        }
      }

      var tbody = document.getElementById('reviewPrintRowsBody');
      if (tbody) {
        if (!rows.length) {
          tbody.innerHTML = '<tr><td colspan="4" class="border border-black px-2 py-3 text-center text-slate-500 text-[10pt]">등록된 검토항목이 없습니다.</td></tr>';
        } else {
          tbody.innerHTML = rows.map(function(row) {
            var item = escapeHtml(String(row && row.item != null ? row.item : '-'));
            var comment = escapeHtml(String(row && row.comment != null ? row.comment : ''));
            var okTxt = row && row.adequate ? 'O' : '';
            var fixTxt = row && row.needs_revision ? 'O' : '';
            return '<tr>' +
              '<td class="border border-black px-2 py-2 text-left align-top whitespace-pre-wrap text-[10pt]">' + item + '</td>' +
              '<td class="border border-black px-2 py-2 text-left align-top whitespace-pre-wrap text-[10pt]">' + comment + '</td>' +
              '<td class="border border-black px-2 py-2 text-center align-top">' + okTxt + '</td>' +
              '<td class="border border-black px-2 py-2 text-center align-top">' + fixTxt + '</td>' +
              '</tr>';
          }).join('');
        }
      }

      setMinutesPrintHtml('reviewPrintNotes', minutesContentToPrintHtml(getReviewFieldValue('review_notes')));
    }

    async function printReviewDocument() {
      if (!selectedCourseId) {
        alert('과정을 선택해 주세요.');
        return;
      }
      await fillReviewPrintSheet();
      document.body.setAttribute('data-print-target', 'review');
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
          title: getMinutesFieldValue('minutes_doc_title'),
          payload: {
            opening_session: getMinutesFieldValue('minutes_session'),
            meeting_date: getMinutesFieldValue('minutes_meeting_date'),
            meeting_location: getMinutesFieldValue('minutes_meeting_location'),
            chairperson: getMinutesFieldValue('minutes_chairperson'),
            writer: getMinutesFieldValue('minutes_writer'),
            reviewer: getMinutesFieldValue('minutes_reviewer'),
            approval_role_chair: getMinutesFieldValue('minutes_approval_role_chair'),
            approval_role_writer: getMinutesFieldValue('minutes_approval_role_writer'),
            approval_role_reviewer: getMinutesFieldValue('minutes_approval_role_reviewer'),
            attendees: getMinutesFieldValue('minutes_attendees'),
            agenda: getMinutesFieldValue('minutes_agenda'),
            content: getMinutesFieldValue('minutes_content'),
            notes: getMinutesFieldValue('minutes_notes'),
            attachments: readMinutesAttachmentsFromDom(),
            signatures: readMinutesSignaturesFromDom()
          }
        };
      }
      if (tabId === 'schedule') {
        var rawSess = selectedSessionIdForSubject ? parseInt(String(selectedSessionIdForSubject), 10) : NaN;
        var sRows = readScheduleRowsFromTable();
        var sCidSet = {};
        (Array.isArray(sRows) ? sRows : []).forEach(function(r) {
          var cid = r && r.curriculum_id != null ? String(r.curriculum_id).trim() : '';
          if (cid) sCidSet[cid] = true;
        });
        var sCids = Object.keys(sCidSet);
        var sSingleCid = (sCids.length === 1) ? parseInt(sCids[0], 10) : NaN;
        var sSingleSubj = (sCids.length === 1) ? (String((sRows[0] && sRows[0].subject) || '')).trim() : '';
        return {
          title: (document.getElementById('schedule_doc_title') || {}).value || '',
          payload: {
            writer: (document.getElementById('schedule_writer') || {}).value || '',
            notes: (document.getElementById('schedule_notes') || {}).value || '',
            rows: sRows,
            session_id: Number.isFinite(rawSess) && rawSess > 0 ? rawSess : '',
            // 여러 교과목 일정을 한 문서에 저장할 수 있으므로, 단일 교과목일 때만 상단 필드에 채웁니다.
            curriculum_id: Number.isFinite(sSingleCid) && sSingleCid > 0 ? sSingleCid : '',
            subject_name: sSingleSubj
          }
        };
      }
      if (tabId === 'questions') {
        var qRawSess = selectedSessionIdForSubject ? parseInt(String(selectedSessionIdForSubject), 10) : NaN;
        var qRows = readQuestionRowsFromTable();
        var qCidSet = {};
        (Array.isArray(qRows) ? qRows : []).forEach(function(r) {
          var cid = r && r.curriculum_id != null ? String(r.curriculum_id).trim() : '';
          if (cid) qCidSet[cid] = true;
        });
        var qCids = Object.keys(qCidSet);
        var qSingleCid = (qCids.length === 1) ? parseInt(qCids[0], 10) : NaN;
        var qSingleSubj = (qCids.length === 1) ? (String((qRows[0] && qRows[0].subject) || '')).trim() : '';
        return {
          title: getQuestionsFieldValue('questions_doc_title'),
          payload: {
            writer: getQuestionsFieldValue('questions_writer'),
            total_target: Number(getQuestionsFieldValue('questions_total_target') || 0),
            notes: getQuestionsFieldValue('questions_notes'),
            attachments: readQuestionsAttachmentsFromDom(),
            rows: qRows,
            session_id: Number.isFinite(qRawSess) && qRawSess > 0 ? qRawSess : '',
            // 여러 교과목 문항을 한 문서에 저장할 수 있으므로, 단일 교과목일 때만 상단 필드에 채웁니다.
            curriculum_id: Number.isFinite(qSingleCid) && qSingleCid > 0 ? qSingleCid : '',
            subject_name: qSingleSubj
          }
        };
      }
      if (tabId === 'tools') {
        var tRawSess = selectedSessionIdForSubject ? parseInt(String(selectedSessionIdForSubject), 10) : NaN;
        var tSubEl = document.getElementById('toolsSubjectSelect');
        var tRawCur = tSubEl && tSubEl.value ? parseInt(tSubEl.value, 10) : NaN;
        return {
          title: getToolsFieldValue('tools_doc_title'),
          payload: {
            writer: getToolsFieldValue('tools_writer'),
            target_time: getToolsFieldValue('tools_target_time'),
            notes: getToolsFieldValue('tools_notes'),
            attachments: readToolsAttachmentsFromDom(),
            criteria_groups: JSON.parse(JSON.stringify(toolsCriteriaGroupsState || [])),
            tools_eval_datetime: getToolsFieldValue('tools_eval_datetime'),
            tools_trainee: getToolsFieldValue('tools_trainee'),
            tools_instructor: getToolsFieldValue('tools_instructor'),
            tools_unit_name_level: getToolsFieldValue('tools_unit_name_level'),
            tools_element_focus: getToolsFieldValue('tools_element_focus'),
            tools_eval_duration: getToolsFieldValue('tools_eval_duration'),
            tools_achievement_note: getToolsFieldValue('tools_achievement_note'),
            tools_display_course: getToolsFieldValue('tools_display_course'),
            rows: readToolRowsFromTable(),
            session_id: Number.isFinite(tRawSess) && tRawSess > 0 ? tRawSess : '',
            curriculum_id: Number.isFinite(tRawCur) && tRawCur > 0 ? tRawCur : '',
            subject_name: getNcsSubjectSelectText('toolsSubjectSelect')
          }
        };
      }
      if (tabId === 'rubric') {
        var ruRawCur = parseInt(String(getNcsSubjectSelectCurriculumValue('rubric_subject_name') || ''), 10);
        var ruRawSess = selectedSessionIdForSubject ? parseInt(String(selectedSessionIdForSubject), 10) : NaN;
        return {
          title: getRubricFieldValue('rubric_doc_title'),
          payload: {
            writer: getRubricFieldValue('rubric_writer'),
            subject_name: getNcsSubjectSelectText('rubric_subject_name'),
            curriculum_id: Number.isFinite(ruRawCur) && ruRawCur > 0 ? ruRawCur : '',
            session_id: Number.isFinite(ruRawSess) && ruRawSess > 0 ? ruRawSess : '',
            unit_name: getRubricFieldValue('rubric_unit_name'),
            total_target: Number(getRubricFieldValue('rubric_total_target') || 0),
            notes: getRubricFieldValue('rubric_notes'),
            attachments: readRubricAttachmentsFromDom(),
            rows: readRubricRowsFromTable()
          }
        };
      }
      if (tabId === 'achievement') {
        var achRawCur = parseInt(String(getNcsSubjectSelectCurriculumValue('achievement_subject_name') || ''), 10);
        var achRawSess = selectedSessionIdForSubject ? parseInt(String(selectedSessionIdForSubject), 10) : NaN;
        return {
          title: getAchievementFieldValue('achievement_doc_title'),
          payload: {
            writer: getAchievementFieldValue('achievement_writer'),
            eval_date: getAchievementFieldValue('achievement_eval_date'),
            subject_name: getNcsSubjectSelectText('achievement_subject_name'),
            curriculum_id: Number.isFinite(achRawCur) && achRawCur > 0 ? achRawCur : '',
            session_id: Number.isFinite(achRawSess) && achRawSess > 0 ? achRawSess : '',
            trainee: getAchievementFieldValue('achievement_trainee'),
            unit_level: getAchievementFieldValue('achievement_unit_level'),
            target_score: Number(getAchievementFieldValue('achievement_target_score') || 0),
            notes: getAchievementFieldValue('achievement_notes'),
            score_item_name: getAchievementFieldValue('achievement_score_item_name'),
            score_raw: getAchievementFieldValue('achievement_score_raw'),
            score_converted: getAchievementFieldValue('achievement_score_converted'),
            score_comment: getAchievementFieldValue('achievement_score_comment'),
            attachments: readAchievementAttachmentsFromDom(),
            rows: readAchievementRowsFromTable()
          }
        };
      }
      if (tabId === 'review') {
        var revRawCur = parseInt(String(getNcsSubjectSelectCurriculumValue('review_subject_name') || ''), 10);
        var revRawSess = selectedSessionIdForSubject ? parseInt(String(selectedSessionIdForSubject), 10) : NaN;
        return {
          title: getReviewFieldValue('review_doc_title'),
          payload: {
            writer: getReviewFieldValue('review_writer'),
            reviewer: getReviewFieldValue('review_reviewer'),
            approval_role_chair: getReviewFieldValue('review_approval_role_chair'),
            approval_role_writer: getReviewFieldValue('review_approval_role_writer'),
            approval_role_reviewer: getReviewFieldValue('review_approval_role_reviewer'),
            subject_name: getNcsSubjectSelectText('review_subject_name'),
            curriculum_id: Number.isFinite(revRawCur) && revRawCur > 0 ? revRawCur : '',
            session_id: Number.isFinite(revRawSess) && revRawSess > 0 ? revRawSess : '',
            unit_level: getReviewFieldValue('review_unit_level'),
            tool_name: getReviewFieldValue('review_tool_name'),
            review_date: getReviewFieldValue('review_review_date'),
            notes: getReviewFieldValue('review_notes'),
            attachments: readReviewAttachmentsFromDom(),
            signatures: readReviewSignaturesFromDom(),
            rows: readReviewRowsFromTable()
          }
        };
      }
      return {
        title: (document.getElementById(tabId + '_doc_title') || {}).value || '',
        payload: { body: (document.getElementById(tabId + '_body') || {}).value || '' }
      };
    }

    function normalizeSchedulePayloadRows(rows) {
      if (!Array.isArray(rows)) return [];
      return rows.map(function(r) {
        var subj = String(r.subject || r.subject_name || '').trim();
        if (!subj && r.target != null && String(r.target).trim() !== '') subj = String(r.target).trim();
        var cid = r.curriculum_id != null && String(r.curriculum_id).trim() !== '' ? String(r.curriculum_id).trim() : '';
        var instructorName = String(r.instructor_name || r.instructor || '').trim();
        var instructorId = r.instructor_id != null && String(r.instructor_id).trim() !== '' ? String(r.instructor_id).trim() : '';
        return {
          subject: subj || '-',
          curriculum_id: cid,
          date: String(r.date || '').trim(),
          time: String(r.time || '').trim(),
          place: String(r.place || '').trim(),
          instructor_id: instructorId,
          instructor_name: instructorName
        };
      });
    }

    function applyScheduleDocTitleAuto() {
      var el = document.getElementById('schedule_doc_title');
      if (!el) return;
      el.value = roundLabel(selectedRound) + ' 평가 실시 일정';
    }

    function updateScheduleAddButtonLabel() {
      var lbl = document.getElementById('scheduleAddRowBtnLabel');
      if (lbl) lbl.textContent = schedulePendingEditIndex !== null ? '수정 반영' : '일정 추가';
    }

    function clearScheduleInputRow() {
      var d = document.getElementById('scheduleInputDate');
      var t = document.getElementById('scheduleInputTime');
      var p = document.getElementById('scheduleInputPlace');
      if (d) d.value = '';
      if (t) t.value = '';
      if (p) p.value = '';
      var ins = document.getElementById('scheduleInstructorSelect');
      if (ins && String(ins.tagName).toUpperCase() === 'SELECT' && !ins.disabled && ins.options.length > 0) {
        ins.selectedIndex = 0;
      }
    }

    function resetScheduleInstructorSelect() {
      var el = document.getElementById('scheduleInstructorSelect');
      if (!el || String(el.tagName).toUpperCase() !== 'SELECT') return;
      el.innerHTML = '<option value="">강사 선택</option>';
      el.disabled = true;
      scheduleInstructorOptions = [];
    }

    function applyScheduleInstructorSelectValue(instructorIdRaw, instructorNameRaw) {
      var el = document.getElementById('scheduleInstructorSelect');
      if (!el || String(el.tagName).toUpperCase() !== 'SELECT') return;
      var iid = instructorIdRaw != null ? String(instructorIdRaw).trim() : '';
      var name = String(instructorNameRaw || '').trim();
      if (iid) {
        var hasIdOption = false;
        for (var k = 0; k < el.options.length; k++) {
          if (String(el.options[k].value || '').trim() === iid) {
            hasIdOption = true;
            break;
          }
        }
        if (!hasIdOption) {
          var injected = document.createElement('option');
          injected.value = iid;
          injected.textContent = name || ('강사 #' + iid);
          el.appendChild(injected);
        }
      } else if (name) {
        var hasNameOption = false;
        for (var n = 0; n < el.options.length; n++) {
          if (String(el.options[n].textContent || '').trim() === name) {
            hasNameOption = true;
            break;
          }
        }
        if (!hasNameOption) {
          var injectedByName = document.createElement('option');
          injectedByName.value = '';
          injectedByName.textContent = name;
          el.appendChild(injectedByName);
        }
      }
      if (iid) {
        el.value = iid;
        if (el.value === iid) return;
      }
      if (!name) {
        el.value = '';
        return;
      }
      for (var i = 0; i < el.options.length; i++) {
        var o = el.options[i];
        if (String(o.textContent || '').trim() === name) {
          el.value = o.value;
          return;
        }
      }
      el.value = '';
    }

    async function loadScheduleInstructorOptions(sessionId) {
      var el = document.getElementById('scheduleInstructorSelect');
      if (!el || String(el.tagName).toUpperCase() !== 'SELECT') return;
      if (!sessionId) {
        resetScheduleInstructorSelect();
        return;
      }
      try {
        var res = await authFetch('/api/course-sessions/' + encodeURIComponent(String(sessionId)) + '/timetable/resources');
        var json = await res.json();
        var data = json && json.data;
        var list = data && Array.isArray(data.instructors) ? data.instructors : [];
        var seen = {};
        scheduleInstructorOptions = list.filter(function(inst) {
          if (!inst || inst.id == null) return false;
          var key = String(inst.id);
          if (seen[key]) return false;
          seen[key] = true;
          return true;
        }).map(function(inst) {
          return { id: String(inst.id), name: String(inst.name || '').trim() || ('강사 #' + String(inst.id)) };
        });
        el.innerHTML = '<option value="">강사 선택</option>';
        scheduleInstructorOptions.forEach(function(inst) {
          var opt = document.createElement('option');
          opt.value = inst.id;
          opt.textContent = inst.name;
          el.appendChild(opt);
        });
        el.disabled = false;
      } catch (e) {
        console.error(e);
        resetScheduleInstructorSelect();
      }
    }

    function readScheduleRowsFromTable() {
      const body = document.getElementById('scheduleRowsBody');
      if (!body) return [];
      const rows = [];
      body.querySelectorAll('tr[data-schedule-row]').forEach(function(tr) {
        rows.push({
          subject: tr.getAttribute('data-subject') || '',
          curriculum_id: tr.getAttribute('data-curriculum-id') || '',
          date: tr.getAttribute('data-date') || '',
          time: tr.getAttribute('data-time') || '',
          place: tr.getAttribute('data-place') || '',
          instructor_id: tr.getAttribute('data-instructor-id') || '',
          instructor_name: tr.getAttribute('data-instructor-name') || ''
        });
      });
      return rows;
    }

    function renderScheduleRows(rows) {
      const body = document.getElementById('scheduleRowsBody');
      if (!body) return;
      const safeRows = (Array.isArray(rows) ? rows : []).slice().sort(function(a, b) {
        var sa = String(a?.subject || '');
        var sb = String(b?.subject || '');
        if (sa !== sb) return sa.localeCompare(sb);
        var da = String(a?.date || '');
        var db = String(b?.date || '');
        if (da !== db) return da.localeCompare(db);
        return String(a?.time || '').localeCompare(String(b?.time || ''));
      });
      if (!safeRows.length) {
        body.innerHTML = '<tr><td colspan="7" class="border border-black px-3 py-8 text-center text-sm text-slate-400">등록된 일정이 없습니다.</td></tr>';
        return;
      }
      body.innerHTML = safeRows.map(function(row, idx) {
        const subject = String(row?.subject || '');
        const cid = String(row?.curriculum_id || '');
        const date = String(row?.date || '');
        const time = String(row?.time || '');
        const place = String(row?.place || '');
        const instructorId = String(row?.instructor_id || '');
        const instructorName = String(row?.instructor_name || '');
        return '<tr data-schedule-row data-subject="' + escapeHtml(subject) + '" data-curriculum-id="' + escapeHtml(cid) + '" data-date="' + escapeHtml(date) + '" data-time="' + escapeHtml(time) + '" data-place="' + escapeHtml(place) + '" data-instructor-id="' + escapeHtml(instructorId) + '" data-instructor-name="' + escapeHtml(instructorName) + '">' +
          '<td class="border border-black px-2 py-2 text-sm text-slate-800">' + escapeHtml(subject || '-') + '</td>' +
          '<td class="border border-black px-2 py-2 text-sm text-slate-800">' + escapeHtml(date || '-') + '</td>' +
          '<td class="border border-black px-2 py-2 text-sm text-slate-800">' + escapeHtml(time || '-') + '</td>' +
          '<td class="border border-black px-2 py-2 text-sm text-slate-800">' + escapeHtml(place || '-') + '</td>' +
          '<td class="border border-black px-2 py-2 text-sm text-slate-800">' + escapeHtml(instructorName || '-') + '</td>' +
          '<td class="border border-black px-2 py-2 text-center align-middle"><button type="button" class="px-2.5 py-1.5 rounded-lg border border-amber-200 bg-amber-50 text-amber-700 text-xs font-black hover:bg-amber-100 transition" data-edit-schedule-row="' + idx + '">수정</button></td>' +
          '<td class="border border-black px-2 py-2 text-center align-middle"><button type="button" class="px-2.5 py-1.5 rounded-lg border border-rose-200 bg-rose-50 text-rose-700 text-xs font-black hover:bg-rose-100 transition" data-remove-schedule-row="' + idx + '">삭제</button></td>' +
        '</tr>';
      }).join('');
    }

    function readScheduleInstructorFromSelect(instructorEl) {
      if (!instructorEl || String(instructorEl.tagName).toUpperCase() !== 'SELECT') {
        return { instructor_id: '', instructor_name: '' };
      }
      if (instructorEl.selectedIndex <= 0) {
        return { instructor_id: '', instructor_name: '' };
      }
      var opt = instructorEl.options[instructorEl.selectedIndex];
      if (!opt) return { instructor_id: '', instructor_name: '' };
      var iid = String(opt.value || '').trim();
      var iname = String(opt.textContent || '').trim();
      if (iname === '강사 선택') iname = '';
      return { instructor_id: iid, instructor_name: iname };
    }

    function addScheduleRowFromInputs() {
      const subSel = document.getElementById('scheduleSubjectSelect');
      const dateEl = document.getElementById('scheduleInputDate');
      const timeEl = document.getElementById('scheduleInputTime');
      const placeEl = document.getElementById('scheduleInputPlace');
      const instructorEl = document.getElementById('scheduleInstructorSelect');
      const curriculumId = subSel ? String(subSel.value || '').trim() : '';
      var instRead = readScheduleInstructorFromSelect(instructorEl);
      var instructorId = instRead.instructor_id;
      var instructorName = instRead.instructor_name;
      var subjectLabel = '';
      if (subSel && subSel.selectedIndex >= 0 && subSel.options[subSel.selectedIndex]) {
        subjectLabel = String(subSel.options[subSel.selectedIndex].textContent || '').trim();
      }
      const date = (dateEl?.value || '').trim();
      const time = (timeEl?.value || '').trim();
      const place = (placeEl?.value || '').trim();

      if (!curriculumId) {
        alert('일정 입력란의 교과목 · 하위 과목에서 과목을 선택해 주세요.');
        return false;
      }
      if (!date) {
        alert('평가일정(일자)를 입력해 주세요.');
        return false;
      }

      const newRow = {
        subject: subjectLabel || '-',
        curriculum_id: curriculumId,
        date: date,
        time: time,
        place: place,
        instructor_id: instructorId,
        instructor_name: instructorName
      };
      const rows = readScheduleRowsFromTable();
      if (schedulePendingEditIndex !== null && Number.isFinite(schedulePendingEditIndex)) {
        var editAt = Math.max(0, Math.min(schedulePendingEditIndex, rows.length - 1));
        var prevRow = (rows.length > 0 && editAt >= 0 && editAt < rows.length) ? rows[editAt] : null;
        var newId = String(newRow.instructor_id || '').trim();
        var newName = String(newRow.instructor_name || '').trim();
        if (!newId && !newName && prevRow) {
          newRow.instructor_id = String(prevRow.instructor_id || '').trim();
          newRow.instructor_name = String(prevRow.instructor_name || '').trim();
        }
        if (rows.length > 0 && editAt >= 0 && editAt < rows.length) {
          rows[editAt] = newRow;
        } else {
          rows.push(newRow);
        }
        schedulePendingEditIndex = null;
      } else {
        rows.push(newRow);
      }
      renderScheduleRows(rows);
      clearScheduleInputRow();
      updateScheduleAddButtonLabel();
      alert('일정 추가완료');
      return true;
    }

    function readQuestionRowsFromTable() {
      const body = document.getElementById('questionsRowsBody');
      if (!body) return [];
      const rows = [];
      body.querySelectorAll('tr[data-question-row]').forEach(function(tr) {
        rows.push({
          subject: tr.getAttribute('data-subject') || '',
          curriculum_id: tr.getAttribute('data-curriculum-id') || '',
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
      const safeRows = (Array.isArray(rows) ? rows : []).slice().sort(function(a, b) {
        var sa = String(a?.subject || '');
        var sb = String(b?.subject || '');
        if (sa !== sb) return sa.localeCompare(sb);
        return Number(a?.no || 0) - Number(b?.no || 0);
      });
      if (!safeRows.length) {
        body.innerHTML = '<tr><td colspan="7" class="px-4 py-8 text-center text-sm text-slate-400">등록된 문항이 없습니다.</td></tr>';
        updateQuestionTotalScore([]);
        return;
      }
      body.innerHTML = safeRows.map(function(row, idx) {
        const subject = String(row?.subject || '');
        const cid = String(row?.curriculum_id || '');
        const no = Number(row?.no || 0);
        const type = String(row?.type || '');
        const text = String(row?.text || '');
        const score = Number(row?.score || 0);
        const keyword = String(row?.keyword || '');
        return '<tr data-question-row data-subject="' + escapeHtml(subject) + '" data-curriculum-id="' + escapeHtml(cid) + '" data-no="' + no + '" data-type="' + escapeHtml(type) + '" data-text="' + escapeHtml(text) + '" data-score="' + score + '" data-keyword="' + escapeHtml(keyword) + '">' +
          '<td class="px-4 py-3 text-sm font-semibold text-slate-800">' + escapeHtml(subject || '-') + '</td>' +
          '<td class="px-4 py-3 text-sm font-semibold text-slate-700">' + (no || (idx + 1)) + '</td>' +
          '<td class="px-4 py-3 text-sm text-slate-700">' + escapeHtml(type || '-') + '</td>' +
          '<td class="px-4 py-3 text-sm text-slate-700"><div class="max-w-[520px]">' + questionContentToDisplayHtml(text) + '</div></td>' +
          '<td class="px-4 py-3 text-sm text-center font-semibold text-slate-800">' + score + '</td>' +
          '<td class="px-4 py-3 text-sm text-slate-700">' + escapeHtml(keyword || '-') + '</td>' +
          '<td class="px-4 py-3 text-center space-x-1">' +
            '<button type="button" data-preview-question-row="' + idx + '" class="px-2.5 py-1.5 rounded-lg border border-sky-200 bg-sky-50 text-sky-700 text-xs font-black hover:bg-sky-100 transition">미리보기</button>' +
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
      const target = Number(getQuestionsFieldValue('questions_total_target') || 0);
      label.textContent = total + '점' + (target > 0 ? (' / 목표 ' + target + '점') : '');
      label.classList.toggle('text-rose-600', target > 0 && total > target);
      label.classList.toggle('text-slate-900', !(target > 0 && total > target));
    }

    function applyQuestionTypeSelectValue(typeRaw) {
      var el = document.getElementById('questionInputType');
      if (!el || String(el.tagName).toUpperCase() !== 'SELECT') return;
      var t = String(typeRaw || '').trim();
      if (!t) t = NCS_QUESTION_TYPE_DEFAULT;
      var has = false;
      for (var i = 0; i < el.options.length; i++) {
        if (String(el.options[i].value) === t) { has = true; break; }
      }
      if (!has) {
        var opt = document.createElement('option');
        opt.value = t;
        opt.textContent = t;
        el.appendChild(opt);
      }
      el.value = t;
      if (el.value !== t) el.value = NCS_QUESTION_TYPE_DEFAULT;
    }

    function addQuestionFromInputs() {
      var qSubEl = document.getElementById('questionsSubjectSelect');
      var subjectLabel = getNcsSubjectSelectText('questionsSubjectSelect');
      var curriculumId = qSubEl && qSubEl.value ? String(qSubEl.value).trim() : '';
      const noEl = document.getElementById('questionInputNo');
      const typeEl = document.getElementById('questionInputType');
      const scoreEl = document.getElementById('questionInputScore');
      const keywordEl = document.getElementById('questionInputKeyword');
      const noVal = Number((noEl?.value || '').trim());
      const typeVal = (typeEl?.value || '').trim();
      const textVal = getQuestionInputValue();
      const scoreVal = Number((scoreEl?.value || '').trim() || 0);
      const keywordVal = (keywordEl?.value || '').trim();

      if (!questionInputHasContent()) {
        alert('문항 내용을 입력해 주세요.');
        return;
      }
      if (!subjectLabel || !curriculumId) {
        alert('교과목을 선택해 주세요.');
        return;
      }
      if (!Number.isFinite(noVal) || noVal < 1) {
        alert('문항번호를 입력해 주세요.');
        return;
      }

      const rows = readQuestionRowsFromTable();
      const duplicated = rows.findIndex(function(r) { return String(r.curriculum_id || '') === curriculumId && Number(r.no) === noVal; });
      if (duplicated >= 0) {
        rows[duplicated] = { subject: subjectLabel, curriculum_id: curriculumId, no: noVal, type: typeVal || NCS_QUESTION_TYPE_DEFAULT, text: textVal, score: scoreVal, keyword: keywordVal };
      } else {
        rows.push({ subject: subjectLabel, curriculum_id: curriculumId, no: noVal, type: typeVal || NCS_QUESTION_TYPE_DEFAULT, text: textVal, score: scoreVal, keyword: keywordVal });
      }
      renderQuestionRows(rows);

      if (noEl) noEl.value = '';
      setQuestionInputValue('');
      if (scoreEl) scoreEl.value = '';
      if (keywordEl) keywordEl.value = '';
    }

    function readToolRowsFromTable() {
      const body = document.getElementById('toolsRowsBody');
      if (!body) return [];
      const rows = [];
      body.querySelectorAll('tr[data-tool-row]').forEach(function(tr) {
        var nameCell = tr.querySelector('[data-tool-cell="name"]');
        var typeCell = tr.querySelector('[data-tool-cell="type"]');
        var materialsCell = tr.querySelector('[data-tool-cell="materials"]');
        var durationCell = tr.querySelector('[data-tool-cell="duration"]');
        var scoreCell = tr.querySelector('[data-tool-cell="score"]');
        var nameText = nameCell ? String(nameCell.textContent || '').trim() : (tr.getAttribute('data-name') || '');
        var typeText = typeCell ? String(typeCell.textContent || '').trim() : (tr.getAttribute('data-type') || '');
        var materialsText = materialsCell ? String(materialsCell.textContent || '').trim() : (tr.getAttribute('data-materials') || '');
        var durationText = durationCell ? String(durationCell.textContent || '').trim() : (tr.getAttribute('data-duration') || '');
        var scoreText = scoreCell ? String(scoreCell.textContent || '').trim() : (tr.getAttribute('data-score') || '0');
        var scoreNum = Number(scoreText || 0);
        rows.push({
          name: nameText,
          type: typeText,
          materials: materialsText,
          duration: durationText,
          score: Number.isFinite(scoreNum) ? scoreNum : 0
        });
      });
      return rows;
    }

    function renderToolRows(rows) {
      const body = document.getElementById('toolsRowsBody');
      if (!body) return;
      const safeRows = Array.isArray(rows) ? rows : [];
      if (!safeRows.length) {
        body.innerHTML = '<tr><td colspan="5" class="px-4 py-8 text-center text-sm text-slate-400">등록된 도구 항목이 없습니다.</td></tr>';
        updateToolsTotalScore([]);
        return;
      }
      body.innerHTML = safeRows.map(function(row) {
        const name = String(row?.name || '');
        const type = String(row?.type || '');
        const materials = String(row?.materials || '');
        const duration = String(row?.duration || '');
        const score = Number(row?.score || 0);
        return '<tr data-tool-row data-name="' + escapeHtml(name) + '" data-type="' + escapeHtml(type) + '" data-materials="' + escapeHtml(materials) + '" data-duration="' + escapeHtml(duration) + '" data-score="' + score + '">' +
          '<td class="px-4 py-3 text-sm font-semibold text-slate-700 align-top"><div data-tool-cell="name" contenteditable="true" class="min-h-[2.2rem] whitespace-pre-wrap focus:outline-none focus:ring-2 focus:ring-sky-200 rounded px-1">' + escapeHtml(name) + '</div></td>' +
          '<td class="px-4 py-3 text-sm text-slate-700 align-top"><div data-tool-cell="type" contenteditable="true" class="min-h-[2.2rem] whitespace-pre-wrap focus:outline-none focus:ring-2 focus:ring-sky-200 rounded px-1">' + escapeHtml(type) + '</div></td>' +
          '<td class="px-4 py-3 text-sm text-slate-700 align-top"><div data-tool-cell="materials" contenteditable="true" class="min-h-[2.2rem] whitespace-pre-wrap focus:outline-none focus:ring-2 focus:ring-sky-200 rounded px-1">' + escapeHtml(materials) + '</div></td>' +
          '<td class="px-4 py-3 text-sm text-slate-700 text-center align-top"><div data-tool-cell="duration" contenteditable="true" class="min-h-[2.2rem] whitespace-pre-wrap focus:outline-none focus:ring-2 focus:ring-sky-200 rounded px-1">' + escapeHtml(duration) + '</div></td>' +
          '<td class="px-4 py-3 text-sm text-slate-800 text-center font-semibold align-top"><div data-tool-cell="score" contenteditable="true" class="min-h-[2.2rem] whitespace-pre-wrap focus:outline-none focus:ring-2 focus:ring-sky-200 rounded px-1">' + escapeHtml(String(score)) + '</div></td>' +
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

    function syncToolsSubjectDisplay() {
      var el = document.getElementById('tools_display_subject');
      if (!el) return;
      var txt = getNcsSubjectSelectText('toolsSubjectSelect');
      el.textContent = txt || '-';
    }

    function updateToolsLoadButtonState() {
      var btn = document.getElementById('toolsLoadNcsCriteriaBtn');
      var sel = document.getElementById('toolsSubjectSelect');
      if (!btn || !sel) return;
      var ok = !!(selectedCourseId && String(sel.value || '').trim() && !sel.disabled);
      btn.disabled = !ok;
    }

    function wireToolsCriteriaEditDelegation() {
      if (toolsCriteriaInputBound) return;
      toolsCriteriaInputBound = true;
      document.addEventListener('input', function(ev) {
        var t = ev.target;
        if (!t || !t.classList || !t.classList.contains('data-tools-crit-text')) return;
        var g = parseInt(t.getAttribute('data-g') || '-1', 10);
        var ln = parseInt(t.getAttribute('data-ln') || '-1', 10);
        if (!Number.isFinite(g) || g < 0 || !toolsCriteriaGroupsState[g] || !toolsCriteriaGroupsState[g].lines) return;
        if (!Number.isFinite(ln) || ln < 0 || !toolsCriteriaGroupsState[g].lines[ln]) return;
        toolsCriteriaGroupsState[g].lines[ln].text = String(t.textContent || '').trim();
      });
      document.addEventListener('blur', function(ev) {
        var t = ev.target;
        if (!t || !t.getAttribute || t.getAttribute('data-role') !== 'element-title') return;
        var g = parseInt(t.getAttribute('data-g') || '-1', 10);
        if (!Number.isFinite(g) || g < 0 || !toolsCriteriaGroupsState[g]) return;
        toolsCriteriaGroupsState[g].element_title = String(t.textContent || '').trim() || '-';
      }, true);
    }

    function renderToolsCriteriaBody(groups) {
      wireToolsCriteriaEditDelegation();
      toolsCriteriaGroupsState = Array.isArray(groups) ? JSON.parse(JSON.stringify(groups)) : [];
      var tbody = document.getElementById('toolsCriteriaBody');
      if (!tbody) return;
      if (!toolsCriteriaGroupsState.length) {
        tbody.innerHTML = '<tr><td colspan="3" class="border border-black px-3 py-8 text-center text-sm text-slate-400">교과목을 선택한 뒤 「NCS 평가준거 불러오기」를 눌러 평가내용을 채웁니다.</td></tr>';
        return;
      }
      var html = '';
      for (var g = 0; g < toolsCriteriaGroupsState.length; g++) {
        var grp = toolsCriteriaGroupsState[g];
        var lines = Array.isArray(grp.lines) ? grp.lines : [];
        var rs = lines.length;
        if (rs < 1) continue;
        var title = String(grp.element_title || '-').trim();
        for (var ln = 0; ln < lines.length; ln++) {
          var line = lines[ln] || {};
          var isFirst = ln === 0;
          html += '<tr>';
          if (isFirst) {
            html += '<td rowspan="' + rs + '" class="border border-black px-2 py-2 align-top text-sm font-semibold text-slate-900 whitespace-pre-wrap outline-none focus:ring-2 focus:ring-indigo-200 rounded" data-role="element-title" data-g="' + g + '" contenteditable="true" title="능력단위 요소명(직접 수정 가능)">' + escapeHtml(title) + '</td>';
          }
          html += '<td class="border border-black px-2 py-2 align-top text-sm text-slate-800">';
          html += '<span class="text-slate-500 font-mono text-[11px] mr-1">' + escapeHtml(String(line.label || '')) + '</span>';
          html += '<span class="data-tools-crit-text inline-block min-w-[180px] outline-none align-top" contenteditable="true" data-g="' + g + '" data-ln="' + ln + '">' + escapeHtml(String(line.text || '')) + '</span>';
          html += '</td>';
          html += '<td class="border border-black px-1 py-1 align-middle w-24 text-center bg-white"><div class="h-12 min-h-[3rem] border border-black bg-white mx-auto max-w-[5.5rem] rounded-sm" title="성취수준 기입"></div></td>';
          html += '</tr>';
        }
      }
      if (!html) {
        tbody.innerHTML = '<tr><td colspan="3" class="border border-black px-3 py-8 text-center text-sm text-slate-400">불러온 평가준거가 없습니다. NCS 능력단위·요소 데이터를 확인해 주세요.</td></tr>';
        return;
      }
      tbody.innerHTML = html;
    }

    async function loadNcsCriteriaIntoToolsForm() {
      var cid = getNcsSubjectSelectCurriculumValue('toolsSubjectSelect');
      var courseId = selectedCourseId || (useFixedCourseId ? fixedCourseId : '');
      if (!cid || !courseId) {
        alert('과정과 교과목(커리큘럼)을 선택해 주세요.');
        return;
      }
      try {
        var roundQ = (typeof selectedRound === 'number' && selectedRound >= 1 && selectedRound <= 3) ? selectedRound : 1;
        var res = await authFetch('/api/ncs/approved/curriculum/' + encodeURIComponent(cid) + '/evaluation-tool-form?course_id=' + encodeURIComponent(String(courseId)) + '&evaluation_round=' + encodeURIComponent(String(roundQ)));
        var json = await res.json();
        if (!json || !json.success) {
          alert((json && json.error) ? String(json.error) : '불러오기에 실패했습니다.');
          return;
        }
        var d = json.data || {};
        setToolsFieldValue('tools_display_course', d.course_title || '');
        syncToolsSubjectDisplay();
        setToolsFieldValue('tools_unit_name_level', d.unit_name_level || '');
        var groups = Array.isArray(d.criteria_groups) ? d.criteria_groups : [];
        if (groups.length && groups[0] && groups[0].element_title) {
          setToolsFieldValue('tools_element_focus', '- ' + String(groups[0].element_title));
        } else {
          setToolsFieldValue('tools_element_focus', '');
        }
        renderToolsCriteriaBody(groups);
      } catch (e) {
        console.error(e);
        alert('NCS 평가준거를 불러오지 못했습니다.');
      }
    }

    function defaultToolRows() {
      return [
        { name: '평가도구 1', type: '실습평가', materials: '', duration: '', score: 20 },
        { name: '평가도구 2', type: '실습평가', materials: '', duration: '', score: 20 },
        { name: '평가도구 3', type: '실습평가', materials: '', duration: '', score: 20 },
        { name: '평가도구 4', type: '실습평가', materials: '', duration: '', score: 20 },
        { name: '평가도구 5', type: '실습평가', materials: '', duration: '', score: 20 }
      ];
    }

    function normalizeToolRows(rows) {
      const list = Array.isArray(rows) ? rows : [];
      if (!list.length) return defaultToolRows();
      return list.map(function(row, idx) {
        const score = Number(row?.score ?? 0);
        return {
          name: String(row?.name ?? ('평가도구 ' + (idx + 1))),
          type: String(row?.type ?? '실습평가'),
          materials: String(row?.materials ?? ''),
          duration: String(row?.duration ?? ''),
          score: Number.isFinite(score) ? score : 0
        };
      });
    }

    function readRubricRowsFromTable() {
      const body = document.getElementById('rubricRowsBody');
      if (!body) return [];
      const rows = [];
      body.querySelectorAll('tr[data-rubric-row]').forEach(function(tr) {
        var itemCell = tr.querySelector('[data-rubric-cell="item"]');
        var scoreCell = tr.querySelector('[data-rubric-cell="score"]');
        var highCell = tr.querySelector('[data-rubric-cell="high"]');
        var midCell = tr.querySelector('[data-rubric-cell="mid"]');
        var lowCell = tr.querySelector('[data-rubric-cell="low"]');
        var itemText = itemCell ? String(itemCell.textContent || '').trim() : (tr.getAttribute('data-item') || '');
        var scoreText = scoreCell ? String(scoreCell.textContent || '').trim() : (tr.getAttribute('data-score') || '0');
        var highText = highCell ? String(highCell.textContent || '').trim() : (tr.getAttribute('data-high') || '');
        var midText = midCell ? String(midCell.textContent || '').trim() : (tr.getAttribute('data-mid') || '');
        var lowText = lowCell ? String(lowCell.textContent || '').trim() : (tr.getAttribute('data-low') || '');
        var scoreNum = Number(scoreText || 0);
        rows.push({
          item: itemText,
          score: Number.isFinite(scoreNum) ? scoreNum : 0,
          high: highText,
          mid: midText,
          low: lowText
        });
      });
      return rows;
    }

    function renderRubricRows(rows) {
      const body = document.getElementById('rubricRowsBody');
      if (!body) return;
      const safeRows = Array.isArray(rows) ? rows : [];
      if (!safeRows.length) {
        body.innerHTML = '<tr><td colspan="4" class="border border-black px-4 py-8 text-center text-sm text-slate-400">등록된 채점기준이 없습니다.</td></tr>';
        updateRubricTotalScore([]);
        return;
      }
      body.innerHTML = safeRows.map(function(row) {
        const item = String(row?.item || '');
        const score = Number(row?.score || 0);
        const high = String(row?.high || '');
        const mid = String(row?.mid || '');
        const low = String(row?.low || '');
        return '<tr data-rubric-row data-item="' + escapeHtml(item) + '" data-score="' + score + '" data-high="' + escapeHtml(high) + '" data-mid="' + escapeHtml(mid) + '" data-low="' + escapeHtml(low) + '">' +
          '<td class="border border-black px-2 py-1 align-top" rowspan="4"><div data-rubric-cell="item" contenteditable="true" class="min-h-[6.4rem] whitespace-pre-wrap focus:outline-none focus:ring-2 focus:ring-sky-200 rounded px-1">' + escapeHtml(item) + '</div></td>' +
          '<td class="border border-black px-2 py-1 text-[12px] align-top"><div class="min-h-[1.6rem] whitespace-pre-wrap">성취기준 설명</div><div data-rubric-cell="score" contenteditable="true" class="hidden">' + escapeHtml(String(score)) + '</div></td>' +
          '<td class="border border-black px-2 py-1 text-center font-bold">우수</td>' +
          '<td class="border border-black px-2 py-1 align-top"><div data-rubric-cell="high" contenteditable="true" class="min-h-[1.6rem] whitespace-pre-wrap focus:outline-none focus:ring-2 focus:ring-sky-200 rounded px-1">' + escapeHtml(high) + '</div></td>' +
        '</tr>' +
        '<tr>' +
          '<td class="border border-black px-2 py-1 text-[12px] text-slate-600">보통</td>' +
          '<td class="border border-black px-2 py-1 text-center font-bold">보통</td>' +
          '<td class="border border-black px-2 py-1 align-top"><div data-rubric-cell="mid" contenteditable="true" class="min-h-[1.6rem] whitespace-pre-wrap focus:outline-none focus:ring-2 focus:ring-sky-200 rounded px-1">' + escapeHtml(mid) + '</div></td>' +
        '</tr>' +
        '<tr>' +
          '<td class="border border-black px-2 py-1 text-[12px] text-slate-600">미흡</td>' +
          '<td class="border border-black px-2 py-1 text-center font-bold">미흡</td>' +
          '<td class="border border-black px-2 py-1 align-top"><div data-rubric-cell="low" contenteditable="true" class="min-h-[1.6rem] whitespace-pre-wrap focus:outline-none focus:ring-2 focus:ring-sky-200 rounded px-1">' + escapeHtml(low) + '</div></td>' +
        '</tr>' +
        '<tr>' +
          '<td class="border border-black px-2 py-1 text-[12px] text-slate-600" colspan="3">필요 시 성취기준을 직접 수정해 사용하세요.</td>' +
        '</tr>';
      }).join('');
      updateRubricTotalScore(safeRows);
    }

    function updateRubricTotalScore(rows) {
      const label = document.getElementById('rubricTotalScoreLabel');
      if (!label) return;
      const total = (Array.isArray(rows) ? rows : []).reduce(function(acc, row) { return acc + Number(row?.score || 0); }, 0);
      const target = Number(getRubricFieldValue('rubric_total_target') || 0);
      label.textContent = total + '점' + (target > 0 ? (' / 기준 ' + target + '점') : '');
      label.classList.toggle('text-rose-600', target > 0 && total > target);
      label.classList.toggle('text-slate-900', !(target > 0 && total > target));
    }

    function defaultRubricRows() {
      return [
        { item: '2.1 신조형 3D프린터에서 지원하는 적층 장비별 파라미터를 설명할 수 있다.', score: 0, high: '성취기준 등록', mid: '성취기준 등록', low: '성취기준 등록' },
        { item: '2.2 파악된 적층 값의 범위 내에서 적용 값을 결정할 수 있다.', score: 0, high: '성취기준 등록', mid: '성취기준 등록', low: '성취기준 등록' },
        { item: '2.3 결정된 적층 값을 운영하여 제품을 슬라이싱 할 수 있다.', score: 0, high: '성취기준 등록', mid: '성취기준 등록', low: '성취기준 등록' }
      ];
    }

    function normalizeRubricRows(rows) {
      const list = Array.isArray(rows) ? rows : [];
      if (!list.length) return defaultRubricRows();
      return list.map(function(row, idx) {
        const score = Number(row?.score ?? 0);
        return {
          item: String(row?.item ?? ('평가항목 ' + (idx + 1))),
          score: Number.isFinite(score) ? score : 0,
          high: String(row?.high ?? ''),
          mid: String(row?.mid ?? ''),
          low: String(row?.low ?? '')
        };
      });
    }

    function readAchievementRowsFromTable() {
      const body = document.getElementById('achievementRowsBody');
      if (!body) return [];
      const rows = [];
      body.querySelectorAll('tr[data-achievement-row]').forEach(function(tr) {
        var levelCell = tr.querySelector('[data-achievement-cell="level"]');
        var criteriaCell = tr.querySelector('[data-achievement-cell="criteria"]');
        var scoreCell = tr.querySelector('[data-achievement-cell="score_distribution"]');
        var failCell = tr.querySelector('[data-achievement-cell="fail"]');
        var levelText = levelCell ? String(levelCell.textContent || '').trim() : (tr.getAttribute('data-level') || '');
        var criteriaText = criteriaCell ? String(criteriaCell.textContent || '').trim() : (tr.getAttribute('data-criteria') || '');
        var scoreText = scoreCell ? String(scoreCell.textContent || '').trim() : (tr.getAttribute('data-score-distribution') || '');
        var failText = failCell ? String(failCell.textContent || '').trim() : (tr.getAttribute('data-fail') || '');
        var scoreNum = Number(scoreText || 0);
        rows.push({
          level: levelText,
          criteria: criteriaText,
          score_distribution: Number.isFinite(scoreNum) ? scoreNum : 0,
          fail: failText,
          min_score: 0,
          max_score: Number.isFinite(scoreNum) ? scoreNum : 0,
          rate: 0
        });
      });
      return rows;
    }

    function updateAchievementRateSum(rows) {
      const label = document.getElementById('achievementRateSumLabel');
      if (!label) return;
      const sum = (Array.isArray(rows) ? rows : []).reduce(function(acc, row) {
        return acc + Number(row?.score_distribution ?? row?.max_score ?? 0);
      }, 0);
      label.textContent = sum + '점';
      label.classList.toggle('text-slate-900', true);
      label.classList.remove('text-rose-600');
      label.classList.remove('text-emerald-700');
    }

    function renderAchievementRows(rows) {
      const body = document.getElementById('achievementRowsBody');
      if (!body) return;
      const safeRows = Array.isArray(rows) ? rows : [];
      if (!safeRows.length) {
        body.innerHTML = '<tr><td colspan="4" class="border border-black px-4 py-8 text-center text-sm text-slate-400">등록된 성취수준이 없습니다.</td></tr>';
        updateAchievementRateSum([]);
        return;
      }
      body.innerHTML = safeRows.map(function(row) {
        const level = String(row?.level || '');
        const criteria = String(row?.criteria || '');
        const score = Number(row?.score_distribution ?? row?.max_score ?? 0);
        const fail = String(row?.fail || '');
        return '<tr data-achievement-row data-level="' + escapeHtml(level) + '" data-criteria="' + escapeHtml(criteria) + '" data-score-distribution="' + escapeHtml(String(score)) + '" data-fail="' + escapeHtml(fail) + '">' +
          '<td class="border border-black px-2 py-1 text-sm text-center font-semibold text-slate-700 align-top"><div data-achievement-cell="level" contenteditable="true" class="min-h-[1.6rem] whitespace-pre-wrap focus:outline-none focus:ring-2 focus:ring-sky-200 rounded px-1">' + escapeHtml(level) + '</div></td>' +
          '<td class="border border-black px-2 py-1 text-sm text-slate-700 align-top"><div data-achievement-cell="criteria" contenteditable="true" class="min-h-[1.6rem] whitespace-pre-wrap focus:outline-none focus:ring-2 focus:ring-sky-200 rounded px-1">' + escapeHtml(criteria) + '</div></td>' +
          '<td class="border border-black px-2 py-1 text-sm text-center font-semibold text-slate-800 align-top"><div data-achievement-cell="score_distribution" contenteditable="true" class="min-h-[1.6rem] whitespace-pre-wrap focus:outline-none focus:ring-2 focus:ring-sky-200 rounded px-1">' + escapeHtml(String(score)) + '</div></td>' +
          '<td class="border border-black px-2 py-1 text-sm text-center text-slate-700 align-top"><div data-achievement-cell="fail" contenteditable="true" class="min-h-[1.6rem] whitespace-pre-wrap focus:outline-none focus:ring-2 focus:ring-sky-200 rounded px-1">' + escapeHtml(fail) + '</div></td>' +
        '</tr>';
      }).join('');
      updateAchievementRateSum(safeRows);
    }

    function defaultAchievementRows() {
      return [
        { level: '5', criteria: '해당 지식과 기술을 확실하게 습득하여 직무수행에 필요한 기술적 사고력과 문제 해결력을 토대로 주도적으로 완벽한 작업을 수행할 수 있다.', score_distribution: 100, fail: '', min_score: 0, max_score: 100, rate: 0 },
        { level: '4', criteria: '해당 지식과 기술을 확실하게 습득하여 직무수행에 필요한 기술적 사고력과 문제 해결력을 토대로 작업을 수행할 수 있다.', score_distribution: 90, fail: '', min_score: 0, max_score: 90, rate: 0 },
        { level: '3', criteria: '해당 지식과 기술을 대부분 습득하여 직무수행에 필요한 지식과 기술을 가지고 대부분의 작업을 수행할 수 있다.', score_distribution: 80, fail: '', min_score: 0, max_score: 80, rate: 0 },
        { level: '2', criteria: '해당 지식과 기술을 부분적으로 습득하여 직무수행에 필요한 지식과 기술을 가지고 타인과 공동으로 작업을 수행할 수 있다.', score_distribution: 70, fail: '', min_score: 0, max_score: 70, rate: 0 },
        { level: '1', criteria: '해당 지식과 기술을 습득하는데 부족함이 있어 타인의 도움을 받아야만 작업을 수행할 수 있다.', score_distribution: 59, fail: 'fail', min_score: 0, max_score: 59, rate: 0 }
      ];
    }

    function normalizeAchievementRows(rows) {
      const list = Array.isArray(rows) ? rows : [];
      if (!list.length) return defaultAchievementRows();
      return list.map(function(row, idx) {
        const score = Number(row?.score_distribution ?? row?.max_score ?? row?.rate ?? 0);
        return {
          level: String(row?.level ?? (idx + 1)),
          criteria: String(row?.criteria ?? ''),
          score_distribution: Number.isFinite(score) ? score : 0,
          fail: String(row?.fail ?? ''),
          min_score: 0,
          max_score: Number.isFinite(score) ? score : 0,
          rate: 0
        };
      });
    }

    function defaultReviewRows() {
      return [
        { item: '훈련 목표 반영도', comment: '', adequate: false, needs_revision: false },
        { item: '수행 능력의 평가', comment: '', adequate: false, needs_revision: false },
        { item: '평가항목의 공정성', comment: '', adequate: false, needs_revision: false },
        { item: '교과내용과의 관련성', comment: '', adequate: false, needs_revision: false },
        { item: '학습자의 참여유도 정도', comment: '', adequate: false, needs_revision: false },
        { item: '과제의 실행 가능성', comment: '', adequate: false, needs_revision: false },
        { item: '산업안전(실기교과)', comment: '', adequate: false, needs_revision: false },
        { item: '기타의견', comment: '', adequate: false, needs_revision: false }
      ];
    }

    function normalizeReviewRows(rows) {
      const list = Array.isArray(rows) ? rows : [];
      if (!list.length) return defaultReviewRows();
      return list.map(function(row, idx) {
        return {
          item: String(row && row.item != null ? row.item : ('검토항목 ' + (idx + 1))),
          comment: String(row && row.comment != null ? row.comment : ''),
          adequate: !!(row && (row.adequate || row.done)),
          needs_revision: !!(row && row.needs_revision)
        };
      });
    }

    function readReviewRowsFromTable() {
      const body = document.getElementById('reviewRowsBody');
      if (!body) return [];
      const rows = [];
      body.querySelectorAll('tr[data-review-row]').forEach(function(tr) {
        var itemCell = tr.querySelector('[data-review-cell="item"]');
        var commentCell = tr.querySelector('[data-review-cell="comment"]');
        var okInput = tr.querySelector('input[data-review-check="adequate"]');
        var fixInput = tr.querySelector('input[data-review-check="needs_revision"]');
        var itemText = itemCell ? String(itemCell.textContent || '').trim() : (tr.getAttribute('data-item') || '');
        var commentText = commentCell ? String(commentCell.textContent || '').trim() : (tr.getAttribute('data-comment') || '');
        rows.push({
          item: itemText,
          comment: commentText,
          adequate: !!(okInput && okInput.checked),
          needs_revision: !!(fixInput && fixInput.checked)
        });
      });
      return rows;
    }

    function updateReviewCompletion(rows) {
      const label = document.getElementById('reviewCompletionLabel');
      if (!label) return;
      const total = Array.isArray(rows) ? rows.length : 0;
      const judged = (Array.isArray(rows) ? rows : []).filter(function(r) { return !!(r?.adequate || r?.needs_revision); }).length;
      const rate = total > 0 ? Math.round((judged / total) * 100) : 0;
      label.textContent = rate + '% (' + judged + '/' + total + ')';
      label.classList.toggle('text-emerald-700', rate === 100 && total > 0);
      label.classList.toggle('text-slate-900', !(rate === 100 && total > 0));
    }

    function renderReviewRows(rows) {
      const body = document.getElementById('reviewRowsBody');
      if (!body) return;
      const safeRows = Array.isArray(rows) ? rows : [];
      if (!safeRows.length) {
        body.innerHTML = '<tr><td colspan="4" class="border border-black px-4 py-8 text-center text-sm text-slate-400">등록된 검토항목이 없습니다.</td></tr>';
        updateReviewCompletion([]);
        return;
      }
      body.innerHTML = safeRows.map(function(row, idx) {
        const item = String(row?.item || '');
        const comment = String(row?.comment || '');
        const adequate = !!row?.adequate;
        const needsRevision = !!row?.needs_revision;
        return '<tr data-review-row data-item="' + escapeHtml(item) + '" data-comment="' + escapeHtml(comment) + '">' +
          '<td class="border border-black px-2 py-1 text-sm font-semibold text-slate-700 align-top"><div data-review-cell="item" contenteditable="true" class="min-h-[1.8rem] whitespace-pre-wrap focus:outline-none focus:ring-2 focus:ring-sky-200 rounded px-1">' + escapeHtml(item) + '</div></td>' +
          '<td class="border border-black px-2 py-1 text-sm text-slate-700 align-top"><div data-review-cell="comment" contenteditable="true" class="min-h-[1.8rem] whitespace-pre-wrap focus:outline-none focus:ring-2 focus:ring-sky-200 rounded px-1">' + escapeHtml(comment) + '</div></td>' +
          '<td class="border border-black px-2 py-1 text-center align-top"><input type="checkbox" data-review-check="adequate" data-review-index="' + idx + '" ' + (adequate ? 'checked' : '') + ' /></td>' +
          '<td class="border border-black px-2 py-1 text-center align-top"><input type="checkbox" data-review-check="needs_revision" data-review-index="' + idx + '" ' + (needsRevision ? 'checked' : '') + ' /></td>' +
        '</tr>';
      }).join('');
      updateReviewCompletion(safeRows);
    }

    function applyDocForm(tabId, data) {
      const payload = data && data.payload ? data.payload : {};
      if (tabId === 'minutes') {
        setMinutesFieldValue('minutes_doc_title', data?.title || '');
        setMinutesFieldValue('minutes_session', payload.opening_session || '');
        setMinutesFieldValue('minutes_meeting_date', payload.meeting_date || '');
        setMinutesFieldValue('minutes_meeting_location', payload.meeting_location || '');
        setMinutesFieldValue('minutes_chairperson', payload.chairperson || '');
        setMinutesFieldValue('minutes_writer', payload.writer || '');
        setMinutesFieldValue('minutes_reviewer', payload.reviewer || '');
        setMinutesFieldValue('minutes_approval_role_chair', payload.approval_role_chair || '담당');
        setMinutesFieldValue('minutes_approval_role_writer', payload.approval_role_writer || '팀장');
        setMinutesFieldValue('minutes_approval_role_reviewer', payload.approval_role_reviewer || '원장');
        setMinutesFieldValue('minutes_attendees', payload.attendees || '');
        setMinutesFieldValue('minutes_agenda', payload.agenda || '');
        setMinutesFieldValue('minutes_content', payload.content || '');
        setMinutesFieldValue('minutes_notes', payload.notes || '');
        renderMinutesAttachments(payload.attachments || []);
        renderMinutesSignatures(payload.signatures || {});
        return;
      }
      if (tabId === 'schedule') {
        const titleEl = document.getElementById('schedule_doc_title');
        const writerEl = document.getElementById('schedule_writer');
        const notesEl = document.getElementById('schedule_notes');
        if (titleEl) titleEl.value = data?.title || '';
        if (!String((titleEl && titleEl.value) || '').trim()) applyScheduleDocTitleAuto();
        if (writerEl) writerEl.value = payload.writer || '';
        if (notesEl) notesEl.value = payload.notes || '';
        schedulePendingEditIndex = null;
        updateScheduleAddButtonLabel();
        renderScheduleRows(normalizeSchedulePayloadRows(payload.rows || []));
        void applyScheduleSessionSubjectFromPayload(payload || {});
        return;
      }
      if (tabId === 'questions') {
        setQuestionsFieldValue('questions_doc_title', data?.title || '');
        setQuestionsFieldValue('questions_writer', payload.writer || '');
        setQuestionsFieldValue('questions_total_target', payload.total_target || '');
        setQuestionsFieldValue('questions_notes', payload.notes || '');
        renderQuestionsAttachments(payload.attachments || []);
        renderQuestionRows(payload.rows || []);
        void (async function() {
          var cid = selectedCourseId || (useFixedCourseId ? fixedCourseId : '');
          if (!cid) {
            resetAllNcsPlanSubjectSelects();
            return;
          }
          await loadNcsPlanSubjectOptions(cid, payload.session_id || selectedSessionIdForSubject || '', { preserveSelection: true });
          applyNcsSubjectSelectValue('questionsSubjectSelect', payload.curriculum_id, payload.subject_name);
        })();
        return;
      }
      if (tabId === 'tools') {
        setToolsFieldValue('tools_doc_title', data?.title || '');
        setToolsFieldValue('tools_writer', payload.writer || '');
        setToolsFieldValue('tools_target_time', payload.target_time || '');
        setToolsFieldValue('tools_notes', payload.notes || '');
        setToolsFieldValue('tools_eval_datetime', payload.tools_eval_datetime || '');
        setToolsFieldValue('tools_trainee', payload.tools_trainee || '');
        setToolsFieldValue('tools_instructor', payload.tools_instructor || '');
        setToolsFieldValue('tools_unit_name_level', payload.tools_unit_name_level || '');
        setToolsFieldValue('tools_element_focus', payload.tools_element_focus || '');
        setToolsFieldValue('tools_eval_duration', payload.tools_eval_duration || '');
        setToolsFieldValue('tools_display_course', payload.tools_display_course || '');
        var ach = String(payload.tools_achievement_note || '').trim();
        setToolsFieldValue('tools_achievement_note', ach || TOOLS_ACHIEVEMENT_DEFAULT);
        renderToolsAttachments(payload.attachments || []);
        var crit = payload.criteria_groups;
        if (Array.isArray(crit) && crit.length) {
          toolsCriteriaGroupsState = JSON.parse(JSON.stringify(crit));
          renderToolsCriteriaBody(toolsCriteriaGroupsState);
        } else {
          toolsCriteriaGroupsState = [];
          renderToolsCriteriaBody([]);
          if (Array.isArray(payload.rows) && payload.rows.length) {
            var tb = document.getElementById('toolsCriteriaBody');
            if (tb) {
              tb.innerHTML = '<tr><td colspan="3" class="border border-black px-3 py-4 text-sm text-amber-900 bg-amber-50">이 문서는 이전 형식(도구명·유형 목록)으로 저장되었습니다. 필요 시 「NCS 평가준거 불러오기」로 양식을 다시 채우거나 비고에 기록을 남겨 주세요.</td></tr>';
            }
          }
        }
        void (async function() {
          var cid = selectedCourseId || (useFixedCourseId ? fixedCourseId : '');
          if (!cid) {
            resetAllNcsPlanSubjectSelects();
            return;
          }
          await loadNcsPlanSubjectOptions(cid, payload.session_id || selectedSessionIdForSubject || '', { preserveSelection: true });
          applyNcsSubjectSelectValue('toolsSubjectSelect', payload.curriculum_id, payload.subject_name);
          syncToolsSubjectDisplay();
          updateToolsLoadButtonState();
        })();
        return;
      }
      if (tabId === 'rubric') {
        setRubricFieldValue('rubric_doc_title', data?.title || '');
        setRubricFieldValue('rubric_writer', payload.writer || '');
        setRubricFieldValue('rubric_unit_name', payload.unit_name || '');
        setRubricFieldValue('rubric_total_target', payload.total_target || '');
        setRubricFieldValue('rubric_notes', payload.notes || '');
        renderRubricAttachments(payload.attachments || []);
        renderRubricRows(normalizeRubricRows(payload.rows || []));
        void (async function() {
          var cid = selectedCourseId || (useFixedCourseId ? fixedCourseId : '');
          if (!cid) {
            resetAllNcsPlanSubjectSelects();
            return;
          }
          await loadNcsPlanSubjectOptions(cid, payload.session_id || selectedSessionIdForSubject || '', { preserveSelection: true });
          applyNcsSubjectSelectValue('rubric_subject_name', payload.curriculum_id, payload.subject_name);
        })();
        return;
      }
      if (tabId === 'achievement') {
        setAchievementFieldValue('achievement_doc_title', data?.title || '');
        setAchievementFieldValue('achievement_writer', payload.writer || '');
        setAchievementFieldValue('achievement_eval_date', payload.eval_date || '');
        setAchievementFieldValue('achievement_trainee', payload.trainee || '');
        setAchievementFieldValue('achievement_unit_level', payload.unit_level || '');
        setAchievementFieldValue('achievement_target_score', payload.target_score || '');
        setAchievementFieldValue('achievement_notes', payload.notes || '');
        setAchievementFieldValue('achievement_score_item_name', payload.score_item_name || '');
        setAchievementFieldValue('achievement_score_raw', payload.score_raw || '');
        setAchievementFieldValue('achievement_score_converted', payload.score_converted || '');
        setAchievementFieldValue('achievement_score_comment', payload.score_comment || '');
        renderAchievementAttachments(payload.attachments || []);
        renderAchievementRows(normalizeAchievementRows(payload.rows || []));
        void (async function() {
          var cid = selectedCourseId || (useFixedCourseId ? fixedCourseId : '');
          if (!cid) {
            resetAllNcsPlanSubjectSelects();
            return;
          }
          await loadNcsPlanSubjectOptions(cid, payload.session_id || selectedSessionIdForSubject || '', { preserveSelection: true });
          applyNcsSubjectSelectValue('achievement_subject_name', payload.curriculum_id, payload.subject_name);
        })();
        return;
      }
      if (tabId === 'review') {
        setReviewFieldValue('review_doc_title', data?.title || '');
        setReviewFieldValue('review_writer', payload.writer || '');
        setReviewFieldValue('review_reviewer', payload.reviewer || '');
        setReviewFieldValue('review_approval_role_chair', payload.approval_role_chair || '검토자');
        setReviewFieldValue('review_approval_role_writer', payload.approval_role_writer || '실장');
        setReviewFieldValue('review_approval_role_reviewer', payload.approval_role_reviewer || '원장');
        setReviewFieldValue('review_unit_level', payload.unit_level || '');
        setReviewFieldValue('review_tool_name', payload.tool_name || '평가지 체크리스트');
        setReviewFieldValue('review_review_date', payload.review_date || '');
        setReviewFieldValue('review_notes', payload.notes || '');
        renderReviewAttachments(payload.attachments || []);
        renderReviewSignatures(payload.signatures || {});
        renderReviewRows(normalizeReviewRows(payload.rows || []));
        void (async function() {
          var cid = selectedCourseId || (useFixedCourseId ? fixedCourseId : '');
          if (!cid) {
            resetAllNcsPlanSubjectSelects();
            return;
          }
          await loadNcsPlanSubjectOptions(cid, payload.session_id || selectedSessionIdForSubject || '', { preserveSelection: true });
          applyNcsSubjectSelectValue('review_subject_name', payload.curriculum_id, payload.subject_name);
        })();
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

    var NCS_PLAN_SUBJECT_SELECT_IDS = [
      'scheduleSubjectSelect',
      'questionsSubjectSelect',
      'toolsSubjectSelect',
      'rubric_subject_name',
      'achievement_subject_name',
      'review_subject_name'
    ];

    function forEachNcsPlanSubjectSelect(fn) {
      NCS_PLAN_SUBJECT_SELECT_IDS.forEach(function(id) {
        var el = document.getElementById(id);
        if (el) fn(el, id);
      });
    }

    function resetAllNcsPlanSubjectSelects() {
      forEachNcsPlanSubjectSelect(function(el) {
        el.innerHTML = '<option value="">과정 선택 후 교과목</option>';
        el.disabled = true;
      });
      resetScheduleInstructorSelect();
    }

    function getNcsSubjectSelectText(selectId) {
      var el = document.getElementById(selectId);
      if (!el || String(el.tagName).toUpperCase() !== 'SELECT') return '';
      if (el.selectedIndex < 0 || !el.options[el.selectedIndex]) return '';
      return String(el.options[el.selectedIndex].textContent || '').trim();
    }

    function getNcsSubjectSelectCurriculumValue(selectId) {
      var el = document.getElementById(selectId);
      if (!el || String(el.tagName).toUpperCase() !== 'SELECT') return '';
      return String(el.value || '').trim();
    }

    function applyNcsSubjectSelectValue(selectId, curriculumIdRaw, subjectNameRaw) {
      var el = document.getElementById(selectId);
      if (!el || String(el.tagName).toUpperCase() !== 'SELECT') return;
      var cid = curriculumIdRaw != null ? String(curriculumIdRaw).trim() : '';
      if (cid) {
        el.value = cid;
        if (el.value === cid) return;
      }
      var name = String(subjectNameRaw || '').trim();
      if (!name) {
        el.value = '';
        return;
      }
      for (var i = 0; i < el.options.length; i++) {
        var o = el.options[i];
        if (String(o.textContent || '').trim() === name) {
          el.value = o.value;
          return;
        }
      }
      el.value = '';
    }

    function appendSubjectOptionsToSelect(el, subjects) {
      var seen = {};
      (Array.isArray(subjects) ? subjects : []).forEach(function(sub) {
        if (!sub || sub.id == null) return;
        var idKey = String(sub.id);
        if (seen[idKey]) return;
        seen[idKey] = true;
        var opt = document.createElement('option');
        opt.value = idKey;
        var nm = String(sub.name || sub.main_job_name || sub.job_name || '교과목');
        opt.textContent = nm;
        opt.title = nm;
        el.appendChild(opt);
      });
    }

    async function loadNcsPlanSubjectOptions(courseId, preferredSessionId, loadOpts) {
      loadOpts = loadOpts || {};
      var preserveSelection = loadOpts.preserveSelection !== false;
      var savedById = {};
      if (preserveSelection) {
        NCS_PLAN_SUBJECT_SELECT_IDS.forEach(function(sid) {
          var el = document.getElementById(sid);
          if (!el || String(el.tagName).toUpperCase() !== 'SELECT') return;
          savedById[sid] = {
            v: String(el.value || '').trim(),
            n: getNcsSubjectSelectText(sid)
          };
        });
      }
      selectedSessionIdForSubject = '';
      if (!courseId) {
        resetAllNcsPlanSubjectSelects();
        return;
      }
      forEachNcsPlanSubjectSelect(function(el) {
        el.innerHTML = '<option value="">교과목 선택</option>';
        el.disabled = true;
      });
      try {
        var wantSessionId = preferredSessionId != null && String(preferredSessionId).trim() !== '' ? String(preferredSessionId).trim() : '';
        var json = null;
        var sessionIdForApi = '';

        if (useFixedCourseId) {
          sessionIdForApi = wantSessionId || String(courseId).trim();
        } else if (wantSessionId) {
          sessionIdForApi = wantSessionId;
        } else {
          var probeRes = await authFetch('/api/course-sessions/' + encodeURIComponent(String(courseId)) + '/timetable/resources');
          json = await probeRes.json();
          if (probeRes.ok && json && json.success && json.data) {
            sessionIdForApi = String(courseId);
          }
        }

        if (!sessionIdForApi) {
          var sessRes = await authFetch('/api/course-sessions?lms_course_id=' + encodeURIComponent(String(courseId)) + '&limit=500&page=1');
          var sessJson = await sessRes.json();
          var sessions = Array.isArray(sessJson && sessJson.data) ? sessJson.data : [];
          var picked = wantSessionId ? (sessions.find(function(s) { return s && String(s.id) === wantSessionId; }) || null) : null;
          if (!picked) picked = sessions[0] || null;
          if (!picked || picked.id == null) {
            resetAllNcsPlanSubjectSelects();
            return;
          }
          sessionIdForApi = String(picked.id);
          json = null;
        }

        selectedSessionIdForSubject = sessionIdForApi;
        if (!json || !json.data) {
          var res = await authFetch('/api/course-sessions/' + encodeURIComponent(sessionIdForApi) + '/timetable/resources');
          json = await res.json();
        }
        var data = json && json.data;
        var subjects = data && Array.isArray(data.subjects) ? data.subjects : [];
        forEachNcsPlanSubjectSelect(function(el) {
          appendSubjectOptionsToSelect(el, subjects);
          el.disabled = false;
        });
        await loadScheduleInstructorOptions(sessionIdForApi);
        if (preserveSelection) {
          NCS_PLAN_SUBJECT_SELECT_IDS.forEach(function(sid) {
            var s = savedById[sid];
            if (!s) return;
            applyNcsSubjectSelectValue(sid, s.v, s.n);
          });
        }
        syncToolsSubjectDisplay();
        updateToolsLoadButtonState();
      } catch (e) {
        console.error(e);
        resetAllNcsPlanSubjectSelects();
      }
    }

    async function applyScheduleSessionSubjectFromPayload(payload) {
      var p = payload || {};
      var cid = selectedCourseId || (useFixedCourseId ? fixedCourseId : '');
      if (!cid) {
        selectedSessionIdForSubject = '';
        resetAllNcsPlanSubjectSelects();
        return;
      }
      await loadNcsPlanSubjectOptions(cid, p.session_id, { preserveSelection: true });
      // 다과목 문서일 수 있으므로, 상단 curriculum_id/subject_name이 있을 때만 선택값을 맞춥니다.
      if ((p.curriculum_id != null && String(p.curriculum_id).trim() !== '') || (p.subject_name != null && String(p.subject_name).trim() !== '')) {
        applyNcsSubjectSelectValue('scheduleSubjectSelect', p.curriculum_id, p.subject_name);
      }
    }

    function formatPlanDocOptionText(row, index) {
      var title = String((row && row.title) || '').trim();
      var updated = String((row && row.updated_at) || '').trim();
      var titlePart = title || ('문서 #' + String(index + 1));
      var datePart = updated ? (' · ' + updated) : '';
      return titlePart + datePart;
    }

    function setPlanDocSelectOptions(tabId, list, selectedId) {
      var sel = document.getElementById('planDocSelect-' + tabId);
      if (!sel) return;
      sel.innerHTML = '<option value="">최신 문서</option>';
      (Array.isArray(list) ? list : []).forEach(function(row, idx) {
        if (!row || row.id == null) return;
        var opt = document.createElement('option');
        opt.value = String(row.id);
        opt.textContent = formatPlanDocOptionText(row, idx);
        sel.appendChild(opt);
      });
      var selected = selectedId != null ? String(selectedId) : '';
      if (selected) sel.value = selected;
      if (selected && sel.value !== selected) sel.value = '';
      var hasSelected = !!(sel.value || '').trim();
      var updateBtn = document.getElementById('planDocUpdateBtn-' + tabId);
      var deleteBtn = document.getElementById('planDocDeleteBtn-' + tabId);
      if (updateBtn) updateBtn.disabled = !hasSelected;
      if (deleteBtn) deleteBtn.disabled = !hasSelected;
    }

    async function loadDocumentList(tabId, selectedId) {
      if (!selectedCourseId) {
        setPlanDocSelectOptions(tabId, [], '');
        return [];
      }
      try {
        var res = await authFetch('/api/ncs/plan-documents/list?course_id=' + encodeURIComponent(selectedCourseId) + '&evaluation_round=' + encodeURIComponent(selectedRound) + '&doc_type=' + encodeURIComponent(tabId));
        var json = await res.json();
        if (!json || !json.success) throw new Error((json && json.error) || 'list load failed');
        var list = Array.isArray(json.data) ? json.data : [];
        setPlanDocSelectOptions(tabId, list, selectedId || selectedDocIdByTab[tabId] || '');
        return list;
      } catch (e) {
        console.error(e);
        setPlanDocSelectOptions(tabId, [], '');
        var listErr = (e && e.message) ? String(e.message) : '저장문서 목록을 불러오지 못했습니다.';
        setStatus(tabId, listErr, true);
        return [];
      }
    }

    async function loadDocument(tabId, docId) {
      if (!selectedCourseId) {
        selectedDocIdByTab[tabId] = '';
        setPlanDocSelectOptions(tabId, [], '');
        clearDocForm(tabId);
        setStatus(tabId, '과정을 선택해 주세요', true);
        return;
      }
      setStatus(tabId, '불러오는 중...', false);
      try {
        var requestedDocId = docId != null && String(docId).trim() !== '' ? String(docId).trim() : '';
        var currentSelectedId = requestedDocId || selectedDocIdByTab[tabId] || '';
        await loadDocumentList(tabId, currentSelectedId);
        var url = '/api/ncs/plan-documents?course_id=' + encodeURIComponent(selectedCourseId) + '&evaluation_round=' + encodeURIComponent(selectedRound) + '&doc_type=' + encodeURIComponent(tabId);
        if (requestedDocId) url += '&doc_id=' + encodeURIComponent(requestedDocId);
        const res = await authFetch(url);
        const json = await res.json();
        if (!json?.success) throw new Error(json?.error || 'load failed');
        if (!json.data) {
          if (requestedDocId) {
            selectedDocIdByTab[tabId] = '';
            await loadDocument(tabId, '');
            return;
          }
          selectedDocIdByTab[tabId] = '';
          await loadDocumentList(tabId, '');
          clearDocForm(tabId);
          if (tabId === 'questions') {
            await autoFillQuestionsCourseNameIfEmpty();
          }
          setStatus(tabId, '새 문서', false);
          return;
        }
        applyDocForm(tabId, json.data);
        if (tabId === 'questions') {
          await autoFillQuestionsCourseNameIfEmpty();
        }
        selectedDocIdByTab[tabId] = String(json.data.id || '');
        await loadDocumentList(tabId, selectedDocIdByTab[tabId]);
        setUpdatedAt(tabId, json.data.updated_at || null);
        setStatus(tabId, '불러오기 완료', false);
      } catch (e) {
        console.error(e);
        setStatus(tabId, '불러오기 실패', true);
      }
    }

    async function saveDocument(tabId) {
      if (blockIfMinutesAdminOnly(tabId)) return;
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
        if (json && json.data && json.data.id != null) {
          selectedDocIdByTab[tabId] = String(json.data.id);
          await loadDocumentList(tabId, selectedDocIdByTab[tabId]);
        } else {
          await loadDocumentList(tabId, selectedDocIdByTab[tabId] || '');
        }
        const now = new Date();
        const stamp = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0') + '-' + String(now.getDate()).padStart(2, '0') + ' ' + String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0');
        setUpdatedAt(tabId, stamp);
        var tabName = TAB_NAMES[tabId] || tabId;
        alert('[' + tabName + '] 문서가 저장되었습니다.');
      } catch (e) {
        console.error(e);
        setStatus(tabId, '저장 실패', true);
        var errMsg = (e && e.message) ? String(e.message) : '알 수 없는 오류';
        alert('문서 저장에 실패했습니다.\\n' + errMsg);
      }
    }

    async function startNewDocument(tabId) {
      if (blockIfMinutesAdminOnly(tabId)) return;
      selectedDocIdByTab[tabId] = '';
      clearDocForm(tabId);
      if (tabId === 'questions') {
        await autoFillQuestionsCourseNameIfEmpty();
      }
      await loadDocumentList(tabId, '');
      setStatus(tabId, '새 문서 작성 중', false);
    }

    async function updateDocument(tabId) {
      if (blockIfMinutesAdminOnly(tabId)) return;
      if (!selectedCourseId) {
        alert('먼저 과정을 선택해 주세요.');
        return;
      }
      var docId = String(selectedDocIdByTab[tabId] || '').trim();
      if (!docId) {
        alert('수정할 저장문서를 먼저 선택해 주세요.');
        return;
      }
      const form = getDocForm(tabId);
      setStatus(tabId, '수정 저장 중...', false);
      try {
        const res = await authFetch('/api/ncs/plan-documents/' + encodeURIComponent(docId), {
          method: 'PUT',
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
        if (!json?.success) throw new Error(json?.error || 'update failed');
        setStatus(tabId, '수정 저장 완료', false);
        await loadDocumentList(tabId, docId);
        const now = new Date();
        const stamp = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0') + '-' + String(now.getDate()).padStart(2, '0') + ' ' + String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0');
        setUpdatedAt(tabId, stamp);
        var tabName = TAB_NAMES[tabId] || tabId;
        alert('[' + tabName + '] 저장문서가 수정되었습니다.');
      } catch (e) {
        console.error(e);
        setStatus(tabId, '수정 저장 실패', true);
        var errMsg = (e && e.message) ? String(e.message) : '알 수 없는 오류';
        alert('문서 수정에 실패했습니다.\\n' + errMsg);
      }
    }

    async function deleteDocument(tabId) {
      if (blockIfMinutesAdminOnly(tabId)) return;
      if (!selectedCourseId) {
        alert('먼저 과정을 선택해 주세요.');
        return;
      }
      var docId = String(selectedDocIdByTab[tabId] || '').trim();
      if (!docId) {
        alert('삭제할 저장문서를 먼저 선택해 주세요.');
        return;
      }
      if (!confirm('선택한 저장문서를 삭제할까요?\\n삭제 후 복구할 수 없습니다.')) return;
      setStatus(tabId, '문서 삭제 중...', false);
      try {
        const url = '/api/ncs/plan-documents/' + encodeURIComponent(docId) +
          '?course_id=' + encodeURIComponent(String(selectedCourseId)) +
          '&evaluation_round=' + encodeURIComponent(String(selectedRound)) +
          '&doc_type=' + encodeURIComponent(tabId);
        const res = await authFetch(url, {
          method: 'DELETE',
          headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
        });
        const json = await res.json();
        if (!json?.success) throw new Error(json?.error || 'delete failed');
        selectedDocIdByTab[tabId] = '';
        await loadDocument(tabId, '');
        setStatus(tabId, '문서 삭제 완료', false);
        var tabName = TAB_NAMES[tabId] || tabId;
        alert('[' + tabName + '] 저장문서를 삭제했습니다.');
      } catch (e) {
        console.error(e);
        setStatus(tabId, '문서 삭제 실패', true);
        var errMsg = (e && e.message) ? String(e.message) : '알 수 없는 오류';
        alert('문서 삭제에 실패했습니다.\\n' + errMsg);
      }
    }

    function applyRoundBadges() {
      const label = roundLabel(selectedRound);
      document.querySelectorAll('[id^="activeRoundBadge-"]').forEach(function(el) { el.textContent = label; });
      var minutesRoundCell = document.getElementById('minutesRoundCell');
      if (minutesRoundCell) minutesRoundCell.textContent = String(selectedRound) + '차';
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
      function highlightAndScrollTo(el) {
        if (!el) return;
        try {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } catch (_) {
          try { el.scrollIntoView(true); } catch (_) {}
        }
        try {
          el.classList.add('ring-4', 'ring-indigo-200', 'ring-offset-2');
          setTimeout(function() {
            try { el.classList.remove('ring-4', 'ring-indigo-200', 'ring-offset-2'); } catch (_) {}
          }, 1600);
        } catch (_) {}
      }

      function getPlanFocusParams() {
        try {
          var p = new URLSearchParams(window.location.search);
          var focus = String(p.get('focus') || '').trim();
          var subjectId = String(p.get('subject_id') || p.get('subjectId') || '').trim();
          var tab = String(p.get('plan_tab') || p.get('planTab') || '').trim();
          return { focus: focus === '1', subjectId: subjectId, tab: tab };
        } catch (_) {
          return { focus: false, subjectId: '', tab: '' };
        }
      }

      async function applyAutoFocusIfRequested() {
        var fp = getPlanFocusParams();
        if (!fp.focus) return;
        var tabId = activeTab || fp.tab || 'minutes';
        var selectIdByTab = {
          schedule: 'scheduleSubjectSelect',
          questions: 'questionsSubjectSelect',
          tools: 'toolsSubjectSelect',
          rubric: 'rubric_subject_name',
          achievement: 'achievement_subject_name',
          review: 'review_subject_name'
        };
        var targetSelectId = selectIdByTab[tabId] || '';
        if (fp.subjectId && targetSelectId) {
          applyNcsSubjectSelectValue(targetSelectId, fp.subjectId, '');
        }
        // 탭별 입력 영역으로 스크롤
        var focusEl = null;
        if (tabId === 'schedule') focusEl = document.getElementById('scheduleInputDate') || document.getElementById('scheduleSubjectSelect');
        else if (tabId === 'questions') focusEl = document.getElementById('questionInputText') || document.getElementById('questionsSubjectSelect');
        else if (tabId === 'tools') focusEl = document.getElementById('tools_notes') || document.getElementById('toolsSubjectSelect');
        else if (tabId === 'rubric') focusEl = document.getElementById('rubric_subject_name');
        else if (tabId === 'achievement') focusEl = document.getElementById('achievement_subject_name');
        else if (tabId === 'review') focusEl = document.getElementById('review_subject_name');
        highlightAndScrollTo(focusEl);
      }
      function ensureEditableTargetId(el) {
        if (!el) return '';
        if (el.id) return String(el.id);
        var tag = el.tagName ? String(el.tagName).toUpperCase() : '';
        var isEditable = tag === 'TEXTAREA' || tag === 'INPUT' || !!el.isContentEditable;
        if (!isEditable) return '';
        var generated = 'ncsAutoEditable_' + String(autoEditableSeq++);
        el.id = generated;
        return generated;
      }

      document.addEventListener('focusin', function(ev) {
        var el = ev.target;
        if (!el) return;
        var ensuredId = ensureEditableTargetId(el);
        if (!ensuredId) return;
        var tag = el.tagName ? String(el.tagName).toUpperCase() : '';
        if (tag === 'TEXTAREA') {
          lastFocusedEditableId = ensuredId;
          return;
        }
        if (tag === 'INPUT') {
          var inputType = String(el.type || '').toLowerCase();
          if (inputType !== 'file' && inputType !== 'button' && inputType !== 'submit' && inputType !== 'reset') {
            lastFocusedEditableId = ensuredId;
          }
          return;
        }
        if (el.isContentEditable) {
          lastFocusedEditableId = ensuredId;
        }
      });

      applyMinutesReadOnlyMode();

      if (useFixedCourseId) {
        await refreshFixedCourseHint();
      } else {
        await loadCourseOptions();
        const courseSel = document.getElementById('ncsPlanCourseSelect');
        if (courseSel) {
          courseSel.addEventListener('change', async function() {
            selectedCourseId = courseSel.value || '';
            resetAllNcsPlanSubjectSelects();
            await loadNcsPlanSubjectOptions(selectedCourseId, undefined, { preserveSelection: false });
            await loadDocument(activeTab);
          });
        }
      }

      const roundSel = document.getElementById('ncsPlanRoundSelect');
      if (roundSel) {
        roundSel.addEventListener('change', async function() {
          selectedRound = parseInt(roundSel.value, 10) || 1;
          applyRoundBadges();
          await loadDocument(activeTab);
        });
      }

      var toolsSubSelInit = document.getElementById('toolsSubjectSelect');
      if (toolsSubSelInit) {
        toolsSubSelInit.addEventListener('change', function() {
          syncToolsSubjectDisplay();
          updateToolsLoadButtonState();
        });
      }
      var toolsLoadBtnInit = document.getElementById('toolsLoadNcsCriteriaBtn');
      if (toolsLoadBtnInit) {
        toolsLoadBtnInit.addEventListener('click', function() {
          void loadNcsCriteriaIntoToolsForm();
        });
      }

      document.querySelectorAll('[data-plan-save-btn]').forEach(function(btn) {
        btn.addEventListener('click', async function() {
          const tabId = btn.getAttribute('data-plan-save-btn');
          if (!tabId) return;
          await saveDocument(tabId);
        });
      });
      document.querySelectorAll('[data-plan-new-btn]').forEach(function(btn) {
        btn.addEventListener('click', async function() {
          const tabId = btn.getAttribute('data-plan-new-btn');
          if (!tabId) return;
          await startNewDocument(tabId);
        });
      });
      document.querySelectorAll('[data-plan-update-btn]').forEach(function(btn) {
        btn.addEventListener('click', async function() {
          const tabId = btn.getAttribute('data-plan-update-btn');
          if (!tabId) return;
          await updateDocument(tabId);
        });
      });
      document.querySelectorAll('[data-plan-delete-btn]').forEach(function(btn) {
        btn.addEventListener('click', async function() {
          const tabId = btn.getAttribute('data-plan-delete-btn');
          if (!tabId) return;
          await deleteDocument(tabId);
        });
      });

      document.querySelectorAll('[data-plan-doc-select]').forEach(function(sel) {
        sel.addEventListener('change', async function() {
          var tabId = sel.getAttribute('data-plan-doc-select');
          if (!tabId) return;
          var pickedId = (sel.value || '').trim();
          selectedDocIdByTab[tabId] = pickedId;
          await loadDocument(tabId, pickedId);
        });
      });

      document.querySelectorAll('[data-plan-doc-list-reload]').forEach(function(btn) {
        btn.addEventListener('click', async function() {
          var tabId = btn.getAttribute('data-plan-doc-list-reload');
          if (!tabId) return;
          await loadDocumentList(tabId, selectedDocIdByTab[tabId] || '');
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
        const rmQuestionsAtt = target.getAttribute('data-remove-questions-attachment');
        if (rmQuestionsAtt != null) {
          removeQuestionsAttachment(parseInt(rmQuestionsAtt, 10));
          return;
        }
        const rmToolsAtt = target.getAttribute('data-remove-tools-attachment');
        if (rmToolsAtt != null) {
          removeToolsAttachment(parseInt(rmToolsAtt, 10));
          return;
        }
        const rmRubricAtt = target.getAttribute('data-remove-rubric-attachment');
        if (rmRubricAtt != null) {
          removeRubricAttachment(parseInt(rmRubricAtt, 10));
          return;
        }
        const rmAchievementAtt = target.getAttribute('data-remove-achievement-attachment');
        if (rmAchievementAtt != null) {
          removeAchievementAttachment(parseInt(rmAchievementAtt, 10));
          return;
        }
        const rmReviewAtt = target.getAttribute('data-remove-review-attachment');
        if (rmReviewAtt != null) {
          removeReviewAttachment(parseInt(rmReviewAtt, 10));
          return;
        }
        const rmReviewSign = target.getAttribute('data-remove-review-signature');
        if (rmReviewSign != null) {
          removeReviewSignature(rmReviewSign);
          return;
        }
        const rmMinutesSign = target.getAttribute('data-remove-minutes-signature');
        if (rmMinutesSign != null) {
          removeMinutesSignature(rmMinutesSign);
          return;
        }
        if (target && target.closest && target.closest('#scheduleAddRowBtn')) {
          const ok = addScheduleRowFromInputs();
          if (!ok) {
            // addScheduleRowFromInputs 내부에서 alert을 이미 띄움
          }
          return;
        }
        const editScheduleIdx = target.getAttribute('data-edit-schedule-row');
        if (editScheduleIdx != null) {
          const rows = readScheduleRowsFromTable();
          const index = parseInt(editScheduleIdx, 10);
          if (!Number.isFinite(index) || index < 0 || index >= rows.length) return;
          const row = rows[index];
          schedulePendingEditIndex = index;
          applyNcsSubjectSelectValue('scheduleSubjectSelect', row.curriculum_id || '', row.subject || '');
          applyScheduleInstructorSelectValue(row.instructor_id || '', row.instructor_name || '');
          var schInstEl = document.getElementById('scheduleInstructorSelect');
          if (schInstEl && String(schInstEl.tagName).toUpperCase() === 'SELECT') schInstEl.disabled = false;
          var sde = document.getElementById('scheduleInputDate');
          var ste = document.getElementById('scheduleInputTime');
          var spe = document.getElementById('scheduleInputPlace');
          if (sde) sde.value = row.date || '';
          if (ste) ste.value = row.time || '';
          if (spe) spe.value = row.place || '';
          updateScheduleAddButtonLabel();
          return;
        }
        if (target.id === 'questionAddRowBtn') {
          addQuestionFromInputs();
          return;
        }
        const previewBtn = target && target.closest ? target.closest('[data-preview-question-row]') : null;
        if (previewBtn) {
          const rowEl = previewBtn.closest && previewBtn.closest('tr[data-question-row]');
          if (rowEl) openQuestionsPreviewModal(rowEl);
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
          schedulePendingEditIndex = null;
          clearScheduleInputRow();
          updateScheduleAddButtonLabel();
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
          const scoreEl = document.getElementById('questionInputScore');
          const keywordEl = document.getElementById('questionInputKeyword');
          if (noEl) noEl.value = String(row.no || '');
          applyQuestionTypeSelectValue(row.type);
          setQuestionInputValue(row.text || '');
          if (scoreEl) scoreEl.value = String(row.score || 0);
          if (keywordEl) keywordEl.value = row.keyword || '';
          rows.splice(index, 1);
          renderQuestionRows(rows);
          return;
        }
        const reviewCheckType = target.getAttribute('data-review-check');
        if (reviewCheckType) {
          const rowEl = target.closest('tr[data-review-row]');
          if (rowEl) {
            const okEl = rowEl.querySelector('input[data-review-check="adequate"]');
            const fixEl = rowEl.querySelector('input[data-review-check="needs_revision"]');
            if (reviewCheckType === 'adequate' && okEl && okEl.checked && fixEl) fixEl.checked = false;
            if (reviewCheckType === 'needs_revision' && fixEl && fixEl.checked && okEl) okEl.checked = false;
          }
          updateReviewCompletion(readReviewRowsFromTable());
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

      var initialPlanTab = 'minutes';
      try {
        var urlParamsRound = new URLSearchParams(window.location.search);
        var erParam = urlParamsRound.get('evaluation_round') || urlParamsRound.get('round');
        if (erParam) {
          var erNum = parseInt(String(erParam), 10);
          if (erNum >= 1 && erNum <= 3) {
            selectedRound = erNum;
            var roundSelInit = document.getElementById('ncsPlanRoundSelect');
            if (roundSelInit) roundSelInit.value = String(erNum);
          }
        }
        var planTabParam = urlParamsRound.get('plan_tab') || urlParamsRound.get('planTab');
        var allowedPlanTabs = ['minutes', 'schedule', 'questions', 'tools', 'rubric', 'achievement', 'review'];
        if (planTabParam && allowedPlanTabs.indexOf(String(planTabParam)) >= 0) {
          initialPlanTab = String(planTabParam);
        }
      } catch (eRound) {}

      applyRoundBadges();
      switchNcsPlanTab(initialPlanTab);
      if (useFixedCourseId) {
        selectedCourseId = fixedCourseId;
        await loadNcsPlanSubjectOptions(fixedCourseId, undefined, { preserveSelection: false });
        await loadDocument(initialPlanTab);
        await applyAutoFocusIfRequested();
      }

      var minutesPrintBtn = document.getElementById('minutesPrintBtn');
      if (minutesPrintBtn) {
        minutesPrintBtn.addEventListener('click', function() { printMinutesDocument(); });
      }
      var minutesPrintBtnInline = document.getElementById('minutesPrintBtnInline');
      if (minutesPrintBtnInline) {
        minutesPrintBtnInline.addEventListener('click', function() { printMinutesDocument(); });
      }

      var teacherNoticeModal = document.getElementById('ncsTeacherMinutesNoticeModal');
      var teacherNoticeOk = document.getElementById('ncsTeacherMinutesNoticeOk');
      if (teacherNoticeOk) {
        teacherNoticeOk.addEventListener('click', function() { hideTeacherMinutesNoticeModal(); });
      }
      if (teacherNoticeModal) {
        teacherNoticeModal.addEventListener('click', function(ev) {
          if (ev.target === teacherNoticeModal) hideTeacherMinutesNoticeModal();
        });
      }

      var questionsPrintBtn = document.getElementById('questionsPrintBtn');
      if (questionsPrintBtn) {
        questionsPrintBtn.addEventListener('click', function() { void printQuestionsDocument(); });
      }
      var toolsPrintBtn = document.getElementById('toolsPrintBtn');
      if (toolsPrintBtn) {
        toolsPrintBtn.addEventListener('click', function() { void printToolsDocument(); });
      }
      var rubricPrintBtn = document.getElementById('rubricPrintBtn');
      if (rubricPrintBtn) {
        rubricPrintBtn.addEventListener('click', function() { void printRubricDocument(); });
      }
      var achievementPrintBtn = document.getElementById('achievementPrintBtn');
      if (achievementPrintBtn) {
        achievementPrintBtn.addEventListener('click', function() { void printAchievementDocument(); });
      }
      var reviewPrintBtn = document.getElementById('reviewPrintBtn');
      if (reviewPrintBtn) {
        reviewPrintBtn.addEventListener('click', function() { void printReviewDocument(); });
      }
      var toolsFileAttachBtn = document.getElementById('toolsFileAttachBtn');
      var toolsFileAttachInput = document.getElementById('toolsFileAttachInput');
      if (toolsFileAttachBtn && toolsFileAttachInput) {
        toolsFileAttachBtn.addEventListener('click', function() { toolsFileAttachInput.click(); });
        toolsFileAttachInput.addEventListener('change', async function(ev) {
          var files = ev.target.files;
          if (!files || !files.length) return;
          var items = readToolsAttachmentsFromDom();
          for (var ti = 0; ti < files.length; ti++) {
            var tdata = await uploadNcsEvalPlanFile(files[ti], false, 'tools');
            if (tdata && tdata.url) {
              items.push({ url: tdata.url, name: tdata.originalName || tdata.fileName || files[ti].name });
            }
          }
          renderToolsAttachments(items);
          ev.target.value = '';
        });
      }
      var toolsImageInsertBtn = document.getElementById('toolsImageInsertBtn');
      var toolsImageDeleteBtn = document.getElementById('toolsImageDeleteBtn');
      var toolsImageInsertInput = document.getElementById('toolsImageInsertInput');
      if (toolsImageInsertBtn && toolsImageInsertInput) {
        toolsImageInsertBtn.addEventListener('click', function() { openNcsPlanImageInsertModal('tools_notes', 'tools'); });
      }
      var selectedToolsImageBox = null;
      function clearSelectedToolsImage() {
        if (selectedToolsImageBox) selectedToolsImageBox.classList.remove('is-selected');
        selectedToolsImageBox = null;
      }
      function removeSelectedToolsImage() {
        if (!selectedToolsImageBox) return;
        selectedToolsImageBox.remove();
        selectedToolsImageBox = null;
        var editor = document.getElementById('tools_notes');
        if (editor) editor.focus();
      }
      if (toolsImageDeleteBtn) {
        toolsImageDeleteBtn.addEventListener('click', function() {
          if (!selectedToolsImageBox) {
            alert('삭제할 이미지를 먼저 클릭해 선택해 주세요.');
            return;
          }
          removeSelectedToolsImage();
        });
      }
      var toolsNotesEditor = document.getElementById('tools_notes');
      if (toolsNotesEditor) {
        toolsNotesEditor.addEventListener('click', function(ev) {
          var target = ev.target;
          var box = target && target.closest ? target.closest('.minutes-image-resizable') : null;
          if (box) {
            if (selectedToolsImageBox && selectedToolsImageBox !== box) selectedToolsImageBox.classList.remove('is-selected');
            selectedToolsImageBox = box;
            selectedToolsImageBox.classList.add('is-selected');
            return;
          }
          clearSelectedToolsImage();
        });
        toolsNotesEditor.addEventListener('keydown', function(ev) {
          var key = String(ev.key || '').toLowerCase();
          if (!selectedToolsImageBox) return;
          if (key === 'delete' || key === 'backspace') {
            ev.preventDefault();
            removeSelectedToolsImage();
          }
        });
      }
      document.addEventListener('click', function(ev) {
        var target = ev.target;
        if (!selectedToolsImageBox) return;
        if (target && target.closest && (target.closest('#tools_notes') || target.closest('#toolsImageDeleteBtn'))) return;
        clearSelectedToolsImage();
      });
      var rubricFileAttachBtn = document.getElementById('rubricFileAttachBtn');
      var rubricFileAttachInput = document.getElementById('rubricFileAttachInput');
      if (rubricFileAttachBtn && rubricFileAttachInput) {
        rubricFileAttachBtn.addEventListener('click', function() { rubricFileAttachInput.click(); });
        rubricFileAttachInput.addEventListener('change', async function(ev) {
          var files = ev.target.files;
          if (!files || !files.length) return;
          var items = readRubricAttachmentsFromDom();
          for (var ri = 0; ri < files.length; ri++) {
            var rdata = await uploadNcsEvalPlanFile(files[ri], false, 'rubric');
            if (rdata && rdata.url) {
              items.push({ url: rdata.url, name: rdata.originalName || rdata.fileName || files[ri].name });
            }
          }
          renderRubricAttachments(items);
          ev.target.value = '';
        });
      }
      var rubricImageInsertBtn = document.getElementById('rubricImageInsertBtn');
      var rubricImageDeleteBtn = document.getElementById('rubricImageDeleteBtn');
      var rubricImageInsertInput = document.getElementById('rubricImageInsertInput');
      if (rubricImageInsertBtn && rubricImageInsertInput) {
        rubricImageInsertBtn.addEventListener('click', function() { openNcsPlanImageInsertModal('rubric_notes', 'rubric'); });
      }
      var selectedRubricImageBox = null;
      function clearSelectedRubricImage() {
        if (selectedRubricImageBox) selectedRubricImageBox.classList.remove('is-selected');
        selectedRubricImageBox = null;
      }
      function removeSelectedRubricImage() {
        if (!selectedRubricImageBox) return;
        selectedRubricImageBox.remove();
        selectedRubricImageBox = null;
        var editor = document.getElementById('rubric_notes');
        if (editor) editor.focus();
      }
      if (rubricImageDeleteBtn) {
        rubricImageDeleteBtn.addEventListener('click', function() {
          if (!selectedRubricImageBox) {
            alert('삭제할 이미지를 먼저 클릭해 선택해 주세요.');
            return;
          }
          removeSelectedRubricImage();
        });
      }
      var rubricNotesEditor = document.getElementById('rubric_notes');
      if (rubricNotesEditor) {
        rubricNotesEditor.addEventListener('click', function(ev) {
          var target = ev.target;
          var box = target && target.closest ? target.closest('.minutes-image-resizable') : null;
          if (box) {
            if (selectedRubricImageBox && selectedRubricImageBox !== box) selectedRubricImageBox.classList.remove('is-selected');
            selectedRubricImageBox = box;
            selectedRubricImageBox.classList.add('is-selected');
          } else {
            clearSelectedRubricImage();
          }
        });
        rubricNotesEditor.addEventListener('keydown', function(ev) {
          var key = String(ev.key || '').toLowerCase();
          if (!selectedRubricImageBox) return;
          if (key === 'delete' || key === 'backspace') {
            ev.preventDefault();
            removeSelectedRubricImage();
          }
        });
      }
      document.addEventListener('click', function(ev) {
        var target = ev.target;
        if (!selectedRubricImageBox) return;
        if (target && target.closest && (target.closest('#rubric_notes') || target.closest('#rubricImageDeleteBtn'))) return;
        clearSelectedRubricImage();
      });
      var achievementFileAttachBtn = document.getElementById('achievementFileAttachBtn');
      var achievementFileAttachInput = document.getElementById('achievementFileAttachInput');
      if (achievementFileAttachBtn && achievementFileAttachInput) {
        achievementFileAttachBtn.addEventListener('click', function() { achievementFileAttachInput.click(); });
        achievementFileAttachInput.addEventListener('change', async function(ev) {
          var files = ev.target.files;
          if (!files || !files.length) return;
          var items = readAchievementAttachmentsFromDom();
          for (var ai = 0; ai < files.length; ai++) {
            var adata = await uploadNcsEvalPlanFile(files[ai], false, 'achievement');
            if (adata && adata.url) {
              items.push({ url: adata.url, name: adata.originalName || adata.fileName || files[ai].name });
            }
          }
          renderAchievementAttachments(items);
          ev.target.value = '';
        });
      }
      var achievementImageInsertBtn = document.getElementById('achievementImageInsertBtn');
      var achievementImageDeleteBtn = document.getElementById('achievementImageDeleteBtn');
      var achievementImageInsertInput = document.getElementById('achievementImageInsertInput');
      if (achievementImageInsertBtn && achievementImageInsertInput) {
        achievementImageInsertBtn.addEventListener('click', function() { openNcsPlanImageInsertModal('achievement_notes', 'achievement'); });
      }
      var selectedAchievementImageBox = null;
      function clearSelectedAchievementImage() {
        if (selectedAchievementImageBox) selectedAchievementImageBox.classList.remove('is-selected');
        selectedAchievementImageBox = null;
      }
      function removeSelectedAchievementImage() {
        if (!selectedAchievementImageBox) return;
        selectedAchievementImageBox.remove();
        selectedAchievementImageBox = null;
        var editor = document.getElementById('achievement_notes');
        if (editor) editor.focus();
      }
      if (achievementImageDeleteBtn) {
        achievementImageDeleteBtn.addEventListener('click', function() {
          if (!selectedAchievementImageBox) {
            alert('삭제할 이미지를 먼저 클릭해 선택해 주세요.');
            return;
          }
          removeSelectedAchievementImage();
        });
      }
      var achievementNotesEditor = document.getElementById('achievement_notes');
      if (achievementNotesEditor) {
        achievementNotesEditor.addEventListener('click', function(ev) {
          var target = ev.target;
          var box = target && target.closest ? target.closest('.minutes-image-resizable') : null;
          if (box) {
            if (selectedAchievementImageBox && selectedAchievementImageBox !== box) selectedAchievementImageBox.classList.remove('is-selected');
            selectedAchievementImageBox = box;
            selectedAchievementImageBox.classList.add('is-selected');
          } else {
            clearSelectedAchievementImage();
          }
        });
        achievementNotesEditor.addEventListener('keydown', function(ev) {
          var key = String(ev.key || '').toLowerCase();
          if (!selectedAchievementImageBox) return;
          if (key === 'delete' || key === 'backspace') {
            ev.preventDefault();
            removeSelectedAchievementImage();
          }
        });
      }
      document.addEventListener('click', function(ev) {
        var target = ev.target;
        if (!selectedAchievementImageBox) return;
        if (target && target.closest && (target.closest('#achievement_notes') || target.closest('#achievementImageDeleteBtn'))) return;
        clearSelectedAchievementImage();
      });
      var reviewFileAttachBtn = document.getElementById('reviewFileAttachBtn');
      var reviewFileAttachInput = document.getElementById('reviewFileAttachInput');
      if (reviewFileAttachBtn && reviewFileAttachInput) {
        reviewFileAttachBtn.addEventListener('click', function() { reviewFileAttachInput.click(); });
        reviewFileAttachInput.addEventListener('change', async function(ev) {
          var files = ev.target.files;
          if (!files || !files.length) return;
          var items = readReviewAttachmentsFromDom();
          for (var rvi = 0; rvi < files.length; rvi++) {
            var rvdata = await uploadNcsEvalPlanFile(files[rvi], false, 'review');
            if (rvdata && rvdata.url) {
              items.push({ url: rvdata.url, name: rvdata.originalName || rvdata.fileName || files[rvi].name });
            }
          }
          renderReviewAttachments(items);
          ev.target.value = '';
        });
      }
      var reviewImageInsertBtn = document.getElementById('reviewImageInsertBtn');
      var reviewImageDeleteBtn = document.getElementById('reviewImageDeleteBtn');
      var reviewImageInsertInput = document.getElementById('reviewImageInsertInput');
      if (reviewImageInsertBtn && reviewImageInsertInput) {
        reviewImageInsertBtn.addEventListener('click', function() { openNcsPlanImageInsertModal('review_notes', 'review'); });
      }
      var selectedReviewImageBox = null;
      function clearSelectedReviewImage() {
        if (selectedReviewImageBox) selectedReviewImageBox.classList.remove('is-selected');
        selectedReviewImageBox = null;
      }
      function removeSelectedReviewImage() {
        if (!selectedReviewImageBox) return;
        selectedReviewImageBox.remove();
        selectedReviewImageBox = null;
        var editor = document.getElementById('review_notes');
        if (editor) editor.focus();
      }
      if (reviewImageDeleteBtn) {
        reviewImageDeleteBtn.addEventListener('click', function() {
          if (!selectedReviewImageBox) {
            alert('삭제할 이미지를 먼저 클릭해 선택해 주세요.');
            return;
          }
          removeSelectedReviewImage();
        });
      }
      var reviewNotesEditor = document.getElementById('review_notes');
      if (reviewNotesEditor) {
        reviewNotesEditor.addEventListener('click', function(ev) {
          var target = ev.target;
          var box = target && target.closest ? target.closest('.minutes-image-resizable') : null;
          if (box) {
            if (selectedReviewImageBox && selectedReviewImageBox !== box) selectedReviewImageBox.classList.remove('is-selected');
            selectedReviewImageBox = box;
            selectedReviewImageBox.classList.add('is-selected');
          } else {
            clearSelectedReviewImage();
          }
        });
        reviewNotesEditor.addEventListener('keydown', function(ev) {
          var key = String(ev.key || '').toLowerCase();
          if (!selectedReviewImageBox) return;
          if (key === 'delete' || key === 'backspace') {
            ev.preventDefault();
            removeSelectedReviewImage();
          }
        });
      }
      document.addEventListener('click', function(ev) {
        var target = ev.target;
        if (!selectedReviewImageBox) return;
        if (target && target.closest && (target.closest('#review_notes') || target.closest('#reviewImageDeleteBtn'))) return;
        clearSelectedReviewImage();
      });

      function bindReviewSignatureInput(btnId, inputId, previewId) {
        var btn = document.getElementById(btnId);
        var input = document.getElementById(inputId);
        if (!btn || !input) return;
        btn.addEventListener('click', function() { input.click(); });
        input.addEventListener('change', async function(ev) {
          var f = ev.target.files && ev.target.files[0];
          if (!f) return;
          var data = await uploadNcsEvalPlanFile(f, true, 'review');
          if (data && data.url) {
            renderReviewSignaturePreview(previewId, data.url);
          }
          ev.target.value = '';
        });
      }
      bindReviewSignatureInput('reviewSignChairBtn', 'reviewSignChairInput', 'reviewSignChairPreview');
      bindReviewSignatureInput('reviewSignWriterBtn', 'reviewSignWriterInput', 'reviewSignWriterPreview');
      bindReviewSignatureInput('reviewSignReviewerBtn', 'reviewSignReviewerInput', 'reviewSignReviewerPreview');

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
      var minutesImageDeleteBtn = document.getElementById('minutesImageDeleteBtn');
      var minutesImageInsertInput = document.getElementById('minutesImageInsertInput');
      if (minutesImageInsertBtn && minutesImageInsertInput) {
        minutesImageInsertBtn.addEventListener('click', function() { openNcsPlanImageInsertModal('minutes_content', 'minutes'); });
      }
      var selectedMinutesImageBox = null;
      function clearSelectedMinutesImage() {
        if (selectedMinutesImageBox) selectedMinutesImageBox.classList.remove('is-selected');
        selectedMinutesImageBox = null;
      }
      function removeSelectedMinutesImage() {
        if (!selectedMinutesImageBox) return;
        var nextFocus = selectedMinutesImageBox.nextSibling || selectedMinutesImageBox.previousSibling;
        selectedMinutesImageBox.remove();
        selectedMinutesImageBox = null;
        var editor = document.getElementById('minutes_content');
        if (editor) {
          editor.focus();
          if (nextFocus && window.getSelection) {
            var sel = window.getSelection();
            var range = document.createRange();
            if (nextFocus.nodeType === Node.TEXT_NODE) {
              range.setStart(nextFocus, Math.min(1, nextFocus.textContent ? nextFocus.textContent.length : 0));
            } else {
              range.selectNodeContents(nextFocus);
              range.collapse(false);
            }
            range.collapse(false);
            sel.removeAllRanges();
            sel.addRange(range);
          }
        }
      }
      if (minutesImageDeleteBtn) {
        minutesImageDeleteBtn.addEventListener('click', function() {
          if (!selectedMinutesImageBox) {
            alert('삭제할 이미지를 먼저 클릭해 선택해 주세요.');
            return;
          }
          removeSelectedMinutesImage();
        });
      }
      var minutesContentEditor = document.getElementById('minutes_content');
      if (minutesContentEditor) {
        minutesContentEditor.addEventListener('click', function(ev) {
          var target = ev.target;
          var box = target && target.closest ? target.closest('.minutes-image-resizable') : null;
          if (box) {
            if (selectedMinutesImageBox && selectedMinutesImageBox !== box) selectedMinutesImageBox.classList.remove('is-selected');
            selectedMinutesImageBox = box;
            selectedMinutesImageBox.classList.add('is-selected');
            return;
          }
          clearSelectedMinutesImage();
        });
        minutesContentEditor.addEventListener('keydown', function(ev) {
          var key = String(ev.key || '').toLowerCase();
          if (!selectedMinutesImageBox) return;
          if (key === 'delete' || key === 'backspace') {
            ev.preventDefault();
            removeSelectedMinutesImage();
          }
        });
      }
      document.addEventListener('click', function(ev) {
        var target = ev.target;
        if (!selectedMinutesImageBox) return;
        if (target && target.closest && (target.closest('#minutes_content') || target.closest('#minutesImageDeleteBtn'))) return;
        clearSelectedMinutesImage();
      });

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

      function updateMinutesTextCount(id, outputId) {
        var out = document.getElementById(outputId);
        if (!out) return;
        if (id === 'minutes_content') {
          var contentEl = document.getElementById('minutes_content');
          out.textContent = String((contentEl && contentEl.textContent ? contentEl.textContent : '').length) + '자';
          return;
        }
        out.textContent = String(getMinutesFieldValue(id).length) + '자';
      }

      ['minutes_content', 'minutes_notes'].forEach(function(id) {
        var outId = id === 'minutes_content' ? 'minutesContentCount' : 'minutesNotesCount';
        var el = document.getElementById(id);
        if (!el) return;
        el.addEventListener('input', function() { updateMinutesTextCount(id, outId); });
        updateMinutesTextCount(id, outId);
      });

      var minutesQuickTodayBtn = document.getElementById('minutesQuickTodayBtn');
      if (minutesQuickTodayBtn) {
        minutesQuickTodayBtn.addEventListener('click', function() {
          if (getMinutesFieldValue('minutes_meeting_date')) return;
          var now = new Date();
          var y = now.getFullYear();
          var m = String(now.getMonth() + 1).padStart(2, '0');
          var dd = String(now.getDate()).padStart(2, '0');
          setMinutesFieldValue('minutes_meeting_date', y + '-' + m + '-' + dd);
        });
      }

      var minutesQuickTitleBtn = document.getElementById('minutesQuickTitleBtn');
      if (minutesQuickTitleBtn) {
        minutesQuickTitleBtn.addEventListener('click', function() {
          var prefixTitle = roundLabel(selectedRound) + ' 평가계획 회의록';
          var rawDate = getMinutesFieldValue('minutes_meeting_date');
          var datePart = rawDate ? (' (' + rawDate + ')') : '';
          setMinutesFieldValue('minutes_doc_title', prefixTitle + datePart);
        });
      }

      var minutesQuickAttendeesBtn = document.getElementById('minutesQuickAttendeesBtn');
      if (minutesQuickAttendeesBtn) {
        minutesQuickAttendeesBtn.addEventListener('click', function() {
          var chair = getMinutesFieldValue('minutes_chairperson');
          var writer = getMinutesFieldValue('minutes_writer');
          var reviewer = getMinutesFieldValue('minutes_reviewer');
          var names = [chair, writer, reviewer].map(function(v) { return String(v || '').trim(); }).filter(Boolean);
          if (!names.length) return;
          setMinutesFieldValue('minutes_attendees', Array.from(new Set(names)).join(', '));
        });
      }

      var questionsFileAttachBtn = document.getElementById('questionsFileAttachBtn');
      var questionsFileAttachInput = document.getElementById('questionsFileAttachInput');
      if (questionsFileAttachBtn && questionsFileAttachInput) {
        questionsFileAttachBtn.addEventListener('click', function() { questionsFileAttachInput.click(); });
        questionsFileAttachInput.addEventListener('change', async function(ev) {
          var files = ev.target.files;
          if (!files || !files.length) return;
          var items = readQuestionsAttachmentsFromDom();
          for (var qi = 0; qi < files.length; qi++) {
            var qdata = await uploadNcsEvalPlanFile(files[qi], false, 'questions');
            if (qdata && qdata.url) {
              items.push({ url: qdata.url, name: qdata.originalName || qdata.fileName || files[qi].name });
            }
          }
          renderQuestionsAttachments(items);
          ev.target.value = '';
        });
      }
      var questionsImageInsertBtn = document.getElementById('questionsImageInsertBtn');
      var questionsImageDeleteBtn = document.getElementById('questionsImageDeleteBtn');
      var questionsImageInsertInput = document.getElementById('questionsImageInsertInput');
      if (questionsImageInsertBtn && questionsImageInsertInput) {
        questionsImageInsertBtn.addEventListener('click', function() { openNcsPlanImageInsertModal('questionInputText', 'questions'); });
      }
      var selectedQuestionImageBox = null;
      function clearSelectedQuestionImage() {
        if (selectedQuestionImageBox) selectedQuestionImageBox.classList.remove('is-selected');
        selectedQuestionImageBox = null;
      }
      function removeSelectedQuestionImage() {
        if (!selectedQuestionImageBox) return;
        selectedQuestionImageBox.remove();
        selectedQuestionImageBox = null;
        var editor = document.getElementById('questionInputText');
        if (editor) editor.focus();
      }
      if (questionsImageDeleteBtn) {
        questionsImageDeleteBtn.addEventListener('click', function() {
          if (!selectedQuestionImageBox) {
            alert('삭제할 이미지를 먼저 클릭해 선택해 주세요.');
            return;
          }
          removeSelectedQuestionImage();
        });
      }
      var questionInputEditor = document.getElementById('questionInputText');
      if (questionInputEditor) {
        questionInputEditor.addEventListener('click', function(ev) {
          var target = ev.target;
          var box = target && target.closest ? target.closest('.minutes-image-resizable') : null;
          if (box) {
            if (selectedQuestionImageBox && selectedQuestionImageBox !== box) selectedQuestionImageBox.classList.remove('is-selected');
            selectedQuestionImageBox = box;
            selectedQuestionImageBox.classList.add('is-selected');
            return;
          }
          clearSelectedQuestionImage();
        });
        questionInputEditor.addEventListener('keydown', function(ev) {
          var key = String(ev.key || '').toLowerCase();
          if (!selectedQuestionImageBox) return;
          if (key === 'delete' || key === 'backspace') {
            ev.preventDefault();
            removeSelectedQuestionImage();
          }
        });
      }
      document.addEventListener('click', function(ev) {
        var target = ev.target;
        if (!selectedQuestionImageBox) return;
        if (target && target.closest && (target.closest('#questionInputText') || target.closest('#questionsImageDeleteBtn'))) return;
        clearSelectedQuestionImage();
      });

      var ncsImageModalInput = document.getElementById('ncsPlanImageInsertModalInput');
      var ncsImageModalPreview = document.getElementById('ncsPlanImageInsertPreview');
      var ncsImageModalPreviewEmpty = document.getElementById('ncsPlanImageInsertPreviewEmpty');
      var ncsImageModalApplyBtn = document.getElementById('ncsPlanImageInsertApplyBtn');
      var ncsImageModalCloseBtn = document.getElementById('ncsPlanImageInsertCloseBtn');
      var ncsImageModalCancelBtn = document.getElementById('ncsPlanImageInsertCancelBtn');
      if (ncsImageModalInput) {
        ncsImageModalInput.addEventListener('change', function(ev) {
          var f = ev.target.files && ev.target.files[0];
          imageInsertContext.file = f || null;
          if (!f) return;
          if (ncsImageModalPreview && window.URL && window.URL.createObjectURL) {
            ncsImageModalPreview.src = window.URL.createObjectURL(f);
            ncsImageModalPreview.classList.remove('hidden');
            if (ncsImageModalPreviewEmpty) ncsImageModalPreviewEmpty.classList.add('hidden');
          }
        });
      }
      if (ncsImageModalApplyBtn) {
        ncsImageModalApplyBtn.addEventListener('click', async function() {
          var f = imageInsertContext.file;
          if (!f) {
            alert('삽입할 이미지를 선택해 주세요.');
            return;
          }
          var folder = imageInsertContext.folder || 'minutes';
          var data = folder === 'minutes'
            ? await uploadMinutesFile(f, true)
            : await uploadNcsEvalPlanFile(f, true, folder);
          if (data && data.url) {
            var targetId = lastFocusedEditableId || imageInsertContext.targetId || '';
            var targetEl = targetId ? document.getElementById(targetId) : null;
            if (!insertImageIntoEditable(targetEl, data.url)) {
              var fallbackEl = document.getElementById(imageInsertContext.targetId || '');
              if (!insertImageIntoEditable(fallbackEl, data.url)) {
                alert('이미지를 넣을 셀(입력칸)을 먼저 클릭해 주세요.');
                return;
              }
            }
            closeNcsPlanImageInsertModal();
          }
        });
      }
      if (ncsImageModalCloseBtn) ncsImageModalCloseBtn.addEventListener('click', function() { closeNcsPlanImageInsertModal(); });
      if (ncsImageModalCancelBtn) ncsImageModalCancelBtn.addEventListener('click', function() { closeNcsPlanImageInsertModal(); });

      var qPreviewCloseBtn = document.getElementById('ncsQuestionPreviewCloseBtn');
      var qPreviewModal = document.getElementById('ncsQuestionPreviewModal');
      if (qPreviewCloseBtn) qPreviewCloseBtn.addEventListener('click', function() { closeQuestionsPreviewModal(); });
      if (qPreviewModal) qPreviewModal.addEventListener('click', function(ev) {
        if (!ev || !ev.target || ev.target === qPreviewModal) closeQuestionsPreviewModal();
      });
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
  ${ncsTeacherMinutesNoticeModalHtml()}
  <div class="flex h-screen overflow-hidden">
    ${sidebar}
    <div class="flex-1 overflow-y-auto custom-scrollbar">
      <header class="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-200/60">
        <div class="px-6 py-5">
          <h1 class="text-2xl font-black tracking-tight text-slate-900">NCS평가계획</h1>
          <p class="text-sm text-slate-500 mt-1">본평가 준비를 위한 회의록/일정/문항/도구 관련 문서를 탭별로 관리합니다.</p>
          <nav class="flex flex-wrap gap-2 mt-4 text-xs font-black" aria-label="NCS 본평가 바로가기">
            <a href="/admin/ncs-eval-dashboard-hub" class="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm"><i class="fas fa-table-columns"></i> 본평가 계획현황</a>
            <a href="/admin/ncs-eval-exec" class="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"><i class="fas fa-play-circle"></i> 평가실행</a>
            <a href="/admin/ncs-eval-result" class="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"><i class="fas fa-poll"></i> 평가결과</a>
          </nav>
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
  ${ncsTeacherMinutesNoticeModalHtml()}
  <div class="flex h-screen overflow-hidden">
    ${sidebar}
    <div class="flex-1 overflow-y-auto custom-scrollbar">
      ${lmsHeaderHtml('ncs-eval', 'hrd')}
      ${lmsNcsSubnavTabsHtml('plan')}
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
