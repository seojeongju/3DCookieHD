(function() {
    var step = window.NCS_APPROVED_STEP || 1;
    var trainingCache = [];

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

        var largeClass = document.getElementById('ncsLargeClass');
        var midClass = document.getElementById('ncsMidClass');
        var smallClass = document.getElementById('ncsSmallClass');
        var mainJob = document.getElementById('ncsMainJob');

        if (!largeClass) return;

        if (largeClass.options.length <= 1) {
            largeClass.innerHTML = '<option value="">선택</option><option value="01">사업관리</option><option value="15">기계</option><option value="20">정보통신</option>';
        }

        function clearSelect(sel) {
            if (!sel) return;
            sel.innerHTML = '<option value="">선택</option>';
        }

        function loadTrainingByLarge() {
            var code = largeClass.value;
            if (!code) {
                trainingCache = [];
                clearSelect(midClass);
                clearSelect(smallClass);
                if (mainJob) mainJob.value = '';
                return;
            }
            var url = '/api/ncs/approved/training?ncsLclasCd=' + encodeURIComponent(code);
            var token = localStorage.getItem('token');
            fetch(url, { headers: token ? { 'Authorization': 'Bearer ' + token } : {} })
                .then(function(r) { return r.json(); })
                .then(function(json) {
                    if (!json.success || !json.data) {
                        trainingCache = [];
                        clearSelect(midClass);
                        clearSelect(smallClass);
                        return;
                    }
                    trainingCache = json.data;
                    var seen = {};
                    var opts = ['<option value="">선택</option>'];
                    trainingCache.forEach(function(item) {
                        var k = item.midCode + '|' + item.midName;
                        if (!seen[k]) {
                            seen[k] = true;
                            opts.push('<option value="' + (item.midCode || '').replace(/"/g, '&quot;') + '">' + (item.midName || '').replace(/</g, '&lt;') + '</option>');
                        }
                    });
                    midClass.innerHTML = opts.join('');
                    clearSelect(smallClass);
                    if (mainJob) mainJob.value = '';
                })
                .catch(function() {
                    trainingCache = [];
                    clearSelect(midClass);
                    clearSelect(smallClass);
                });
        }

        function loadSmallByMid() {
            var mid = midClass.value;
            if (!mid) {
                clearSelect(smallClass);
                if (mainJob) mainJob.value = '';
                return;
            }
            var list = trainingCache.filter(function(item) { return item.midCode === mid; });
            var opts = ['<option value="">선택</option>'];
            list.forEach(function(item) {
                var code = (item.unitCode || '').replace(/"/g, '&quot;');
                var name = (item.unitName || item.smallName || '').replace(/</g, '&lt;');
                opts.push('<option value="' + code + '" data-code="' + code + '" data-name="' + name.replace(/"/g, '&quot;') + '">' + (item.unitCode ? item.unitCode + '. ' : '') + name + '</option>');
            });
            smallClass.innerHTML = opts.join('');
            if (mainJob) mainJob.value = '';
        }

        function onSmallChange() {
            var opt = smallClass.options[smallClass.selectedIndex];
            if (mainJob && opt && opt.value) {
                var code = opt.getAttribute('data-code') || opt.value;
                var name = opt.getAttribute('data-name') || opt.text;
                mainJob.value = (code ? code + '. ' : '') + name;
            } else if (mainJob) {
                mainJob.value = '';
            }
        }

        largeClass.addEventListener('change', loadTrainingByLarge);
        midClass.addEventListener('change', loadSmallByMid);
        smallClass.addEventListener('change', onSmallChange);
    }

    if (step === 1) initStep1();
})();
