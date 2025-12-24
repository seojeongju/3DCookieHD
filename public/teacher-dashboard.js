// 강사 대시보드 JavaScript

document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    loadDashboardData();
});

function checkAuth() {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');

    if (!token || !userStr) {
        alert('로그인이 필요합니다.');
        location.href = '/login';
        return;
    }

    try {
        const user = JSON.parse(userStr);
        if (user.role !== 'teacher' && user.role !== 'admin') {
            alert('접근 권한이 없습니다.');
            location.href = '/';
        }
    } catch (e) {
        console.error('User data parse error:', e);
        location.href = '/login';
    }
}

async function loadDashboardData() {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/dashboard/teacher-stats', {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        });

        if (response.status === 401) {
            alert('로그인 세션이 만료되었습니다.');
            location.href = '/login';
            return;
        }

        const result = await response.json();

        if (result.success && result.data) {
            const data = result.data;

            // 통계 카드 업데이트
            updateStats(data);

            // 담당 과정 목록 렌더링
            renderCourses(data.recentCourses || []);

            // 채점 대기 목록 렌더링
            renderGrading(data.pendingGradingList || []);
        } else {
            showError('대시보드 데이터를 불러오는데 실패했습니다.');
        }
    } catch (error) {
        console.error('Dashboard error:', error);
        showError('대시보드 데이터를 불러오는 중 오류가 발생했습니다.');
    }
}

function updateStats(data) {
    document.getElementById('myCourses').textContent = data.myCourses || 0;
    document.getElementById('totalStudents').textContent = data.totalStudents || 0;
    document.getElementById('pendingGrading').textContent = data.pendingGrading || 0;
}

function renderCourses(courses) {
    const container = document.getElementById('recentCoursesContainer');
    container.innerHTML = '';

    if (!courses || courses.length === 0) {
        container.innerHTML = '<div class="col-span-3 text-center py-8"><i class="fas fa-inbox text-4xl text-gray-300 mb-3"></i><p class="text-gray-500">담당 과정이 없습니다.</p></div>';
        return;
    }

    courses.forEach(course => {
        const card = document.createElement('div');
        card.className = 'bg-white rounded-lg shadow-sm p-5 border border-gray-100 hover:shadow-md transition';

        const progress = Math.min(100, ((course.enrolled_count || 0) / (course.max_students || 1)) * 100);

        card.innerHTML = `
            <div class="flex items-start justify-between mb-3">
                <span class="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded">${course.category || '일반'}</span>
                <span class="text-xs text-gray-500">${course.enrolled_count || 0} / ${course.max_students || 0}명</span>
            </div>
            <h4 class="font-bold text-gray-800 mb-2 line-clamp-2">${course.title}</h4>
            <div class="flex items-center justify-between mt-4">
                <div class="w-full bg-gray-200 rounded-full h-2">
                    <div class="bg-blue-600 h-2 rounded-full" style="width: ${progress}%"></div>
                </div>
            </div>
            <div class="mt-3 flex gap-2">
                <a href="/teacher/courses" class="flex-1 text-center px-3 py-2 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium hover:bg-blue-100 transition">
                    <i class="fas fa-edit mr-1"></i> 관리
                </a>
                <a href="/teacher/attendance" class="flex-1 text-center px-3 py-2 bg-green-50 text-green-700 rounded-lg text-xs font-medium hover:bg-green-100 transition">
                    <i class="fas fa-check mr-1"></i> 출석
                </a>
            </div>
        `;

        container.appendChild(card);
    });
}

function renderGrading(list) {
    const container = document.getElementById('pendingGradingListContainer');
    container.innerHTML = '';

    if (!list || list.length === 0) {
        container.innerHTML = '<div class="px-6 py-8 text-center"><i class="fas fa-check-circle text-4xl text-green-300 mb-3"></i><p class="text-gray-500">채점 대기 중인 항목이 없습니다.</p></div>';
        return;
    }

    const listDiv = document.createElement('div');
    listDiv.className = 'divide-y divide-gray-100';

    list.forEach(item => {
        const row = document.createElement('div');
        row.className = 'px-6 py-4 flex items-center hover:bg-gray-50 transition';

        row.innerHTML = `
            <div class="flex-1">
                <h4 class="text-sm font-bold text-gray-800">${item.exam_title}</h4>
                <p class="text-xs text-gray-500 mt-1">
                    <i class="fas fa-user mr-1"></i> ${item.student_name}
                    <span class="mx-2">•</span>
                    <i class="far fa-clock mr-1"></i> ${formatDate(item.submitted_at)}
                </p>
            </div>
            <a href="/teacher/exams" class="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg text-xs font-medium hover:bg-indigo-200 transition">
                <i class="fas fa-pen mr-1"></i> 채점하기
            </a>
        `;

        listDiv.appendChild(row);
    });

    container.appendChild(listDiv);
}

function formatDate(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return '방금 전';
    if (minutes < 60) return minutes + '분 전';
    if (hours < 24) return hours + '시간 전';
    if (days < 7) return days + '일 전';

    return date.toLocaleDateString('ko-KR');
}

function showError(message) {
    document.getElementById('myCourses').textContent = '0';
    document.getElementById('totalStudents').textContent = '0';
    document.getElementById('pendingGrading').textContent = '0';

    const container = document.getElementById('recentCoursesContainer');
    container.innerHTML = `
        <div class="col-span-3 text-center py-8">
            <i class="fas fa-exclamation-triangle text-4xl text-red-300 mb-3"></i>
            <p class="text-red-500">${message}</p>
            <button onclick="loadDashboardData()" class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                다시 시도
            </button>
        </div>
    `;
}
