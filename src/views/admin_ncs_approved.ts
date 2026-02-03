import { hrdSidebar } from './components/hrd_sidebar';

const STEP_MENU = [
  { step: 1, label: '과정개요', icon: 'fa-list-alt', status: 'active' },
  { step: 2, label: '훈련이수체계도', icon: 'fa-sitemap', status: 'pending' },
  { step: 3, label: '교과목편성', icon: 'fa-book', status: 'pending' },
  { step: 4, label: '훈련시간설정', icon: 'fa-clock', status: 'pending' },
  { step: 5, label: '평가·교수학습 방법', icon: 'fa-chalkboard-teacher', status: 'pending' },
  { step: 6, label: '시설·장비', icon: 'fa-building', status: 'pending' },
];

function stepNavHtml(currentStep: number, editId?: string): string {
  const query = editId ? `?id=${editId}` : '';
  return STEP_MENU.map(
    (s) => `
    <a href="/admin/ncs/approved/${s.step}${query}" class="flex items-center px-4 py-3 rounded-xl transition-all ${currentStep === s.step ? 'bg-blue-600/20 text-white border-l-4 border-blue-500' : 'hover:bg-slate-800/50 text-slate-400 hover:text-white'}">
      <i class="fas ${s.icon} w-6 text-lg mr-3"></i>
      <span class="font-medium text-sm">${s.step}. ${s.label}</span>
    </a>`
  ).join('');
}


