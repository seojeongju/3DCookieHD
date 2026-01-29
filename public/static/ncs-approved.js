(function() {
    var step = window.NCS_APPROVED_STEP || 1;

    function initStep1() {
        var tabNcsOnly = document.getElementById('tabNcsOnly');
        var tabNonNcs = document.getElementById('tabNonNcs');
        var panelNcsOnly = document.getElementById('panelNcsOnly');
        var panelNonNcs = document.getElementById('panelNonNcs');
        if (!tabNcsOnly || !panelNcsOnly) return;

        function showNcs() {
            tabNcsOnly.classList.add('bg-emerald-600', 'text-white');
            tabNcsOnly.classList.remove('bg-slate-100', 'text-slate-600');
            tabNonNcs.classList.remove('bg-emerald-600', 'text-white');
            tabNonNcs.classList.add('bg-slate-100', 'text-slate-600');
            panelNcsOnly.classList.remove('hidden');
            if (panelNonNcs) panelNonNcs.classList.add('hidden');
        }
        function showNonNcs() {
            tabNonNcs.classList.add('bg-emerald-600', 'text-white');
            tabNonNcs.classList.remove('bg-slate-100', 'text-slate-600');
            tabNcsOnly.classList.remove('bg-emerald-600', 'text-white');
            tabNcsOnly.classList.add('bg-slate-100', 'text-slate-600');
            if (panelNonNcs) panelNonNcs.classList.remove('hidden');
            panelNcsOnly.classList.add('hidden');
        }

        tabNcsOnly.addEventListener('click', showNcs);
        if (tabNonNcs) tabNonNcs.addEventListener('click', showNonNcs);

        var smallClass = document.getElementById('ncsSmallClass');
        if (smallClass) {
            smallClass.addEventListener('change', function() {
                var opt = smallClass.options[smallClass.selectedIndex];
                var mainJob = document.getElementById('ncsMainJob');
                if (mainJob && opt && opt.value) mainJob.value = opt.text || (opt.getAttribute('data-code') ? opt.getAttribute('data-code') + '. ' + opt.text : '');
            });
        }

        var largeClass = document.getElementById('ncsLargeClass');
        if (largeClass && largeClass.options.length <= 1) {
            largeClass.innerHTML = '<option value="">선택</option><option value="01">사업관리</option><option value="15">기계</option><option value="20">정보통신</option>';
        }
    }

    if (step === 1) initStep1();
})();
