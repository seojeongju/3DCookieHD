/**
 * 로그인 후 비밀번호 변경 모달 (관리자·강사·수강생 공통)
 */
export function changePasswordModalHtml(): string {
  return `
<div id="changePasswordModal" class="fixed inset-0 z-[200] hidden items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
  <div class="bg-white w-full max-w-md rounded-[2rem] shadow-2xl border border-slate-100 overflow-hidden">
    <div class="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
      <h3 class="text-lg font-black text-slate-900 tracking-tight">비밀번호 변경</h3>
      <button type="button" onclick="closeChangePasswordModal()" class="w-9 h-9 rounded-full hover:bg-white text-slate-400 hover:text-slate-700 transition flex items-center justify-center">
        <i class="fas fa-times"></i>
      </button>
    </div>
    <form id="changePasswordForm" class="p-6 space-y-4" onsubmit="submitChangePassword(event)">
      <p class="text-xs text-slate-500 font-medium leading-relaxed">현재 비밀번호 확인 후 새 비밀번호를 설정합니다. (8자 이상)</p>
      <div>
        <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">현재 비밀번호</label>
        <input type="password" id="cpCurrent" required autocomplete="current-password"
          class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-300" />
      </div>
      <div>
        <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">새 비밀번호</label>
        <input type="password" id="cpNew" required minlength="8" autocomplete="new-password"
          class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-300" />
      </div>
      <div>
        <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">새 비밀번호 확인</label>
        <input type="password" id="cpConfirm" required minlength="8" autocomplete="new-password"
          class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-300" />
      </div>
      <p id="cpError" class="hidden text-xs font-bold text-red-500"></p>
      <button type="submit" id="cpSubmitBtn"
        class="w-full py-3.5 bg-slate-900 text-white rounded-xl text-sm font-black hover:bg-blue-600 transition shadow-lg">
        변경하기
      </button>
    </form>
  </div>
</div>
<script>
(function() {
  if (window.__changePasswordModalBound) return;
  window.__changePasswordModalBound = true;
  window.openChangePasswordModal = function() {
    var m = document.getElementById('changePasswordModal');
    if (!m) return;
    var err = document.getElementById('cpError');
    if (err) { err.classList.add('hidden'); err.textContent = ''; }
    var form = document.getElementById('changePasswordForm');
    if (form) form.reset();
    m.classList.remove('hidden');
    m.classList.add('flex');
  };
  window.closeChangePasswordModal = function() {
    var m = document.getElementById('changePasswordModal');
    if (!m) return;
    m.classList.add('hidden');
    m.classList.remove('flex');
  };
  window.submitChangePassword = async function(e) {
    e.preventDefault();
    var err = document.getElementById('cpError');
    var btn = document.getElementById('cpSubmitBtn');
    var current = (document.getElementById('cpCurrent') || {}).value || '';
    var next = (document.getElementById('cpNew') || {}).value || '';
    var confirm = (document.getElementById('cpConfirm') || {}).value || '';
    function showErr(msg) {
      if (!err) { alert(msg); return; }
      err.textContent = msg;
      err.classList.remove('hidden');
    }
    if (next.length < 8) { showErr('새 비밀번호는 8자 이상이어야 합니다.'); return; }
    if (next !== confirm) { showErr('새 비밀번호가 일치하지 않습니다.'); return; }
    var token = localStorage.getItem('token') || '';
    if (!token) { showErr('로그인이 필요합니다.'); return; }
    var original = btn ? btn.innerHTML : '';
    if (btn) { btn.disabled = true; btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>처리 중...'; }
    try {
      var res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
        body: JSON.stringify({ current_password: current, new_password: next })
      });
      var json = await res.json();
      if (json.success) {
        alert(json.message || '비밀번호가 변경되었습니다.');
        closeChangePasswordModal();
      } else {
        showErr(json.error || '변경에 실패했습니다.');
      }
    } catch (ex) {
      showErr('서버 연결에 실패했습니다.');
    } finally {
      if (btn) { btn.disabled = false; btn.innerHTML = original; }
    }
  };
})();
</script>
`;
}