export function stepContentHtml(step: number, editId?: string, isEmbedded: boolean = false, courseId?: string): string {
  if (step === 1) {
    const isEdit = !!editId;
    const selectionDisplay = isEmbedded ? 'hidden' : '';

    // Progress Bar 생성
    const progressBar = `
    <div class="mb-10">
      <div class="flex items-center justify-between relative">
        <div class="absolute top-1/2 left-0 w-full h-1 bg-slate-100 -translate-y-1/2 z-0"></div>
        ${STEP_MENU.map(s => {
      const isActive = s.step === 1;
      const isDone = false; // Step 1에서는 다 pending
      return `
          <div class="relative z-10 flex flex-col items-center">
            <div class="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all shadow-sm ${isActive ? 'bg-blue-600 text-white ring-4 ring-blue-100' : 'bg-white text-slate-400 border border-slate-200'}">
              ${s.step}
            </div>
            <span class="text-[11px] mt-2 font-bold ${isActive ? 'text-blue-600' : 'text-slate-400'} whitespace-nowrap">${s.label}</span>
          </div>
          `;
    }).join('')}
      </div>
    </div>`;

    return `
    <div class="space-y-8" id="ncsApprovedFormContainer">
      ${progressBar}
      
      <input type="hidden" id="ncsApprovedEditId" value="${editId || ''}">
      <input type="hidden" id="ncsApprovedCourseId" value="${courseId || ''}">
      <input type="hidden" id="ncsUnitCode" value="">
      <input type="hidden" id="ncsUnitName" value="">
      
      <div class="${selectionDisplay} card p-6 bg-slate-50 border border-slate-200">
        <h3 class="text-sm font-bold text-slate-800 mb-2 flex items-center gap-2">
          <i class="fas fa-database text-blue-500"></i> 승인받은 과정 기초 데이터 선택
        </h3>
        <p class="text-xs text-slate-500 mb-4">기존에 등록된 승인 과정 목록입니다. 과정을 선택하시면 하단 양식에 자동으로 정보가 입력됩니다.</p>
        <div id="ncsApprovedCourseListContainer" class="max-h-48 overflow-y-auto rounded-xl border border-slate-200 bg-white p-2 space-y-1">
          <div class="py-8 text-center text-slate-400 text-sm">
            <i class="fas fa-spinner fa-spin mr-2"></i> 데이터를 불러오고 있습니다...
          </div>
        </div>
      </div>

      <!-- 상단 탭 (NCS / 비NCS) -->
      <div class="flex p-1 bg-slate-100 rounded-2xl w-fit">
        <button type="button" id="tabNcsOnly" class="ncs-approved-tab px-6 py-2.5 rounded-[14px] font-bold text-sm transition-all bg-white text-blue-600 shadow-sm">
          NCS 훈련과정
        </button>
        <button type="button" id="tabNonNcs" class="ncs-approved-tab px-6 py-2.5 rounded-[14px] font-bold text-sm transition-all text-slate-500 hover:text-slate-700">
          비NCS 훈련과정
        </button>
      </div>

      <div id="panelNcsOnly" class="ncs-approved-panel space-y-8 animate-in fade-in duration-300">
        <!-- 1. 직종 검색 섹션 -->
        <section>
          <div class="flex items-center gap-2 mb-4">
            <h2 class="text-lg font-black text-slate-800 tracking-tight">01. 훈련직종 검색</h2>
            <span class="px-2 py-0.5 rounded bg-blue-100 text-blue-600 text-[10px] font-bold">NCS API 연동</span>
          </div>
          
          <div class="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div class="grid grid-cols-1 md:grid-cols-4 divide-x divide-slate-100">
              <div class="p-4 bg-slate-50/50">
                <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">개발분류</label>
                <select id="ncsDevCategory" size="8" class="ncs-class-select w-full px-2 py-1 border-none bg-transparent text-sm focus:ring-0 min-h-[180px] custom-scrollbar">
                  <option value="24" selected>24년 NCS기반 훈련기준</option>
                  <option value="23">23년 NCS기반 훈련기준</option>
                  <option value="21">21년 NCS기반 훈련기준</option>
                  <option value="20">20년 NCS기반 훈련기준</option>
                  <option value="19">19년 NCS기반 훈련기준</option>
                </select>
              </div>
              <div class="p-4">
                <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">대분류</label>
                <select id="ncsLargeClass" size="8" class="ncs-class-select w-full px-2 py-1 border-none bg-transparent text-sm focus:ring-0 min-h-[180px] custom-scrollbar"></select>
              </div>
              <div class="p-4">
                <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">중분류</label>
                <select id="ncsMidClass" size="8" class="ncs-class-select w-full px-2 py-1 border-none bg-transparent text-sm focus:ring-0 min-h-[180px] custom-scrollbar"></select>
              </div>
              <div class="p-4">
                <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">소분류</label>
                <select id="ncsSmallClass" size="8" class="ncs-class-select w-full px-2 py-1 border-none bg-transparent text-sm focus:ring-0 min-h-[180px] custom-scrollbar"></select>
              </div>
            </div>
            <div id="ncsTrainingApiMessage" class="px-6 py-3 border-t border-slate-100 bg-amber-50 text-amber-700 text-xs hidden"></div>
            <div id="ncsBannerJobSearchLocked" class="hidden px-6 py-3 bg-red-50 text-red-700 text-xs font-bold border-t border-red-100">
              <i class="fas fa-lock mr-2"></i> 훈련이수체계도가 확정되어 직종 변경이 제한됩니다.
            </div>
          </div>
        </section>

        <!-- 2. 과정 상세 정보 (HRD 스타일 테이블) -->
        <section>
          <div class="flex items-center gap-2 mb-4">
            <h2 class="text-lg font-black text-slate-800 tracking-tight">02. 과정 필수 정보</h2>
            <p class="text-xs text-slate-400 font-medium">HRD-Net 등록 규격에 맞는 정보를 입력하세요.</p>
          </div>

          <div class="rounded-2xl border border-slate-200 overflow-hidden bg-white shadow-sm">
            <table class="w-full text-sm border-collapse">
              <tbody>
                <tr class="border-b border-slate-100">
                  <th class="w-40 px-6 py-5 bg-slate-50/80 text-slate-700 font-bold text-left border-r border-slate-100">편성구분 <span class="text-red-500">*</span></th>
                  <td class="px-6 py-5">
                    <div class="flex gap-6">
                      <label class="flex items-center gap-2 cursor-pointer group">
                        <input type="radio" name="courseType" value="양성" class="w-4 h-4 text-blue-600 focus:ring-blue-500 border-slate-300">
                        <span class="font-medium text-slate-700 group-hover:text-blue-600 transition-colors">양성과정 (실업자)</span>
                      </label>
                      <label class="flex items-center gap-2 cursor-pointer group">
                        <input type="radio" name="courseType" value="향상" checked class="w-4 h-4 text-blue-600 focus:ring-blue-500 border-slate-300">
                        <span class="font-medium text-slate-700 group-hover:text-blue-600 transition-colors">향상과정 (재직자)</span>
                      </label>
                    </div>
                  </td>
                </tr>
                <tr class="border-b border-slate-100">
                  <th class="w-40 px-6 py-5 bg-slate-50/80 text-slate-700 font-bold text-left border-r border-slate-100">훈련직종 <span class="text-red-500">*</span></th>
                  <td class="px-6 py-5">
                    <div id="ncsJobRadioGroup" class="flex flex-wrap gap-2 min-h-[40px] items-center">
                      <span id="ncsJobRadioPlaceholder" class="text-slate-400 text-xs">상단에서 소분류를 선택하면 세부 직종이 표시됩니다.</span>
                    </div>
                    <div id="ncsSelectedJobsResult" class="mt-3 flex flex-wrap gap-1.5 min-h-[28px]">
                      <!-- Selected badges will go here -->
                      <span id="ncsSelectedJobsPlaceholder" class="hidden"></span>
                    </div>
                  </td>
                </tr>
                <tr class="border-b border-slate-100">
                  <th class="w-40 px-6 py-5 bg-slate-50/80 text-slate-700 font-bold text-left border-r border-slate-100">과정명 <span class="text-red-500">*</span></th>
                  <td class="px-6 py-5">
                    <input type="text" id="ncsCourseName" class="w-full max-w-2xl px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all font-medium" placeholder="[승인번호] 과정 정식 명칭을 입력하세요">
                  </td>
                </tr>
                <tr class="border-b border-slate-100">
                  <th class="w-40 px-6 py-5 bg-slate-50/80 text-slate-700 font-bold text-left border-r border-slate-100">훈련수준 <span class="text-red-500">*</span></th>
                  <td class="px-6 py-5">
                    <select id="ncsTrainingLevel" class="w-48 px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 bg-white font-medium">
                      <option value="">수준 선택</option>
                      <option value="1">1 수준</option>
                      <option value="2">2 수준</option>
                      <option value="3" selected>3 수준</option>
                      <option value="4">4 수준</option>
                      <option value="5">5 수준</option>
                    </select>
                  </td>
                </tr>
                <tr class="border-b border-slate-100">
                  <th class="w-40 px-6 py-5 bg-slate-50/80 text-slate-700 font-bold text-left border-r border-slate-100">선수능력</th>
                  <td class="px-6 py-5">
                    <textarea id="ncsPrereqSkill" rows="2" class="w-full max-w-2xl px-4 py-3 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all font-medium text-sm" placeholder="수강 전 필요한 필수 능력이나 지식을 입력하세요. (선택사항)"></textarea>
                  </td>
                </tr>
                <tr class="border-b border-slate-100">
                  <th class="w-40 px-6 py-5 bg-slate-50/80 text-slate-700 font-bold text-left border-r border-slate-100">등록일</th>
                  <td class="px-6 py-5">
                    <div class="flex items-center gap-2 text-slate-500 font-medium">
                      <i class="far fa-calendar-alt"></i>
                      <input type="text" id="ncsRegDate" readonly class="border-none bg-transparent p-0 w-32 focus:ring-0 cursor-default" placeholder="자동 생성">
                    </div>
                  </td>
                </tr>
                <tr>
                  <th class="w-40 px-6 py-5 bg-slate-50/80 text-slate-700 font-bold text-left border-r border-slate-100">과정개요 보충</th>
                  <td class="px-6 py-5">
                    <textarea id="ncsOverviewContent" rows="4" class="w-full max-w-2xl px-4 py-3 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all font-medium text-sm" placeholder="과정의 상세 설명, 특징, 기대효과 등을 자유롭게 기술하세요."></textarea>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="mt-4 px-4 py-3 bg-blue-50/50 rounded-xl border border-blue-100 text-[11px] text-blue-600 flex items-center gap-2">
            <i class="fas fa-info-circle"></i>
            필수 항목(*)은 HRD-Net 승인 심사 시 정확하게 입력되어야 합니다.
          </div>
        </section>
      </div>

      <!-- 비NCS 패널 (동일 스타일 적용) -->
      <div id="panelNonNcs" class="ncs-approved-panel hidden space-y-8 animate-in fade-in duration-300">
        <section>
          <div class="flex items-center gap-2 mb-4">
            <h2 class="text-lg font-black text-slate-800 tracking-tight">비NCS 과정 정보</h2>
          </div>
          <div class="rounded-2xl border border-slate-200 overflow-hidden bg-white shadow-sm">
            <table class="w-full text-sm border-collapse">
              <tbody>
                <tr class="border-b border-slate-100">
                  <th class="w-40 px-6 py-5 bg-slate-50/80 text-slate-700 font-bold text-left border-r border-slate-100">과정명</th>
                  <td class="px-6 py-5">
                    <input type="text" id="nonNcsCourseName" class="w-full max-w-2xl px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 font-medium" placeholder="비NCS 과정명 입력">
                  </td>
                </tr>
                <tr>
                  <th class="w-40 px-6 py-5 bg-slate-50/80 text-slate-700 font-bold text-left border-r border-slate-100">과정 개요</th>
                  <td class="px-6 py-5">
                    <textarea id="nonNcsOverview" rows="6" class="w-full max-w-2xl px-4 py-3 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/5 border-slate-200 font-medium" placeholder="과정 개요를 상세히 입력하세요"></textarea>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <!-- 액션 버튼 영역 -->
      <div class="pt-10 flex items-center justify-between border-t border-slate-200">
        <div class="flex gap-3">
          ${isEmbedded
        ? `<a href="/admin/courses/approved" class="h-12 px-6 flex items-center gap-2 border border-slate-200 rounded-2xl bg-white text-slate-600 font-bold text-sm hover:bg-slate-50 transition-all"><i class="fas fa-arrow-left text-xs"></i> 과정 목록</a>`
        : `<a href="/admin/ncs/approved/list" class="h-12 px-6 flex items-center gap-2 border border-slate-200 rounded-2xl bg-white text-slate-600 font-bold text-sm hover:bg-slate-50 transition-all"><i class="fas fa-arrow-left text-xs"></i> 목록으로</a>`
      }
        </div>
        <div class="flex gap-3">
          ${isEdit ? `
          <button type="button" id="ncsApprovedBtnDelete" class="h-12 px-6 bg-white border border-red-100 text-red-500 rounded-2xl font-bold text-sm hover:bg-red-50 transition-all flex items-center gap-2">
            <i class="far fa-trash-alt"></i> 삭제
          </button>
          <button type="button" id="ncsApprovedBtnDeleteDisabled" class="hidden h-12 px-6 bg-slate-100 text-slate-400 rounded-2xl font-bold text-sm cursor-not-allowed items-center gap-2" disabled>
            <i class="fas fa-lock"></i> 삭제 불가
          </button>
          ` : ''}
          <button type="button" id="ncsApprovedBtnSave" class="h-12 px-8 bg-blue-600 text-white rounded-2xl font-bold text-sm hover:bg-blue-700 shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2">
            <i class="fas fa-save"></i> ${isEdit ? '수정 내용 저장' : '기본 정보 저장'}
          </button>
          <button type="button" id="ncsApprovedBtnNext" class="h-12 px-8 bg-slate-800 text-white rounded-2xl font-bold text-sm hover:bg-black transition-all flex items-center gap-2">
            저장 후 다음 단계 <i class="fas fa-arrow-right text-xs"></i>
          </button>
        </div>
      </div>
    </div>
    
    <style>
      .custom-scrollbar::-webkit-scrollbar { width: 4px; }
      .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
      .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
      .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
      
      .ncs-approved-tab.active {
        background-color: white !important;
        color: #2563eb !important;
        box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06) !important;
      }
    </style>
    `;
  }
  if (step === 2) {
    const regId = editId || '';

    // Progress Bar 생성 (Step 2 active)
    const progressBar = `
    <div class="mb-10">
      <div class="flex items-center justify-between relative">
        <div class="absolute top-1/2 left-0 w-full h-1 bg-slate-100 -translate-y-1/2 z-0"></div>
        ${STEP_MENU.map(s => {
      const isActive = s.step === 2;
      const isDone = s.step < 2;
      return `
          <div class="relative z-10 flex flex-col items-center">
            <div class="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all shadow-sm ${isActive ? 'bg-blue-600 text-white ring-4 ring-blue-100' : isDone ? 'bg-blue-100 text-blue-600 border border-blue-200' : 'bg-white text-slate-400 border border-slate-200'}">
              ${isDone ? '<i class="fas fa-check"></i>' : s.step}
            </div>
            <span class="text-[11px] mt-2 font-bold ${isActive ? 'text-blue-600' : isDone ? 'text-blue-500' : 'text-slate-400'} whitespace-nowrap">${s.label}</span>
          </div>
          `;
    }).join('')}
      </div>
    </div>`;

    return `
    <div class="space-y-8" id="ncsApprovedStep2Container">
      ${progressBar}
      <input type="hidden" id="ncsApprovedRegId" value="${regId}">
      
      <section>
        <div class="flex items-center gap-2 mb-4">
          <h2 class="text-lg font-black text-slate-800 tracking-tight">훈련이수체계도 핵심 정의</h2>
          <p class="text-xs text-slate-400 font-medium">선택된 직종의 NCS 능력단위가 이수체계도에 연동됩니다.</p>
        </div>

        <div class="overflow-hidden rounded-2xl border border-slate-200 shadow-sm bg-white">
          <table class="w-full text-left text-sm border-collapse">
            <thead class="bg-slate-50 border-b border-slate-200">
              <tr>
                <th class="px-6 py-4 w-40 font-bold text-slate-700 text-center border-r border-slate-100">NCS 수준</th>
                <th class="px-6 py-4 font-bold text-slate-700 text-center">훈련가능 능력단위 목록</th>
              </tr>
            </thead>
            <tbody id="ncsTrainingSystemBody" class="divide-y divide-slate-100 bg-white">
              <tr><td colspan="2" class="px-6 py-16 text-center text-slate-400"><i class="fas fa-spinner fa-spin mr-2"></i> 능력단위 데이터를 매칭하고 있습니다...</td></tr>
            </tbody>
          </table>
        </div>

        <div class="mt-6 flex gap-4 p-5 bg-blue-50/50 rounded-2xl border border-blue-100">
          <div class="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
            <i class="fas fa-info-circle"></i>
          </div>
          <div class="space-y-1">
            <p class="text-sm font-bold text-blue-800">훈련이수체계도 수정 시 유의사항</p>
            <p class="text-xs text-blue-600 leading-relaxed">
              체계도를 삭제하면 기존에 편성된 모든 NCS 교과목 정보가 초기화됩니다.<br>
              4단계(훈련시간 설정)가 완료된 이후에는 이수체계도 변경이 제한되므로 신중히 작성해 주세요.
            </p>
          </div>
        </div>
      </section>

      <div class="pt-8 flex items-center justify-between border-t border-slate-200">
        <div class="flex gap-3">
          ${isEmbedded
        ? `<a href="/admin/courses/approved" class="h-12 px-6 flex items-center gap-2 border border-slate-200 rounded-2xl bg-white text-slate-600 font-bold text-sm hover:bg-slate-50 transition-all">목록</a>`
        : `<a href="/admin/ncs/approved/list" class="h-12 px-6 flex items-center gap-2 border border-slate-200 rounded-2xl bg-white text-slate-600 font-bold text-sm hover:bg-slate-50 transition-all">목록</a>`
      }
        </div>
        <div class="flex gap-3">
          ${isEmbedded
        ? `<button type="button" onclick="loadNcsStep(1)" class="h-12 px-6 flex items-center gap-2 border border-slate-200 rounded-2xl bg-white text-slate-600 font-bold text-sm hover:bg-slate-50 transition-all"><i class="fas fa-chevron-left text-xs"></i> 1단계 (개요)</button>`
        : `<a href="/admin/ncs/approved/1${regId ? '?id=' + regId : ''}" class="h-12 px-6 flex items-center gap-2 border border-slate-200 rounded-2xl bg-white text-slate-600 font-bold text-sm hover:bg-slate-50 transition-all"><i class="fas fa-chevron-left text-xs"></i> 1단계 (개요)</a>`
      }
          <button type="button" id="ncsStep2BtnSave" class="h-12 px-6 bg-white border border-blue-200 text-blue-600 rounded-2xl font-bold text-sm hover:bg-blue-50 transition-all flex items-center gap-2">
            <i class="fas fa-save"></i> 임시저장
          </button>
          <button type="button" id="ncsStep2BtnNext" class="h-12 px-8 bg-blue-600 text-white rounded-2xl font-bold text-sm hover:bg-blue-700 shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2">
            저장 후 다음단계 <i class="fas fa-chevron-right text-xs"></i>
          </button>
        </div>
      </div>
    </div>`;
  }
  if (step === 3) {
    const regId = editId || '';

    // Progress Bar 생성 (Step 3 active)
    const progressBar = `
    <div class="mb-10">
      <div class="flex items-center justify-between relative">
        <div class="absolute top-1/2 left-0 w-full h-1 bg-slate-100 -translate-y-1/2 z-0"></div>
        ${STEP_MENU.map(s => {
      const isActive = s.step === 3;
      const isDone = s.step < 3;
      return `
          <div class="relative z-10 flex flex-col items-center">
            <div class="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all shadow-sm ${isActive ? 'bg-blue-600 text-white ring-4 ring-blue-100' : isDone ? 'bg-blue-100 text-blue-600 border border-blue-200' : 'bg-white text-slate-400 border border-slate-200'}">
              ${isDone ? '<i class="fas fa-check"></i>' : s.step}
            </div>
            <span class="text-[11px] mt-2 font-bold ${isActive ? 'text-blue-600' : isDone ? 'text-blue-500' : 'text-slate-400'} whitespace-nowrap">${s.label}</span>
          </div>
          `;
    }).join('')}
      </div>
    </div>`;

    return `
    <div class="space-y-8" id="ncsApprovedStep3Container">
      ${progressBar}
      <input type="hidden" id="ncsApprovedRegIdStep3" value="${regId}">
      
      <div id="ncsStep3NoReg" class="hidden card p-10 bg-amber-50 border border-amber-200 text-center rounded-3xl">
        <div class="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
          <i class="fas fa-exclamation-triangle"></i>
        </div>
        <h3 class="text-lg font-bold text-amber-900">과정개요가 등록되지 않았습니다</h3>
        <p class="text-amber-700 text-sm mt-2 mb-6">1단계에서 과정개요를 먼저 저장한 뒤 진행해주세요.</p>
        ${isEmbedded
        ? `<button type="button" onclick="loadNcsStep(1)" class="inline-flex items-center gap-2 px-6 py-2.5 bg-amber-600 text-white rounded-xl font-bold text-sm hover:bg-amber-700 transition-all">1단계로 이동 <i class="fas fa-arrow-right"></i></button>`
        : `<a href="/admin/ncs/approved/1${regId ? '?id=' + regId : ''}" class="inline-flex items-center gap-2 px-6 py-2.5 bg-amber-600 text-white rounded-xl font-bold text-sm hover:bg-amber-700 transition-all">1단계로 이동 <i class="fas fa-arrow-right"></i></a>`
      }
      </div>

      <div id="ncsStep3Form" class="space-y-8">
        <!-- NCS 교과 섹션 -->
        <section class="card bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
          <div class="px-6 py-5 bg-slate-50 border-b border-slate-200 flex flex-wrap justify-between items-center gap-4">
            <div>
              <h2 class="text-lg font-black text-slate-800 tracking-tight" id="ncsCurriculumJobLabel">NCS 기반 교과 편성</h2>
              <p class="text-xs text-slate-500 font-medium">선택한 능력단위를 기반으로 훈련 목표와 교과목을 구성합니다.</p>
            </div>
            <div class="flex gap-2">
              <button type="button" id="ncsCurriculumBtnAdd" class="h-10 px-4 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition flex items-center gap-2">
                <i class="fas fa-plus"></i> 교과목 추가
              </button>
              <button type="button" id="ncsCurriculumBtnDel" class="h-10 px-4 bg-white border border-red-100 text-red-500 rounded-xl text-sm font-bold hover:bg-red-50 transition flex items-center gap-2">
                <i class="fas fa-minus"></i> 삭제
              </button>
            </div>
          </div>
          
          <div id="ncsCurriculumRows" class="p-6 space-y-6">
            <!-- Row Template (styled) -->
            <div class="ncs-curriculum-row rounded-2xl border border-slate-100 p-6 bg-slate-50/30 space-y-6">
              <div>
                <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">교과목명 <span class="text-red-500">*</span></label>
                <input type="text" class="ncs-curriculum-name w-full max-w-2xl px-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 font-bold" placeholder="예: [NCS] 3D프린터 기구 설계">
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">매칭 능력단위 선택</label>
                <div class="ncs-curriculum-unit-checks flex flex-wrap gap-2"></div>
              </div>
              <div class="ncs-curriculum-elements-wrap border border-slate-200 rounded-2xl overflow-hidden bg-white">
                <button type="button" class="ncs-elements-toggle w-full px-5 py-3 text-left text-sm font-bold text-slate-700 hover:bg-slate-50 flex items-center justify-between transition" aria-expanded="false">
                  <span class="flex items-center gap-2"><i class="fas fa-layer-group text-blue-500"></i> 능력단위요소·수행준거 설정</span>
                  <i class="fas fa-chevron-down ncs-elements-chevron text-slate-400 transition-transform"></i>
                </button>
                <div class="ncs-curriculum-elements-body hidden border-t border-slate-100 p-5">
                  <div class="ncs-curriculum-element-checks grid grid-cols-1 md:grid-cols-2 gap-3"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- 비NCS 교과 섹션 -->
        <section class="card bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
          <div class="px-6 py-5 bg-slate-50 border-b border-slate-200 flex flex-wrap justify-between items-center gap-4">
            <div>
              <h2 class="text-lg font-black text-slate-800 tracking-tight">비NCS/일반 교과 편성</h2>
              <p class="text-xs text-slate-500 font-medium">선양·워크숍 등 NCS 외 필요한 교과목을 구성합니다.</p>
            </div>
            <div class="flex gap-2">
              <button type="button" id="nonNcsCurriculumBtnAdd" class="h-10 px-4 bg-slate-700 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition flex items-center gap-2">
                <i class="fas fa-plus"></i> 교과목 추가
              </button>
              <button type="button" id="nonNcsCurriculumBtnDel" class="h-10 px-4 bg-white border border-slate-200 text-slate-500 rounded-xl text-sm font-bold hover:bg-slate-50 transition">삭제</button>
            </div>
          </div>
          
          <div id="nonNcsCurriculumRows" class="p-6 space-y-6">
            <div class="nonncs-curriculum-row rounded-2xl border border-slate-100 p-6 bg-slate-50/30 space-y-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">교과분류</label>
                  <select class="nonncs-curriculum-class w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-4 focus:ring-blue-500/5 font-bold">
                    <option value="">분류 선택</option>
                    <option value="공통">공통교과</option>
                    <option value="기초">기초직무</option>
                    <option value="전문" selected>전문실무</option>
                    <option value="실무">현장실습</option>
                  </select>
                </div>
                <div>
                  <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">교과목명</label>
                  <input type="text" class="nonncs-curriculum-name w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-4 focus:ring-blue-500/5 font-bold" placeholder="비NCS 교과목명 입력">
                </div>
              </div>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-3">
                  <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">세부 단원(수업주제)</label>
                  <div class="nonncs-units space-y-2">
                    <div class="flex gap-2">
                      <input type="text" class="nonncs-unit-item flex-1 px-4 py-2.5 border border-slate-200 rounded-xl text-sm" placeholder="단원명 입력">
                      <button type="button" class="nonncs-unit-plus w-10 h-10 flex items-center justify-center text-blue-600 bg-blue-50 rounded-xl hover:bg-blue-100 transition">+</button>
                    </div>
                  </div>
                </div>
                <div class="space-y-3">
                  <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">학습목표 및 수행준거</label>
                  <div class="nonncs-objectives space-y-2">
                    <div class="flex gap-2">
                      <input type="text" class="nonncs-obj-item flex-1 px-4 py-2.5 border border-slate-200 rounded-xl text-sm" placeholder="수행기준 입력">
                      <button type="button" class="nonncs-obj-plus w-10 h-10 flex items-center justify-center text-blue-600 bg-blue-50 rounded-xl hover:bg-blue-100 transition">+</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div class="p-5 bg-red-50/50 rounded-2xl border border-red-100 text-xs text-red-600 flex items-start gap-3">
          <i class="fas fa-exclamation-circle mt-0.5"></i>
          <div>
            <p class="font-bold mb-1">교과목 편성 삭제 제한 안내</p>
            <p>4단계(훈련시간 설정) 이후 단계가 진행된 경우 교과목 편성을 수정하거나 삭제할 수 없습니다. 내용을 변경하려면 이후 단계의 데이터를 먼저 삭제해야 합니다.</p>
          </div>
        </div>
      </div>

      <div class="pt-8 flex items-center justify-between border-t border-slate-200">
        <div class="flex gap-3">
          ${isEmbedded
        ? `<a href="/admin/courses/approved" class="h-12 px-6 flex items-center gap-2 border border-slate-200 rounded-2xl bg-white text-slate-600 font-bold text-sm hover:bg-slate-50 transition-all">목록</a>`
        : `<a href="/admin/ncs/approved/list" class="h-12 px-6 flex items-center gap-2 border border-slate-200 rounded-2xl bg-white text-slate-600 font-bold text-sm hover:bg-slate-50 transition-all">목록</a>`
      }
        </div>
        <div class="flex gap-3">
          ${isEmbedded
        ? `<button type="button" onclick="loadNcsStep(2)" class="h-12 px-6 flex items-center gap-2 border border-slate-200 rounded-2xl bg-white text-slate-600 font-bold text-sm hover:bg-slate-50 transition-all"><i class="fas fa-chevron-left text-xs"></i> 2단계 (체계도)</button>`
        : `<a href="/admin/ncs/approved/2${regId ? '?id=' + regId : ''}" class="h-12 px-6 flex items-center gap-2 border border-slate-200 rounded-2xl bg-white text-slate-600 font-bold text-sm hover:bg-slate-50 transition-all"><i class="fas fa-chevron-left text-xs"></i> 2단계 (체계도)</a>`
      }
          <button type="button" id="ncsStep3BtnSave" class="h-12 px-6 bg-white border border-blue-200 text-blue-600 rounded-2xl font-bold text-sm hover:bg-blue-50 transition-all flex items-center gap-2">
            <i class="fas fa-save"></i> 편성 저장
          </button>
          <button type="button" id="ncsStep3BtnNext" class="h-12 px-8 bg-blue-600 text-white rounded-2xl font-bold text-sm hover:bg-blue-700 shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2">
            3단계 완료 후 다음 <i class="fas fa-chevron-right text-xs"></i>
          </button>
        </div>
      </div>
    </div>`;
  }
  if (step === 4) {
    const regId = editId || '';

    // Progress Bar 생성 (Step 4 active)
    const progressBar = `
    <div class="mb-10">
      <div class="flex items-center justify-between relative">
        <div class="absolute top-1/2 left-0 w-full h-1 bg-slate-100 -translate-y-1/2 z-0"></div>
        ${STEP_MENU.map(s => {
      const isActive = s.step === 4;
      const isDone = s.step < 4;
      return `
          <div class="relative z-10 flex flex-col items-center">
            <div class="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all shadow-sm ${isActive ? 'bg-blue-600 text-white ring-4 ring-blue-100' : isDone ? 'bg-blue-100 text-blue-600 border border-blue-200' : 'bg-white text-slate-400 border border-slate-200'}">
              ${isDone ? '<i class="fas fa-check"></i>' : s.step}
            </div>
            <span class="text-[11px] mt-2 font-bold ${isActive ? 'text-blue-600' : isDone ? 'text-blue-500' : 'text-slate-400'} whitespace-nowrap">${s.label}</span>
          </div>
          `;
    }).join('')}
      </div>
    </div>`;

    return `
    <div class="space-y-8" id="ncsApprovedStep4Container">
      ${progressBar}
      <input type="hidden" id="ncsApprovedRegIdStep4" value="${regId}">
      
      <div id="ncsStep4NoReg" class="hidden card p-10 bg-amber-50 border border-amber-200 text-center rounded-3xl">
        <div class="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
          <i class="fas fa-exclamation-triangle"></i>
        </div>
        <h3 class="text-lg font-bold text-amber-900">과정개요가 등록되지 않았습니다</h3>
        <p class="text-amber-700 text-sm mt-2 mb-6">1단계에서 과정개요를 먼저 저장한 뒤 진행해주세요.</p>
        ${isEmbedded
        ? `<button type="button" onclick="loadNcsStep(1)" class="inline-flex items-center gap-2 px-6 py-2.5 bg-amber-600 text-white rounded-xl font-bold text-sm hover:bg-amber-700 transition-all">1단계로 이동 <i class="fas fa-arrow-right"></i></button>`
        : `<a href="/admin/ncs/approved/1${regId ? '?id=' + regId : ''}" class="inline-flex items-center gap-2 px-6 py-2.5 bg-amber-600 text-white rounded-xl font-bold text-sm hover:bg-amber-700 transition-all">1단계로 이동 <i class="fas fa-arrow-right"></i></a>`
      }
      </div>

      <div id="ncsStep4Form" class="space-y-8">
        <section class="card bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
          <div class="px-6 py-5 bg-slate-50 border-b border-slate-200">
            <h2 class="text-lg font-black text-slate-800 tracking-tight">전체 훈련시간 및 비율 설정</h2>
            <p class="text-xs text-slate-500 font-medium">과정 전체의 기간과 정규 교과 비율을 설정합니다.</p>
          </div>
          <div class="p-6 md:p-8 space-y-8">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div class="space-y-2">
                <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">총 훈련일수 <span class="text-red-500">*</span></label>
                <div class="relative">
                  <input type="number" id="ncsStep4TotalDays" min="0" class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 font-bold" value="20">
                  <span class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">일</span>
                </div>
              </div>
              <div class="space-y-2">
                <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">일일 훈련시간 <span class="text-red-500">*</span></label>
                <div class="relative">
                  <input type="number" id="ncsStep4DailyHours" min="0" step="0.1" class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 font-bold" value="5">
                  <span class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">시간</span>
                </div>
              </div>
              <div class="space-y-2">
                <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">총 훈련시간</label>
                <div class="relative">
                  <input type="number" id="ncsStep4TotalHours" min="0" class="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-xl text-sm text-slate-600 font-black" value="100">
                  <span class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">시간</span>
                </div>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-slate-100 pt-8">
              <div class="space-y-3">
                <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">NCS 소양 비율 (%)</label>
                <div class="flex items-center gap-2">
                  <input type="number" id="ncsStep4LibPct" min="0" max="100" step="0.01" class="flex-1 px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold" value="0">
                  <span class="text-slate-400 font-bold text-sm">%</span>
                </div>
                <div class="flex items-center justify-between">
                  <label class="flex items-center gap-2 text-[11px] font-bold text-slate-500 cursor-pointer">
                    <input type="checkbox" id="ncsStep4LibForce" class="rounded text-blue-600"> 수동 입력
                  </label>
                  <span id="ncsStep4LibHours" class="text-[11px] font-black text-blue-600">0 시간</span>
                </div>
              </div>
              <div class="space-y-3">
                <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">NCS 전공 비율 (%)</label>
                <div class="flex items-center gap-2">
                  <input type="number" id="ncsStep4MajorPct" min="0" max="100" step="0.01" class="flex-1 px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold" value="0">
                  <span class="text-slate-400 font-bold text-sm">%</span>
                </div>
                <div class="text-right">
                  <span id="ncsStep4MajorHours" class="text-[11px] font-black text-blue-600">0 시간</span>
                </div>
              </div>
              <div class="space-y-3">
                <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">비NCS 비율 (%)</label>
                <div class="flex items-center gap-2">
                  <input type="number" id="ncsStep4NonPct" min="0" max="100" step="0.01" class="flex-1 px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold" value="0">
                  <span class="text-slate-400 font-bold text-sm">%</span>
                </div>
                <div class="text-right">
                  <span id="ncsStep4NonHours" class="text-[11px] font-black text-blue-600">0 시간</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section class="card bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
          <div class="px-6 py-5 bg-slate-50 border-b border-slate-200 flex flex-wrap justify-between items-center gap-4">
            <div>
              <h2 class="text-lg font-black text-slate-800 tracking-tight">과목별 상세 시간 배정</h2>
              <div class="flex items-center gap-3 mt-1">
                <span id="ncsStep4CalculatedApplied" class="text-xs font-bold text-blue-600">0 / 0 시간 배정됨</span>
                <span class="w-1 h-1 bg-slate-300 rounded-full"></span>
                <span id="ncsStep4PercentText" class="text-xs font-bold text-blue-500">배정률 0%</span>
              </div>
            </div>
            <div class="flex bg-slate-200/50 p-1 rounded-xl">
              <button type="button" class="ncs-step4-tab px-4 py-2 rounded-lg text-xs font-bold transition-all bg-white text-blue-600 shadow-sm" data-tab="ncs">NCS 교과</button>
              <button type="button" class="ncs-step4-tab px-4 py-2 rounded-lg text-xs font-bold transition-all text-slate-500 hover:text-slate-700" data-tab="basic">직업기초</button>
              <button type="button" class="ncs-step4-tab px-4 py-2 rounded-lg text-xs font-bold transition-all text-slate-500 hover:text-slate-700" data-tab="nonncs">비NCS 교과</button>
            </div>
          </div>
          
          <div class="p-6">
            <div id="ncsStep4TabContentNcs" class="ncs-step4-tab-content space-y-4">
              <div id="ncsStep4NcsSubjectList" class="grid grid-cols-1 gap-4"></div>
            </div>
            <div id="ncsStep4TabContentBasic" class="ncs-step4-tab-content hidden space-y-4">
              <div id="ncsStep4BasicSubjectList" class="grid grid-cols-1 gap-4"></div>
            </div>
            <div id="ncsStep4TabContentNonncs" class="ncs-step4-tab-content hidden space-y-4">
              <div id="ncsStep4NonncsSubjectList" class="grid grid-cols-1 gap-4"></div>
            </div>
          </div>

          <div class="overflow-x-auto border-t border-slate-100 min-h-[200px]">
            <table class="w-full text-left text-sm border-collapse">
              <thead class="bg-slate-50/50 border-b border-slate-200">
                <tr>
                  <th class="px-6 py-4 font-bold text-slate-500 uppercase tracking-wider w-16 text-center">No.</th>
                  <th class="px-6 py-4 font-bold text-slate-500 uppercase tracking-wider">교과목명</th>
                  <th class="px-6 py-4 font-bold text-slate-500 uppercase tracking-wider w-28 text-center">이론(H)</th>
                  <th class="px-6 py-4 font-bold text-slate-500 uppercase tracking-wider w-28 text-center">실습(H)</th>
                  <th class="px-6 py-4 font-bold text-slate-500 uppercase tracking-wider w-28 text-center">합계</th>
                </tr>
              </thead>
              <tbody id="ncsStep4HoursBody" class="divide-y divide-slate-100 bg-white"></tbody>
              <tfoot id="ncsStep4HoursFoot" class="bg-slate-50 border-t-2 border-slate-200 hidden">
                <tr class="font-black text-slate-800">
                  <td colspan="2" class="px-6 py-4 text-right pr-10">총 배정 합계</td>
                  <td id="ncsStep4TotalTheory" class="px-6 py-4 text-center">0</td>
                  <td id="ncsStep4TotalPractice" class="px-6 py-4 text-center">0</td>
                  <td id="ncsStep4TotalSum" class="px-6 py-4 text-center text-blue-600">0</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </section>

        <div class="p-5 bg-blue-50/50 rounded-2xl border border-blue-100 text-xs text-blue-600 flex items-start gap-3">
          <i class="fas fa-info-circle mt-0.5"></i>
          <div>
            <p class="font-bold mb-1">훈련시간 비율 준수 안내</p>
            <p>훈련과정 유형별 (국기, 전략, 일반 등) NCS 전공교과 최소 편성 비중을 준수해야 합니다. 총 배정 시간이 계산된 총 훈련시간과 일치해야 다음 단계로 진행이 가능합니다.</p>
          </div>
        </div>
      </div>

      <div class="pt-8 flex items-center justify-between border-t border-slate-200">
        <div class="flex gap-3">
          ${isEmbedded
        ? `<a href="/admin/courses/approved" class="h-12 px-6 flex items-center gap-2 border border-slate-200 rounded-2xl bg-white text-slate-600 font-bold text-sm hover:bg-slate-50 transition-all">목록</a>`
        : `<a href="/admin/ncs/approved/list" class="h-12 px-6 flex items-center gap-2 border border-slate-200 rounded-2xl bg-white text-slate-600 font-bold text-sm hover:bg-slate-50 transition-all">목록</a>`
      }
        </div>
        <div class="flex gap-3">
          ${isEmbedded
        ? `<button type="button" onclick="loadNcsStep(3)" class="h-12 px-6 flex items-center gap-2 border border-slate-200 rounded-2xl bg-white text-slate-600 font-bold text-sm hover:bg-slate-50 transition-all"><i class="fas fa-chevron-left text-xs"></i> 3단계 (편성)</button>`
        : `<a href="/admin/ncs/approved/3${regId ? '?id=' + regId : ''}" class="h-12 px-6 flex items-center gap-2 border border-slate-200 rounded-2xl bg-white text-slate-600 font-bold text-sm hover:bg-slate-50 transition-all"><i class="fas fa-chevron-left text-xs"></i> 3단계 (편성)</a>`
      }
          <button type="button" id="ncsStep4BtnSave" class="h-12 px-6 bg-white border border-blue-200 text-blue-600 rounded-2xl font-bold text-sm hover:bg-blue-50 transition-all flex items-center gap-2">
            <i class="fas fa-save"></i> 설정 저장
          </button>
          <button type="button" id="ncsStep4BtnNext" class="h-12 px-8 bg-blue-600 text-white rounded-2xl font-bold text-sm hover:bg-blue-700 shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2">
            저장 후 다음단계 <i class="fas fa-chevron-right text-xs"></i>
          </button>
        </div>
      </div>
    </div>`;
  }
  if (step === 5) {
    const regId = editId || '';

    // Progress Bar 생성 (Step 5 active)
    const progressBar = `
    <div class="mb-10">
      <div class="flex items-center justify-between relative">
        <div class="absolute top-1/2 left-0 w-full h-1 bg-slate-100 -translate-y-1/2 z-0"></div>
        ${STEP_MENU.map(s => {
      const isActive = s.step === 5;
      const isDone = s.step < 5;
      return `
          <div class="relative z-10 flex flex-col items-center">
            <div class="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all shadow-sm ${isActive ? 'bg-blue-600 text-white ring-4 ring-blue-100' : isDone ? 'bg-blue-100 text-blue-600 border border-blue-200' : 'bg-white text-slate-400 border border-slate-200'}">
              ${isDone ? '<i class="fas fa-check"></i>' : s.step}
            </div>
            <span class="text-[11px] mt-2 font-bold ${isActive ? 'text-blue-600' : isDone ? 'text-blue-500' : 'text-slate-400'} whitespace-nowrap">${s.label}</span>
          </div>
          `;
    }).join('')}
      </div>
    </div>`;

    return `
    <div class="space-y-8" id="ncsApprovedStep5Container">
      ${progressBar}
      <input type="hidden" id="ncsApprovedRegIdStep5" value="${regId}">
      
      <div id="ncsStep5NoReg" class="hidden card p-10 bg-amber-50 border border-amber-200 text-center rounded-3xl">
        <div class="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
          <i class="fas fa-exclamation-triangle"></i>
        </div>
        <h3 class="text-lg font-bold text-amber-900">과정개요가 등록되지 않았습니다</h3>
        <p class="text-amber-700 text-sm mt-2 mb-6">1단계에서 과정개요를 먼저 저장한 뒤 진행해주세요.</p>
        ${isEmbedded
        ? `<button type="button" onclick="loadNcsStep(1)" class="inline-flex items-center gap-2 px-6 py-2.5 bg-amber-600 text-white rounded-xl font-bold text-sm hover:bg-amber-700 transition-all">1단계로 이동 <i class="fas fa-arrow-right"></i></button>`
        : `<a href="/admin/ncs/approved/1${regId ? '?id=' + regId : ''}" class="inline-flex items-center gap-2 px-6 py-2.5 bg-amber-600 text-white rounded-xl font-bold text-sm hover:bg-amber-700 transition-all">1단계로 이동 <i class="fas fa-arrow-right"></i></a>`
      }
      </div>

      <div id="ncsStep5Form" class="space-y-8">
        <div class="px-6 py-4 bg-blue-50 border border-blue-100 rounded-2xl flex items-center gap-4">
           <div class="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center flex-shrink-0">
              <i class="fas fa-info"></i>
           </div>
           <p class="text-xs text-blue-700 leading-relaxed font-medium">
             각 교과목별 <span class="font-bold underline">평가 도구(지필, 실기 등)</span>와 <span class="font-bold underline">교수학습 방법(강의, 토론, 실습 등)</span>을 설정합니다. 
             NCS 전공교과의 경우 직무 수행능력 평가 기준이 자동으로 연계됩니다.
           </p>
        </div>

        <!-- NCS 소양교과 섹션 -->
        <section class="card bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
          <button type="button" class="w-full px-8 py-5 bg-slate-50 border-b border-slate-200 flex justify-between items-center group transition-all" onclick="const section = document.getElementById('sectionNcsLib'); section.classList.toggle('hidden'); const icon = this.querySelector('.toggle-icon'); icon.style.transform = section.classList.contains('hidden') ? 'rotate(180deg)' : '';">
            <div class="text-left">
              <h2 class="text-lg font-black text-slate-800 tracking-tight">NCS 소양 교과 (직업기초능력)</h2>
              <p class="text-xs text-slate-500 font-medium">의사소통, 문제해결 등 기초 역량에 대한 평가를 설정합니다.</p>
            </div>
            <i class="fas fa-chevron-up toggle-icon text-slate-400 group-hover:text-blue-600 transition-all"></i>
          </button>
          <div id="sectionNcsLib" class="p-8 space-y-6">
            <p class="text-center text-slate-300 py-12 text-sm italic">구성된 교과목이 없습니다.</p>
          </div>
        </section>

        <!-- NCS 전공교과 섹션 -->
        <section class="card bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
          <button type="button" class="w-full px-8 py-5 bg-slate-50 border-b border-slate-200 flex justify-between items-center group transition-all" onclick="const section = document.getElementById('sectionNcsMajor'); section.classList.toggle('hidden'); const icon = this.querySelector('.toggle-icon'); icon.style.transform = section.classList.contains('hidden') ? 'rotate(180deg)' : '';">
            <div class="text-left">
              <h2 class="text-lg font-black text-slate-800 tracking-tight">NCS 전공 교과</h2>
              <p class="text-xs text-slate-500 font-medium">능력단위별 수행준거에 기반한 전문적인 평가 방법을 설정합니다.</p>
            </div>
            <i class="fas fa-chevron-up toggle-icon text-slate-400 group-hover:text-blue-600 transition-all"></i>
          </button>
          <div id="sectionNcsMajor" class="p-8 space-y-6">
            <p class="text-center text-slate-300 py-12 text-sm italic">구성된 교과목이 없습니다.</p>
          </div>
        </section>

        <!-- 비 NCS 교과 섹션 -->
        <section class="card bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
          <button type="button" class="w-full px-8 py-5 bg-slate-50 border-b border-slate-200 flex justify-between items-center group transition-all" onclick="const section = document.getElementById('sectionNonNcs'); section.classList.toggle('hidden'); const icon = this.querySelector('.toggle-icon'); icon.style.transform = section.classList.contains('hidden') ? 'rotate(180deg)' : '';">
            <div class="text-left">
              <h2 class="text-lg font-black text-slate-800 tracking-tight">비 NCS / 일반 교과</h2>
              <p class="text-xs text-slate-500 font-medium">기타 전공 지식 및 소양에 대한 평가 방법을 설정합니다.</p>
            </div>
            <i class="fas fa-chevron-up toggle-icon text-slate-400 group-hover:text-blue-600 transition-all"></i>
          </button>
          <div id="sectionNonNcs" class="p-8 space-y-6">
            <p class="text-center text-slate-300 py-12 text-sm italic">구성된 교과목이 없습니다.</p>
          </div>
        </section>
      </div>

      <div class="pt-8 flex items-center justify-between border-t border-slate-200">
        <div class="flex gap-3">
          ${isEmbedded
        ? `<a href="/admin/courses/approved" class="h-12 px-6 flex items-center gap-2 border border-slate-200 rounded-2xl bg-white text-slate-600 font-bold text-sm hover:bg-slate-50 transition-all">목록</a>`
        : `<a href="/admin/ncs/approved/list" class="h-12 px-6 flex items-center gap-2 border border-slate-200 rounded-2xl bg-white text-slate-600 font-bold text-sm hover:bg-slate-50 transition-all">목록</a>`
      }
        </div>
        <div class="flex gap-3">
          ${isEmbedded
        ? `<button type="button" onclick="loadNcsStep(4)" class="h-12 px-6 flex items-center gap-2 border border-slate-200 rounded-2xl bg-white text-slate-600 font-bold text-sm hover:bg-slate-50 transition-all"><i class="fas fa-chevron-left text-xs"></i> 4단계 (시간)</button>`
        : `<a href="/admin/ncs/approved/4${regId ? '?id=' + regId : ''}" class="h-12 px-6 flex items-center gap-2 border border-slate-200 rounded-2xl bg-white text-slate-600 font-bold text-sm hover:bg-slate-50 transition-all"><i class="fas fa-chevron-left text-xs"></i> 4단계 (시간)</a>`
      }
          <button type="button" id="ncsStep5BtnSave" class="h-12 px-6 bg-white border border-blue-200 text-blue-600 rounded-2xl font-bold text-sm hover:bg-blue-50 transition-all flex items-center gap-2">
            <i class="fas fa-save"></i> 설정 저장
          </button>
          <button type="button" id="ncsStep5BtnNext" class="h-12 px-8 bg-blue-600 text-white rounded-2xl font-bold text-sm hover:bg-blue-700 shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2">
            저장 후 다음단계 <i class="fas fa-chevron-right text-xs"></i>
          </button>
        </div>
      </div>
    </div>`;
  }

  if (step === 6) {
    const regId = editId || '';

    // Progress Bar 생성 (Step 6 active)
    const progressBar = `
    <div class="mb-10">
      <div class="flex items-center justify-between relative">
        <div class="absolute top-1/2 left-0 w-full h-1 bg-slate-100 -translate-y-1/2 z-0"></div>
        ${STEP_MENU.map(s => {
      const isActive = s.step === 6;
      const isDone = s.step < 6;
      return `
          <div class="relative z-10 flex flex-col items-center">
            <div class="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all shadow-sm ${isActive ? 'bg-blue-600 text-white ring-4 ring-blue-100' : isDone ? 'bg-blue-100 text-blue-600 border border-blue-200' : 'bg-white text-slate-400 border border-slate-200'}">
              ${isActive ? '<i class="fas fa-flag-checkered"></i>' : isDone ? '<i class="fas fa-check"></i>' : s.step}
            </div>
            <span class="text-[11px] mt-2 font-bold ${isActive ? 'text-blue-600' : isDone ? 'text-blue-500' : 'text-slate-400'} whitespace-nowrap">${s.label}</span>
          </div>
          `;
    }).join('')}
      </div>
    </div>`;

    return `
    <div class="space-y-8" id="ncsApprovedStep6Container">
      ${progressBar}
      <input type="hidden" id="ncsApprovedRegIdStep6" value="${regId}">

      <div class="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 text-white shadow-xl shadow-blue-500/20 relative overflow-hidden">
        <div class="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
        <div class="relative z-10">
          <div class="flex items-center gap-4 mb-4">
             <div class="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-xl">
               <i class="fas fa-tools"></i>
             </div>
             <div>
               <h2 class="text-2xl font-black tracking-tight leading-tight">시설 및 장비 매칭</h2>
               <p class="text-blue-100 text-sm font-medium mt-1 uppercase tracking-wider">Final Step: Infrastructure Alignment</p>
             </div>
          </div>
          <p class="text-blue-50 text-sm leading-relaxed max-w-2xl opacity-90">
            각 교과목(능력단위) 수행에 필요한 <span class="font-bold border-b border-blue-300">시설(강의실, 실습실)</span>과 
            <span class="font-bold border-b border-blue-300">장비/기자재</span>를 매칭합니다. HRD-Net 승인 기준에 맞춰 적절한 자원을 배정해 주세요.
          </p>
        </div>
      </div>

      <div id="ncsStep6Form" class="space-y-12">
        <!-- 과목별 시설/장비 매칭 영역 (JS에서 동적으로 렌더링) -->
        <div class="flex flex-col items-center justify-center py-20 bg-white border border-dashed border-slate-300 rounded-[2.5rem]">
           <div class="w-20 h-20 bg-slate-50 text-slate-200 rounded-full flex items-center justify-center text-4xl mb-6">
             <i class="fas fa-layer-group"></i>
           </div>
           <p class="text-slate-400 font-bold tracking-tight">매칭 정보를 불러오는 중입니다...</p>
           <p class="text-slate-300 text-xs mt-2">잠시만 기다려 주세요.</p>
        </div>
      </div>

      <div class="pt-8 flex items-center justify-between border-t border-slate-200">
        <div class="flex gap-3">
          ${isEmbedded
        ? `<a href="/admin/courses/approved" class="h-12 px-6 flex items-center gap-2 border border-slate-200 rounded-2xl bg-white text-slate-600 font-bold text-sm hover:bg-slate-50 transition-all">목록</a>`
        : `<a href="/admin/ncs/approved/list" class="h-12 px-6 flex items-center gap-2 border border-slate-200 rounded-2xl bg-white text-slate-600 font-bold text-sm hover:bg-slate-50 transition-all">목록</a>`
      }
        </div>
        <div class="flex gap-3">
          ${isEmbedded
        ? `<button type="button" onclick="loadNcsStep(5)" class="h-12 px-6 flex items-center gap-2 border border-slate-200 rounded-2xl bg-white text-slate-600 font-bold text-sm hover:bg-slate-50 transition-all"><i class="fas fa-chevron-left text-xs"></i> 5단계 (평가)</button>`
        : `<a href="/admin/ncs/approved/5${regId ? '?id=' + regId : ''}" class="h-12 px-6 flex items-center gap-2 border border-slate-200 rounded-2xl bg-white text-slate-600 font-bold text-sm hover:bg-slate-50 transition-all"><i class="fas fa-chevron-left text-xs"></i> 5단계 (평가)</a>`
      }
          <button type="button" id="ncsStep6BtnSave" class="h-12 px-6 bg-white border border-blue-200 text-blue-600 rounded-2xl font-bold text-sm hover:bg-blue-50 transition-all flex items-center gap-2">
            <i class="fas fa-save"></i> 설정 저장
          </button>
          <button type="button" id="ncsStep6BtnNext" class="h-12 px-10 bg-slate-900 text-white rounded-2xl font-bold text-sm hover:bg-black shadow-lg shadow-slate-900/20 transition-all flex items-center gap-2">
            설정 완료 및 등록 <i class="fas fa-check-circle"></i>
          </button>
        </div>
      </div>
    </div>`;
  }
  return '<p class="text-slate-500 p-10 text-center font-bold">잘못된 단계이거나 데이터를 불러올 수 없습니다. <br><span class="text-xs font-normal opacity-50">Step: ' + step + '</span></p>';
}

