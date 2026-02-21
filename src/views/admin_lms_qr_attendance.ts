import { lmsHeaderHtml } from './components/lms_header';
import { hrdSidebar } from './components/hrd_sidebar';

export const adminLmsQrAttendanceHtml = (sidebar: string = hrdSidebar('courses')) => `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>QR 출석 체크 - 와우쓰리디홍대센터</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/qrcode@1.5.3/build/qrcode.min.js"></script>
    <style>
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 2px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
    </style>
</head>
<body class="bg-gray-50 overflow-hidden">
    <div class="flex h-screen overflow-hidden">
        ${sidebar}
        
        <div class="flex-1 flex flex-col overflow-hidden relative min-w-0">
            <div class="flex-1 overflow-y-auto custom-scrollbar">
                ${lmsHeaderHtml('attendance')}

                <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="bg-white rounded-xl shadow-lg p-8">
            <h2 class="text-2xl font-bold mb-6 text-gray-800">
                <i class="fas fa-qrcode mr-3 text-blue-600"></i> QR 출석 체크
            </h2>

            <!-- QR 코드 생성 -->
            <div class="grid md:grid-cols-2 gap-8 mb-8">
                <div>
                    <h3 class="font-bold mb-4">QR 코드 생성</h3>
                    <div class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium mb-1">세션 종류</label>
                            <select id="sessionType" class="w-full px-4 py-2 border rounded-lg">
                                <option value="morning">오전</option>
                                <option value="afternoon">오후</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1">유효 시간 (분)</label>
                            <input type="number" id="duration" value="10" min="5" max="60" class="w-full px-4 py-2 border rounded-lg">
                        </div>
                        <div class="flex items-center gap-2">
                            <input type="checkbox" id="locationRequired" class="rounded">
                            <label class="text-sm">위치 검증 사용</label>
                        </div>
                        <button onclick="generateQR()" class="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-bold shadow-lg">
                            <i class="fas fa-qrcode mr-2"></i> QR 코드 생성
                        </button>
                    </div>
                </div>

                <!-- QR 코드 표시 -->
                <div class="flex flex-col items-center justify-center bg-gray-50 rounded-lg p-8">
                    <div id="qrContainer" class="hidden">
                        <canvas id="qrCanvas"></canvas>
                        <p class="text-center mt-4 text-sm text-gray-600">
                            유효시간: <span id="qrExpiry" class="font-bold text-blue-600"></span>
                        </p>
                        <p class="text-xs text-gray-500 mt-2">학생들이 이 QR 코드를 스캔하면 출석 처리됩니다</p>
                    </div>
                    <div id="qrPlaceholder" class="text-center text-gray-400">
                        <i class="fas fa-qrcode text-6xl mb-4 opacity-20"></i>
                        <p class="text-sm">QR 코드를 생성하세요</p>
                    </div>
                </div>
            </div>

            <!-- 실시간 출석 현황 -->
            <div>
                <h3 class="font-bold mb-4">실시간 출석 현황</h3>
                <div class="overflow-x-auto">
                    <table class="min-w-full">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500">학생명</th>
                                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500">체크인 시간</th>
                                <th class="px-4 py-2 text-center text-xs font-medium text-gray-500">상태</th>
                            </tr>
                        </thead>
                        <tbody id="checkinList" class="divide-y">
                            <tr><td colspan="3" class="px-4 py-8 text-center text-gray-500">QR 코드 생성 후 출석 현황이 표시됩니다</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </main>

    <script>
        let courseId = null;
        let currentSessionId = null;
        let refreshInterval = null;

        document.addEventListener('DOMContentLoaded', () => {
            const pathParts = window.location.pathname.split('/');
            const courseIndex = pathParts.indexOf('courses');
            if (courseIndex !== -1) courseId = pathParts[courseIndex + 1];

            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(() => {}, () => {});
            }
        });

        async function generateQR() {
            if (!courseId) return alert('과정 정보가 없습니다');

            const user = JSON.parse(localStorage.getItem('user') || '{}');
            const sessionType = document.getElementById('sessionType').value;
            const duration = parseInt(document.getElementById('duration').value);
            const locationRequired = document.getElementById('locationRequired').checked;

            let latitude, longitude;
            if (locationRequired && navigator.geolocation) {
                const pos = await new Promise((resolve) => {
                    navigator.geolocation.getCurrentPosition(resolve);
                });
                latitude = pos.coords.latitude;
                longitude = pos.coords.longitude;
            }

            try {
                const response = await fetch('/api/attendance-qr/sessions', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        course_id: courseId,
                        session_date: new Date().toISOString().split('T')[0],
                        session_type: sessionType,
                        duration_minutes: duration,
                        location_required: locationRequired,
                        latitude,
                        longitude,
                        created_by: user.id
                    })
                });

                const result = await response.json();
                if (!result.success) throw new Error(result.error);

                currentSessionId = result.data.id;
                
                // QR 코드 생성
                const qrCanvas = document.getElementById('qrCanvas');
                QRCode.toCanvas(qrCanvas, result.data.qr_code, { width: 300 });

                document.getElementById('qrPlaceholder').classList.add('hidden');
                document.getElementById('qrContainer').classList.remove('hidden');
                
                const expiryTime = new Date(result.data.valid_until);
                document.getElementById('qrExpiry').textContent = expiryTime.toLocaleTimeString('ko-KR');

                // 실시간 출석 현황 갱신 시작
                if (refreshInterval) clearInterval(refreshInterval);
                refreshInterval = setInterval(() => loadCheckins(), 3000);
                loadCheckins();

            } catch (e) {
                console.error(e);
                alert('QR 코드 생성 실패: ' + e.message);
            }
        }

        async function loadCheckins() {
            if (!currentSessionId) return;

            try {
                const response = await fetch(\`/api/attendance-qr/sessions/\${currentSessionId}/checkins\`);
                const result = await response.json();
                
                if (!result.success) return;

                const tbody = document.getElementById('checkinList');
                if (result.data.length === 0) {
                    tbody.innerHTML = '<tr><td colspan="3" class="px-4 py-8 text-center text-gray-500">아직 출석 체크한 학생이 없습니다</td></tr>';
                    return;
                }

                tbody.innerHTML = result.data.map(c => {
                    const statusBadge = c.status === 'present'
                        ? '<span class="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-bold">정상</span>'
                        : '<span class="px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs font-bold">지각</span>';
                    
                    return \`
                        <tr class="hover:bg-gray-50">
                            <td class="px-4 py-3 font-medium">\${c.student_name}</td>
                            <td class="px-4 py-3 text-sm text-gray-600">\${new Date(c.check_in_time).toLocaleTimeString('ko-KR')}</td>
                            <td class="px-4 py-3 text-center">\${statusBadge}</td>
                        </tr>
                    \`;
                }).join('');
            } catch (e) {
                console.error(e);
            }
        }
    </script>
            </div>
        </div>
    </div>
</body>
</html>
`;
