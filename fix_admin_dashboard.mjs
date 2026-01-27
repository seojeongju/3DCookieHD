import { readFileSync, writeFileSync } from 'fs';

const filePath = 'src/views/admin.ts';
let content = readFileSync(filePath, 'utf8');

// Corrected renderPendingList function
const newPendingList = `        function renderPendingList(list) {
            const container = document.getElementById('pending-approvals-list');
            if (!list || list.length === 0) {
                container.innerHTML = '<div class="p-6 text-center text-gray-500">대기 중인 항목이 없습니다.</div>';
                return;
            }

            container.innerHTML = list.map(item => \`
                <div class="px-6 py-4 flex items-center hover:bg-gray-50 transition">
                    <div class="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 mr-4">
                        <i class="fas fa-user-clock"></i>
                    </div>
                    <div>
                        <p class="text-sm font-medium text-gray-800">\${item.user_name} - \${item.course_title}</p>
                        <p class="text-xs text-gray-500">수강 승인 요청</p>
                    </div>
                    <span class="ml-auto text-xs text-gray-400">\${new Date(item.created_at).toLocaleDateString()}</span>
                </div>
            \`).join('');
        }`;

// Corrected renderAbnormalList function
const newAbnormalList = `        function renderAbnormalList(facilities, items) {
             const container = document.getElementById('abnormal-status-list');
             const allItems = [
                ...(facilities || []).map(f => ({ ...f, type: 'facility' })),
                ...(items || []).map(i => ({ ...i, type: 'item' }))
             ];

             if (allItems.length === 0) {
                 container.innerHTML = '<div class="p-6 text-center text-gray-500"><i class="fas fa-check-circle text-green-500 text-3xl mb-2 block"></i>모든 시설과 장비가<br>정상입니다.</div>';
                 return;
             }

             container.innerHTML = allItems.map(item => {
                 const isFacility = item.type === 'facility';
                 const statusColors = {
                     '점검필요': 'bg-yellow-100 text-yellow-700',
                     '수리중': 'bg-red-100 text-red-700',
                     'bad': 'bg-yellow-100 text-yellow-700',
                     'broken': 'bg-red-100 text-red-700',
                     'repair': 'bg-orange-100 text-orange-700'
                 };
                 const statusText = {
                     'bad': '상태나쁨', 'broken': '고장', 'repair': '수리중'
                 };
                 
                 const badgeClass = statusColors[item.status] || 'bg-gray-100 text-gray-700';
                 const badgeLabel = isFacility ? item.status : (statusText[item.status] || item.status);
                 const icon = isFacility ? 'fa-building' : 'fa-cubes';
                 const subText = isFacility ? (item.manager_main || '관리자 없음') : (item.facility_name || '위치 미정');

                 return \`
                    <div class="px-6 py-4 flex items-center hover:bg-gray-50 transition cursor-pointer" onclick="location.href='/admin/facilities'">
                        <div class="w-10 h-10 rounded-full \${isFacility ? 'bg-indigo-50 text-indigo-600' : 'bg-pink-50 text-pink-600'} flex items-center justify-center mr-4">
                            <i class="fas \${icon}"></i>
                        </div>
                        <div class="flex-1 min-w-0">
                            <div class="flex justify-between mb-1">
                                <h4 class="text-sm font-bold text-gray-800 truncate">\${item.name}</h4>
                                <span class="px-2 py-0.5 rounded text-[10px] font-bold \${badgeClass}">\${badgeLabel}</span>
                            </div>
                            <p class="text-xs text-gray-500 truncate">\${subText}</p>
                        </div>
                    </div>
                 \`;
             }).join('');
        }`;

// Replace renderPendingList
const pendingRegex = /function renderPendingList\(list\) \{[\s\S]*?^\s{8}\}/m;
content = content.replace(pendingRegex, newPendingList);

// Replace renderAbnormalList
// Since the previous edit might have left it messy, we look for the signature and replace until the end of the block
const abnormalRegex = /function renderAbnormalList\(facilities, items\) \{[\s\S]*?^\s{8}\}/m;
// If the regex is hard, we can just replace the whole file part if we identify the start and end by other means.
// But the indentation } at start of line seems reliable for this file.

if (abnormalRegex.test(content)) {
    content = content.replace(abnormalRegex, newAbnormalList);
    console.log("Replaced renderAbnormalList");
} else {
    // If not found (maybe indentation is different), try to append it or warn
    console.log("Could not find renderAbnormalList to replace, checking if it exists...");
    if (!content.includes('function renderAbnormalList')) {
        // Should not happen as we added it
    }
}

// Just in case pending list wasn't found by regex
if (!content.includes('function renderPendingList(list) {')) {
    console.log("Could not find renderPendingList to replace");
} else {
    console.log("Replaced renderPendingList");
}

writeFileSync(filePath, content);