// 공통 스타일 정의
const NCS_COMMON_STYLES = `
<style>
  .card { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
  .card:hover { transform: translateY(-2px); box-shadow: 0 12px 20px -8px rgba(0,0,0,0.1); }
  
  /* Dual List Styles */
  .dual-list-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
    margin-top: 1rem;
  }
  .list-box-wrapper {
    border: 1px solid #e2e8f0;
    border-radius: 1.25rem;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    background: #fff;
  }
  .list-box-header {
    background: #f8fafc;
    padding: 0.875rem 1.25rem;
    font-weight: 800;
    font-size: 0.75rem;
    color: #475569;
    border-bottom: 1px solid #e2e8f0;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  .list-content {
    height: 240px;
    overflow-y: auto;
    padding: 0.5rem;
  }
  .list-item {
    padding: 0.75rem 1rem;
    font-size: 0.875rem;
    color: #334155;
    border-radius: 0.75rem;
    cursor: pointer;
    margin-bottom: 0.25rem;
    transition: all 0.2s;
    font-weight: 500;
  }
  .list-item:hover { background: #f1f5f9; color: #1e293b; }
  .list-item.selected { background: #eff6ff; color: #2563eb; font-weight: 700; box-shadow: inset 0 0 0 1px #bfdbfe; }
  
  /* Form Elements */
  input[type="number"], input[type="text"], select, textarea {
    transition: all 0.2s;
  }
  input[type="number"]:focus, input[type="text"]:focus, select:focus, textarea:focus {
    border-color: #3b82f6;
    ring: 2px;
    ring-color: #dbeafe;
    outline: none;
  }
</style>
`;

