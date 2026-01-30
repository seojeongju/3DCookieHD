import { hrdSidebar } from './components/hrd_sidebar';

const STEP_MENU = [
  { step: 1, label: '과정개요', icon: 'fa-list-alt' },
  { step: 2, label: '훈련이수체계도', icon: 'fa-sitemap' },
  { step: 3, label: '교과목편성', icon: 'fa-book' },
  { step: 4, label: '훈련시간설정', icon: 'fa-clock' },
  { step: 5, label: '평가·교수학습 방법', icon: 'fa-chalkboard-teacher' },
  { step: 6, label: '시설·장비', icon: 'fa-building' },
];

function stepNavHtml(currentStep: number): string {
  return STEP_MENU.map(
    (s) => `
    <a href="/admin/ncs/approved/${s.step}" class="flex items-center px-4 py-3 rounded-xl transition-all ${currentStep === s.step ? 'bg-blue-600/20 text-white border-l-4 border-blue-500' : 'hover:bg-slate-800/50 text-slate-400 hover:text-white'}">
      <i class="fas ${s.icon} w-6 text-lg mr-3"></i>
      <span class="font-medium text-sm">${s.step}. ${s.label}</span>
    </a>`
  ).join('');
}

function stepContentHtml(step: number, editId?: string): string {
  if (step === 1) {
    const isEdit = !!editId;
    return `
    <div class="space-y-6" id="ncsApprovedFormContainer">
      <input type="hidden" id="ncsApprovedEditId" value="${editId || ''}">
      <input type="hidden" id="ncsUnitCode" value="">
      <input type="hidden" id="ncsUnitName" value="">
      <p class="text-xs text-slate-500">등록되는 직종 및 주직종으로 이후에 등록되는 내용에 활용됩니다.</p>
      <!-- 탭: NCS 훈련과정 전용 / 비NCS 훈련과정 전용 -->
      <div class="flex gap-2 border-b border-slate-200 pb-2">
        <button type="button" id="tabNcsOnly" class="ncs-approved-tab px-4 py-2 rounded-t-lg font-bold text-sm bg-emerald-600 text-white">NCS 훈련과정 전용</button>
        <button type="button" id="tabNonNcs" class="ncs-approved-tab px-4 py-2 rounded-t-lg font-bold text-sm bg-slate-100 text-slate-600 hover:bg-slate-200">비NCS 훈련과정 전용</button>
      </div>
      <!-- NCS 훈련과정 전용 패널 -->
      <div id="panelNcsOnly" class="ncs-approved-panel space-y-6">
        <div>
          <h3 class="text-sm font-bold text-slate-700 mb-2">개발분류선택</h3>
          <select id="ncsDevCategory" class="w-full max-w-md px-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500">
            <option value="">선택</option>
            <option value="24">24년 NCS기반 훈련기준(1083직종)</option>
            <option value="23">23년 NCS기반 훈련기준(1039직종)</option>
            <option value="21">21년 NCS기반 훈련기준(1039직종)</option>
            <option value="20">20년 NCS기반 훈련기준(1022직종)</option>
            <option value="19">19년 NCS기반 훈련기준(1001직종)</option>
          </select>
        </div>
        <div>
          <h3 class="text-sm font-bold text-slate-700 mb-2">훈련직종 검색</h3>
          <p class="text-xs text-slate-500 mb-2">훈련직종을 선택하여 소분류까지 검색해주세요.</p>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label class="block text-xs font-medium text-slate-600 mb-1">대분류선택</label>
              <select id="ncsLargeClass" class="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20"></select>
            </div>
            <div>
              <label class="block text-xs font-medium text-slate-600 mb-1">중분류선택</label>
              <select id="ncsMidClass" class="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20"></select>
            </div>
            <div>
              <label class="block text-xs font-medium text-slate-600 mb-1">소분류선택</label>
              <select id="ncsSmallClass" class="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20"></select>
            </div>
          </div>
        </div>
        <div>
          <h3 class="text-sm font-bold text-slate-700 mb-2">과정개요 정보 <span class="text-red-500">(! 필수등록)</span></h3>
          <p class="text-xs text-slate-500 mb-3">선택된 직종으로 과정개요를 등록해주세요.</p>
          <div class="space-y-4">
            <div>
              <label class="block text-xs font-medium text-slate-600 mb-1">과정편성분류</label>
              <div class="flex gap-4">
                <label class="flex items-center gap-2 text-sm"><input type="radio" name="courseType" value="양성" class="rounded text-blue-600"> 양성과정</label>
                <label class="flex items-center gap-2 text-sm"><input type="radio" name="courseType" value="향상" checked class="rounded text-blue-600"> 향상과정</label>
              </div>
              <p class="text-xs text-slate-500 mt-1">실업자 대상인 경우 양성과정, 재직자 대상인 경우 향상과정을 선택하시면 됩니다.</p>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-medium text-slate-600 mb-1">직종선택</label>
                <select id="ncsJobSelect" size="6" class="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"></select>
                <p class="text-xs text-slate-500 mt-1">소분류 선택 후 직종을 선택하세요.</p>
              </div>
              <div>
                <label class="block text-xs font-medium text-slate-600 mb-1">추가된 직종 및 주직종</label>
                <div id="ncsMainJobPill" class="min-h-[2.5rem] px-4 py-3 border border-slate-200 rounded-xl bg-slate-50/50 text-sm flex flex-wrap items-center gap-2">
                  <span id="ncsMainJobPlaceholder" class="text-slate-400">직종을 검색하여 선택하세요</span>
                </div>
              </div>
            </div>
            <div>
              <label class="block text-xs font-medium text-slate-600 mb-1">과정명</label>
              <input type="text" id="ncsCourseName" class="w-full max-w-md px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" placeholder="과정명 입력">
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-medium text-slate-600 mb-1">훈련수준</label>
                <select id="ncsTrainingLevel" class="w-full max-w-xs px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500">
                  <option value="">선택</option>
                  <option value="1">1 수준</option>
                  <option value="2">2 수준</option>
                  <option value="3">3 수준</option>
                  <option value="4">4 수준</option>
                  <option value="5">5 수준</option>
                </select>
              </div>
              <div>
                <label class="block text-xs font-medium text-slate-600 mb-1">등록일</label>
                <input type="text" id="ncsRegDate" readonly class="w-full max-w-xs px-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-slate-50" placeholder="—">
              </div>
            </div>
            <div>
              <label class="block text-xs font-medium text-slate-600 mb-1">선수능력</label>
              <textarea id="ncsPrereqSkill" rows="3" class="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" placeholder="선수능력 입력"></textarea>
            </div>
            <div>
              <label class="block text-xs font-medium text-slate-600 mb-1">내용추가</label>
              <textarea id="ncsOverviewContent" rows="4" class="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" placeholder="과정개요 추가 내용을 입력하세요"></textarea>
              <p class="text-xs text-slate-500 mt-1">과정개요 보충 설명, 유의사항 등을 자유롭게 입력할 수 있습니다.</p>
            </div>
          </div>
        </div>
      </div>
      <!-- 비NCS 훈련과정 전용 패널 -->
      <div id="panelNonNcs" class="ncs-approved-panel hidden space-y-6">
        <p class="text-slate-600 text-sm">비NCS 훈련과정 전용 입력 영역입니다. 과정개요를 등록해 주세요.</p>
        <div>
          <label class="block text-sm font-bold text-slate-700 mb-1">과정명</label>
          <input type="text" id="nonNcsCourseName" class="w-full max-w-md px-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20" placeholder="과정명 입력">
        </div>
        <div>
          <label class="block text-sm font-bold text-slate-700 mb-1">과정 개요</label>
          <textarea id="nonNcsOverview" rows="4" class="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20" placeholder="과정 개요 입력"></textarea>
        </div>
      </div>
      <div class="flex flex-wrap gap-3 pt-6 border-t border-slate-200/60">
        <a href="/admin/ncs/approved/list" class="px-5 py-2.5 text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 font-bold text-sm transition inline-flex items-center gap-2"><i class="fas fa-list-ul"></i> 저장된 목록</a>
        <button type="button" id="ncsApprovedBtnSave" class="px-5 py-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 font-bold text-sm transition">${isEdit ? '수정' : '저장'}</button>
        <button type="button" id="ncsApprovedBtnNext" class="px-5 py-2.5 bg-slate-700 text-white rounded-xl hover:bg-slate-800 font-bold text-sm transition inline-flex items-center gap-2"><i class="fas fa-arrow-right"></i> 다음</button>
        ${isEdit ? '<button type="button" id="ncsApprovedBtnDelete" class="px-5 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 font-bold text-sm transition">삭제</button>' : ''}
      </div>
    </div>`;
  }
  if (step === 2) {
    const regId = editId || '';
    return `
    <div class="space-y-6" id="ncsApprovedStep2Container">
      <input type="hidden" id="ncsApprovedRegId" value="${regId}">
      <h3 class="text-lg font-bold text-slate-800">훈련이수체계도 작성</h3>
      <p class="text-sm text-slate-600">선택된 직종의 능력단위로 교과목 편성에 활용됩니다. 비NCS는 교과목은 <strong>3. 교과목편성</strong>에서 작성됩니다.</p>
      <p class="text-xs text-slate-500">교과목 편성(3단계)에서 활용할 능력단위를 <strong>여러 개 선택</strong>한 뒤 다음 페이지로 이동하세요.</p>
      <div class="overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table class="w-full text-left text-sm min-w-[520px]">
          <thead class="bg-slate-50 border-b border-slate-200">
            <tr>
              <th class="px-4 py-3 w-12 font-bold text-slate-700">선택</th>
              <th class="px-4 py-3 w-36 font-bold text-slate-700">수준</th>
              <th class="px-4 py-3 font-bold text-slate-700">직종</th>
            </tr>
          </thead>
          <tbody id="ncsTrainingSystemBody" class="divide-y divide-slate-100">
            <tr><td colspan="3" class="px-4 py-8 text-center text-slate-400"><i class="fas fa-spinner fa-spin mr-2"></i> 로딩 중...</td></tr>
          </tbody>
        </table>
      </div>
      <div class="rounded-xl border border-red-200 bg-red-50/80 px-4 py-3 text-sm text-red-800">
        <p class="font-bold mb-1">훈련이수체계도를 삭제할 경우 편성된 교과목도 동시에 삭제됩니다.</p>
        <p class="mb-1">교과목편성 및 훈련이수체계도 재설정을 원할 경우 훈련이수체계도를 삭제하시면 됩니다.</p>
        <p class="text-red-700">삭제가 불가능할 경우에는 4번째 단계인 훈련시간설정이 등록되었을 경우에 삭제가 불가능합니다.</p>
      </div>
      <div class="flex flex-wrap gap-3 pt-4 border-t border-slate-200/60">
        <a href="/admin/ncs/approved/list" class="px-5 py-2.5 text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 font-bold text-sm transition inline-flex items-center gap-2"><i class="fas fa-list-ul"></i> 목록</a>
        <a href="/admin/ncs/approved/1${regId ? '?id=' + regId : ''}" class="px-5 py-2.5 text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 font-bold text-sm transition inline-flex items-center gap-2"><i class="fas fa-arrow-left"></i> 이전 페이지</a>
        <button type="button" id="ncsStep2BtnNext" class="px-5 py-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 font-bold text-sm transition inline-flex items-center gap-2"><i class="fas fa-arrow-right"></i> 다음 페이지</button>
      </div>
    </div>`;
  }
  if (step === 3) {
    const regId = editId || '';
    return `
    <div class="space-y-6" id="ncsApprovedStep3Container">
      <input type="hidden" id="ncsApprovedRegIdStep3" value="${regId}">
      <h3 class="text-lg font-bold text-slate-800">교과목 편성</h3>
      <p class="text-sm text-slate-600">편성되는 교과목 기준으로 능력단위 및 능력단위 요소의 훈련시간을 설정합니다.</p>
      <div id="ncsStep3NoReg" class="hidden rounded-xl border border-amber-200 bg-amber-50 px-5 py-8 text-center text-slate-600">
        과정개요를 먼저 등록한 후 1단계에서 <strong>다음</strong>을 눌러 진행하세요. <a href="/admin/ncs/approved/1" class="text-emerald-600 hover:underline ml-1">1. 과정개요로 이동</a>
      </div>
      <div id="ncsStep3Form" class="space-y-6">
      <div id="ncsCurriculumSection" class="rounded-xl border border-slate-200 bg-white overflow-hidden">
        <div class="px-5 py-4 bg-slate-50 border-b border-slate-200 flex flex-wrap justify-between items-center gap-3">
          <div>
            <h4 class="font-bold text-slate-800" id="ncsCurriculumJobLabel">NCS 기반 교과</h4>
            <p class="text-xs text-slate-600 mt-0.5">해당 직종에 관련된 교과목을 설정해주세요.</p>
          </div>
          <div class="flex gap-2">
            <button type="button" id="ncsCurriculumBtnAdd" class="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-bold hover:bg-emerald-700 transition"><i class="fas fa-plus mr-1"></i>추가</button>
            <button type="button" id="ncsCurriculumBtnDel" class="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-bold hover:bg-red-700 transition"><i class="fas fa-minus mr-1"></i>삭제</button>
          </div>
        </div>
        <div id="ncsCurriculumRows" class="p-5 space-y-5">
          <div class="ncs-curriculum-row rounded-lg border border-slate-200 p-4 bg-white space-y-4">
            <div>
              <label class="block text-xs font-bold text-slate-600 mb-1">교과목명</label>
              <input type="text" class="ncs-curriculum-name w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" placeholder="교과목명을 등록해주세요">
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-600 mb-2">능력단위</label>
              <div class="ncs-curriculum-unit-checks flex flex-wrap gap-3"></div>
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-600 mb-1">능력단위요소</label>
              <p class="text-xs text-slate-500 mb-2">교과목에 포함될 능력단위를 선택해주세요.</p>
              <div class="ncs-curriculum-selected text-sm text-slate-600 min-h-[2rem] px-3 py-2 rounded-lg bg-slate-50 border border-slate-100"></div>
            </div>
          </div>
        </div>
      </div>

      <div id="nonNcsCurriculumSection" class="rounded-xl border border-slate-200 bg-white overflow-hidden">
        <div class="px-5 py-4 bg-slate-50 border-b border-slate-200 flex flex-wrap justify-between items-center gap-3">
          <h4 class="font-bold text-slate-800">비NCS교과</h4>
          <div class="flex gap-2">
            <button type="button" id="nonNcsCurriculumBtnAdd" class="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-bold hover:bg-emerald-700 transition"><i class="fas fa-plus mr-1"></i>추가</button>
            <button type="button" id="nonNcsCurriculumBtnDel" class="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-bold hover:bg-red-700 transition"><i class="fas fa-minus mr-1"></i>삭제</button>
          </div>
        </div>
        <div id="nonNcsCurriculumRows" class="p-5 space-y-5">
          <div class="nonncs-curriculum-row rounded-lg border border-slate-200 p-4 bg-white space-y-4">
            <div>
              <label class="block text-xs font-bold text-slate-600 mb-1">::교과분류::</label>
              <select class="nonncs-curriculum-class w-full max-w-xs px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500">
                <option value="">선택</option>
                <option value="공통">공통</option>
                <option value="기초">기초</option>
                <option value="전문">전문</option>
                <option value="실무">실무</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-600 mb-1">교과목명</label>
              <input type="text" class="nonncs-curriculum-name w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" placeholder="교과목명을 등록해주세요">
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-600 mb-1">단원</label>
              <div class="nonncs-units space-y-2">
                <div class="flex gap-2">
                  <input type="text" class="nonncs-unit-item flex-1 px-4 py-2 border border-slate-200 rounded-lg text-sm" placeholder="단원명 입력">
                  <button type="button" class="nonncs-unit-plus px-3 py-2 text-emerald-600 border border-emerald-200 rounded-lg hover:bg-emerald-50 text-sm">+</button>
                  <button type="button" class="nonncs-unit-minus px-3 py-2 text-red-600 border border-red-200 rounded-lg hover:bg-red-50 text-sm">−</button>
                </div>
              </div>
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-600 mb-1">학습목표</label>
              <div class="nonncs-objectives space-y-2">
                <div class="flex gap-2">
                  <input type="text" class="nonncs-obj-item flex-1 px-4 py-2 border border-slate-200 rounded-lg text-sm" placeholder="학습목표(수행준거) 입력">
                  <button type="button" class="nonncs-obj-plus px-3 py-2 text-emerald-600 border border-emerald-200 rounded-lg hover:bg-emerald-50 text-sm">+</button>
                  <button type="button" class="nonncs-obj-minus px-3 py-2 text-red-600 border border-red-200 rounded-lg hover:bg-red-50 text-sm">−</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="rounded-xl border border-red-200 bg-red-50/80 px-4 py-3 text-sm text-red-800">
        <p class="font-bold mb-1">교과목편성이 삭제 불가능한 경우</p>
        <p class="mb-1">4·5·6단계(훈련시간설정, 평가·교수학습방법, 시설·장비)가 이미 등록된 경우, 또는 승인받은 과정에 NCS 등록정보가 반영된 경우 삭제할 수 없습니다.</p>
      </div>

      <div class="flex flex-wrap gap-3 pt-4 border-t border-slate-200/60">
        <a href="/admin/ncs/approved/list" class="px-5 py-2.5 text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 font-bold text-sm transition inline-flex items-center gap-2"><i class="fas fa-list-ul"></i> 목록</a>
        <a href="/admin/ncs/approved/2${regId ? '?id=' + regId : ''}" class="px-5 py-2.5 text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 font-bold text-sm transition inline-flex items-center gap-2"><i class="fas fa-arrow-left"></i> 이전 페이지</a>
        <button type="button" id="ncsStep3BtnSave" class="px-5 py-2.5 text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 font-bold text-sm transition inline-flex items-center gap-2"><i class="fas fa-save"></i> 저장</button>
        <button type="button" id="ncsStep3BtnNext" class="px-5 py-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 font-bold text-sm transition inline-flex items-center gap-2"><i class="fas fa-arrow-right"></i> 다음 페이지</button>
      </div>
      </div>
    </div>`;
  }
  if (step === 4) {
    const regId = editId || '';
    return `
    <div class="space-y-6" id="ncsApprovedStep4Container">
      <input type="hidden" id="ncsApprovedRegIdStep4" value="${regId}">
      <h3 class="text-lg font-bold text-slate-800">훈련시간설정</h3>
      <p class="text-sm text-slate-600">편성된 교과목별 이론·실습 시간을 입력하세요. 합계는 자동 계산됩니다.</p>
      <div id="ncsStep4NoReg" class="hidden rounded-xl border border-amber-200 bg-amber-50 px-5 py-8 text-center text-slate-600">
        과정개요 및 교과목 편성을 먼저 등록한 후 3단계에서 <strong>다음 페이지</strong>를 눌러 진행하세요. <a href="/admin/ncs/approved/3${regId ? '?id=' + regId : ''}" class="text-emerald-600 hover:underline ml-1">3. 교과목편성으로 이동</a>
      </div>
      <div id="ncsStep4Form" class="space-y-6">
        <div class="overflow-x-auto rounded-xl border border-slate-200 bg-white">
          <table class="w-full text-left text-sm min-w-[480px]">
            <thead class="bg-slate-50 border-b border-slate-200">
              <tr>
                <th class="px-4 py-3 w-12 font-bold text-slate-700">No</th>
                <th class="px-4 py-3 font-bold text-slate-700">교과목명</th>
                <th class="px-4 py-3 w-28 font-bold text-slate-700">이론(시간)</th>
                <th class="px-4 py-3 w-28 font-bold text-slate-700">실습(시간)</th>
                <th class="px-4 py-3 w-24 font-bold text-slate-700">합계</th>
              </tr>
            </thead>
            <tbody id="ncsStep4HoursBody" class="divide-y divide-slate-100">
              <tr><td colspan="5" class="px-4 py-8 text-center text-slate-400"><i class="fas fa-spinner fa-spin mr-2"></i> 로딩 중...</td></tr>
            </tbody>
            <tfoot id="ncsStep4HoursFoot" class="bg-slate-50 border-t-2 border-slate-200 hidden">
              <tr>
                <td colspan="2" class="px-4 py-3 font-bold text-slate-700">총계</td>
                <td id="ncsStep4TotalTheory" class="px-4 py-3 font-bold text-slate-800">0</td>
                <td id="ncsStep4TotalPractice" class="px-4 py-3 font-bold text-slate-800">0</td>
                <td id="ncsStep4TotalSum" class="px-4 py-3 font-bold text-slate-800">0</td>
              </tr>
            </tfoot>
          </table>
        </div>
        <div class="flex flex-wrap gap-3 pt-4 border-t border-slate-200/60">
          <a href="/admin/ncs/approved/list" class="px-5 py-2.5 text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 font-bold text-sm transition inline-flex items-center gap-2"><i class="fas fa-list-ul"></i> 목록</a>
          <a href="/admin/ncs/approved/3${regId ? '?id=' + regId : ''}" class="px-5 py-2.5 text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 font-bold text-sm transition inline-flex items-center gap-2"><i class="fas fa-arrow-left"></i> 이전 페이지</a>
          <button type="button" id="ncsStep4BtnSave" class="px-5 py-2.5 text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 font-bold text-sm transition inline-flex items-center gap-2"><i class="fas fa-save"></i> 저장</button>
          <button type="button" id="ncsStep4BtnNext" class="px-5 py-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 font-bold text-sm transition inline-flex items-center gap-2"><i class="fas fa-arrow-right"></i> 다음 페이지</button>
        </div>
      </div>
    </div>`;
  }
  if (step === 5) {
    return `
    <div class="space-y-4">
      <h3 class="text-lg font-bold text-slate-800">5. 평가·교수학습 방법</h3>
      <p class="text-sm text-slate-600">평가 및 교수·학습 방법을 등록·관리합니다.</p>
      <div class="border-2 border-dashed border-slate-200 rounded-2xl p-12 text-center text-slate-500 bg-slate-50/50">
        <i class="fas fa-chalkboard-teacher text-4xl mb-3 opacity-50"></i>
        <p>평가·교수학습 방법 등록 영역 (추후 구현)</p>
      </div>
    </div>`;
  }
  if (step === 6) {
    return `
    <div class="space-y-4">
      <h3 class="text-lg font-bold text-slate-800">6. 시설·장비</h3>
      <p class="text-sm text-slate-600">시설 및 장비 정보를 등록·관리합니다.</p>
      <div class="border-2 border-dashed border-slate-200 rounded-2xl p-12 text-center text-slate-500 bg-slate-50/50">
        <i class="fas fa-building text-4xl mb-3 opacity-50"></i>
        <p>시설·장비 등록 영역 (추후 구현)</p>
      </div>
    </div>`;
  }
  return '<p class="text-slate-500">잘못된 단계입니다.</p>';
}

export function adminNcsApprovedHtml(stepParam?: string, editId?: string): string {
  const step = Math.min(6, Math.max(1, parseInt(stepParam || '1', 10) || 1));
  const stepNav = stepNavHtml(step);
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
    <style>body { font-family: 'Noto Sans KR', sans-serif; }</style>
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
                    <a href="/admin/ncs/approved/1" class="px-5 py-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 font-bold text-sm transition flex items-center gap-2">
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