export function adminNcsApprovedHtml(stepParam?: string, editId?: string): string {
  const step = Math.min(6, Math.max(1, parseInt(stepParam || '1', 10) || 1));
  const stepNav = stepNavHtml(step, editId);
  const content = stepContentHtml(step, editId);
  return `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>승인받은 NCS 등록 - ${step}. ${STEP_MENU[step - 1].label}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Noto Sans KR', sans-serif; }
        .ncs-class-select { max-height: 280px; overflow-y: auto; }
        .ncs-class-select::-webkit-scrollbar { width: 6px; }
        .ncs-class-select::-webkit-scrollbar-track { background: #f1f5f9; border-radius: 3px; }
        .ncs-class-select::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 3px; }
    </style>
    ${NCS_COMMON_STYLES}
</head>
<body class="bg-slate-50">
    <div class="flex min-h-screen">
        ${hrdSidebar('ncs-approved')}
        <main class="flex-1 overflow-x-hidden overflow-y-auto">
            <header class="bg-white shadow-sm sticky top-0 z-10 border-b border-slate-200">
                <div class="px-8 py-4 flex flex-wrap justify-between items-center gap-4">
                    <div>
                        <p class="text-xs font-bold text-slate-500 uppercase tracking-wider">NCS 훈련과정 승인정보</p>
                        <h1 class="text-xl font-black text-slate-800 mt-0.5">승인받은 NCS 등록 — ${step}. ${STEP_MENU[step - 1].label}</h1>
                        <p class="text-sm text-slate-600 mt-1">단계별로 승인 NCS 정보를 등록합니다.</p>
                    </div>
                    <a href="/admin/ncs/approved/list" class="px-5 py-2.5 text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 font-bold text-sm transition flex items-center gap-2 shrink-0">
                        <i class="fas fa-list-ul"></i> 저장된 목록
                    </a>
                </div>
            </header>
            <div class="flex">
                <nav class="w-56 flex-shrink-0 bg-white border-r border-slate-200 min-h-[calc(100vh-8rem)] py-4">
                    <div class="px-3 space-y-1">
                        ${stepNav}
                    </div>
                </nav>
                <div class="flex-1 p-8">
                    <div class="bg-white rounded-[2rem] shadow-sm border border-slate-200/60 overflow-hidden">
                        <div class="px-6 py-4 border-b border-slate-200/60 bg-slate-50/80">
                            <h2 class="font-black text-slate-800 tracking-tight">${STEP_MENU[step - 1].label}</h2>
                        </div>
                        <div class="p-6 md:p-8" id="ncsApprovedStepContent">
                            ${content}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </div>
    <script>
        window.NCS_APPROVED_STEP = ${step};
    </script>
    <script src="/static/ncs-approved.js"></script>
</body>
</html>`;
}

/**
 * 과정 등록 페이지 내에 임베딩하기 위한 HTML 생성 함수
 * @param courseId 승인받은 과정 ID (1단계 기본정보 저장 후 생성된 ID)
 */
// Update signature and implementation
export function adminNcsEmbedHtml(courseId: string, initialStep: number = 1): string {
  // 1단계(과정개요)부터 시작. 
  // 실제로는 JS에서 탭 전환 시 동적으로 콘텐츠를 로드하거나, 
  // 혹은 여기서 전체 구조를 잡아주고 JS가 보여주는 방식을 쓸 수 있음.
  // 여기서는 기본 구조(사이드바 + 콘텐츠 영역)를 렌더링함.

  // 임베디드 모드에서는 step 1 콘텐츠를 바로 로드 (or initialStep)
  const step = initialStep;
  const stepNav = STEP_MENU.map(
    (s) => `
        <button type="button" onclick="loadNcsStep(${s.step})" id="ncsStepLink_${s.step}" class="w-full flex items-center px-4 py-3 rounded-xl transition-all mb-1 ${step === s.step ? 'bg-blue-600/10 text-blue-700 font-bold' : 'hover:bg-slate-50 text-slate-500 hover:text-slate-700'}">
          <i class="fas ${s.icon} w-6 text-lg mr-2 opacity-80"></i>
          <span class="text-sm">${s.step}. ${s.label}</span>
        </button>`
  ).join('');

  // 초기 로딩 시 Step 콘텐츠 렌더링 (isEmbedded = true, courseId 전달)
  // editId는 NCS 등록 정보의 ID인데, 초기에는 없을 수 있음. 
  // 하지만 stepContentHtml은 UI 구조를 그리는 것이므로 일단 빈 문자열로 넘기고, JS에서 로드 시 채워넣도록 함.
  const content = stepContentHtml(step, '', true, courseId);

  return `
    <div class="flex flex-col lg:flex-row gap-6 h-full min-h-[600px]">
        <!-- NCS Steps Sidebar -->
        <nav class="w-full lg:w-56 flex-shrink-0">
            <div class="bg-white rounded-2xl border border-slate-200 p-3 sticky top-4">
                <div class="px-2 py-2 mb-2 border-b border-slate-100">
                    <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">NCS 설계 단계</span>
                </div>
                ${stepNav}
            </div>
        </nav>

        <!-- NCS Content Area -->
        <div class="flex-1 min-w-0">
             <div class="bg-white rounded-2xl border border-slate-200 p-6 relative">
                <div id="ncsContentLoader" class="absolute inset-0 bg-white/80 z-20 flex items-center justify-center hidden">
                     <div class="text-center">
                        <i class="fas fa-spinner fa-spin text-3xl text-blue-600 mb-2"></i>
                        <p class="text-slate-500 text-sm font-bold">데이터 로딩 중...</p>
                     </div>
                </div>
                <div id="ncsApprovedStepContent">
                    ${content}
                </div>
            </div>
        </div>
    </div>
    
    <!-- NCS 관련 JS 로직 (임베디드용) -->
    <script>
        // 전역 변수로 현재 과정 ID, Step 설정 (재선언 방지를 위해 var 사용)
        var NCS_EMBED_COURSE_ID = "${courseId}";
        var NCS_CURRENT_STEP = ${step};
        window.NCS_EMBED_COURSE_ID = NCS_EMBED_COURSE_ID;
        window.NCS_CURRENT_STEP = NCS_CURRENT_STEP;
    </script>
    `;
}

export function adminNcsApprovedListHtml(): string {
  return `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>승인받은 NCS 등록 — 저장된 등록 목록</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700&display=swap" rel="stylesheet">
    <style>body { font-family: 'Noto Sans KR', sans-serif; }</style>
</head>
<body class="bg-slate-50">
    <div class="flex min-h-screen">
        ${hrdSidebar('ncs-approved-list')}
        <main class="flex-1 overflow-x-hidden overflow-y-auto">
            <header class="bg-white shadow-sm sticky top-0 z-10 border-b border-slate-200">
                <div class="px-8 py-4 flex flex-wrap justify-between items-center gap-4">
                    <div>
                        <p class="text-xs font-bold text-slate-500 uppercase tracking-wider">NCS 훈련과정 승인정보</p>
                        <h1 class="text-xl font-black text-slate-800 mt-0.5">승인받은 NCS 등록 — 저장된 등록 목록</h1>
                        <p class="text-sm text-slate-600 mt-1">등록된 과정개요를 조회·수정·삭제합니다.</p>
                    </div>
                    <a href="/admin/ncs/approved/1" class="px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-bold text-sm transition flex items-center gap-2">
                        <i class="fas fa-plus"></i> 과정개요 등록
                    </a>
                </div>
            </header>
            <div class="p-8">
                <div class="bg-white rounded-[2rem] shadow-sm border border-slate-200/60 overflow-hidden">
                    <div class="overflow-x-auto">
                        <table class="w-full text-sm text-left min-w-[640px]">
                            <thead class="bg-slate-50/80 text-slate-500 font-bold text-xs uppercase tracking-wider">
                                <tr>
                                    <th class="px-4 py-3 w-12">No</th>
                                    <th class="px-4 py-3">유형</th>
                                    <th class="px-4 py-3">주직종 / 과정명</th>
                                    <th class="px-4 py-3 w-28">등록일</th>
                                    <th class="px-4 py-3 w-36 text-right">관리</th>
                                </tr>
                            </thead>
                            <tbody id="ncsApprovedListBody" class="divide-y divide-slate-100">
                                <tr><td colspan="5" class="px-4 py-8 text-center text-slate-400"><i class="fas fa-spinner fa-spin mr-2"></i> 로딩 중...</td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </main>
    </div>
    <script src="/static/ncs-approved-list.js"></script>
</body>
</html>`;
}
