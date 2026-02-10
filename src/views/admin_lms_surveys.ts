import { lmsHeaderHtml } from './components/lms_header';
import { hrdSidebar } from './components/hrd_sidebar';

export const adminLmsSurveysHtml = `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>설문/평가 관리 - 와우쓰리디홍대센터</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script>
      tailwind.config = {
        theme: {
          extend: {
            colors: {
              primary: {
                50: '#f0f7ff', 100: '#e0effe', 200: '#baddfd', 300: '#7dbcfb', 400: '#3a9bf7',
                500: '#5b9bd5', 600: '#4a90e2', 700: '#2d5fa3', 800: '#1e4278', 900: '#132d54'
              }
            }
          }
        }
      }
    </script>
    <style>
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 2px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
    </style>
</head>
<body class="bg-gray-50 overflow-hidden">
    <div class="flex h-screen overflow-hidden">
        ${hrdSidebar('courses')}
        
        <div class="flex-1 flex flex-col overflow-hidden relative min-w-0">
            <div class="flex-1 overflow-y-auto custom-scrollbar">
                ${lmsHeaderHtml('surveys')}

    <!-- 서브 헤더 -->
    <div class="bg-white border-b border-gray-200 sticky top-[6.5rem] z-30">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div class="flex justify-between items-center">
                <h2 class="text-xl font-bold text-gray-800">역량 평가 및 설문 관리</h2>
                <div class="flex gap-2">
                    <button onclick="openCreateModal('diagnosis')" class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center shadow-sm">
                        <i class="fas fa-chart-radar mr-2"></i> 역량 진단 생성
                    </button>
                    <button onclick="openCreateModal('survey')" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center shadow-sm">
                        <i class="fas fa-poll mr-2"></i> 일반 설문 생성
                    </button>
                </div>
            </div>
        </div>
    </div>

    <!-- 메인 컨텐츠 -->
    <main class="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        
        <!-- 통계 요약 카드 -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="font-bold text-gray-700">평가 진행률</h3>
                    <span class="p-2 bg-blue-100 text-blue-600 rounded-lg"><i class="fas fa-percent"></i></span>
                </div>
                <div class="text-3xl font-black text-gray-800 mb-1" id="stat-progress">0%</div>
                <p class="text-sm text-gray-500">전체 수강생 대비 참여율</p>
                <div class="w-full bg-gray-100 rounded-full h-2 mt-4">
                    <div class="bg-blue-500 h-2 rounded-full" style="width: 0%" id="stat-progress-bar"></div>
                </div>
            </div>
            
            <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="font-bold text-gray-700">평균 만족도</h3>
                    <span class="p-2 bg-yellow-100 text-yellow-600 rounded-lg"><i class="fas fa-star"></i></span>
                </div>
                <div class="text-3xl font-black text-gray-800 mb-1" id="stat-satisfaction">0.0</div>
                <p class="text-sm text-gray-500">5.0 만점 기준</p>
                <div class="flex text-yellow-400 text-sm mt-3" id="stat-stars">
                    <!-- 별점 렌더링 -->
                </div>
            </div>

            <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="font-bold text-gray-700">진행중인 평가</h3>
                    <span class="p-2 bg-green-100 text-green-600 rounded-lg"><i class="fas fa-clock"></i></span>
                </div>
                <div class="text-3xl font-black text-gray-800 mb-1" id="stat-active">0</div>
                <p class="text-sm text-gray-500">현재 참여 가능한 설문/평가</p>
            </div>
        </div>

        <!-- 설문/평가 목록 -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div class="p-6 border-b border-gray-100 flex justify-between items-center">
                <h3 class="font-bold text-lg text-gray-800">등록된 평가 및 설문 목록</h3>
                <div class="flex gap-2">
                    <select id="filterType" class="text-sm border-gray-300 rounded-lg focus:ring-blue-500">
                        <option value="all">전체 보기</option>
                        <option value="diagnosis">역량 진단</option>
                        <option value="survey">일반 설문</option>
                    </select>
                </div>
            </div>
            <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                    <tr>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">구분</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">제목</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">기간</th>
                        <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">참여현황</th>
                        <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">상태</th>
                        <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">관리</th>
                    </tr>
                </thead>
                <tbody id="surveyList" class="bg-white divide-y divide-gray-200">
                    <tr>
                        <td colspan="6" class="px-6 py-10 text-center text-gray-500">
                            <i class="fas fa-spinner fa-spin mr-2"></i> 데이터를 불러오는 중...
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </main>

    <!-- 생성 모달 -->
    <div id="createModal" class="fixed inset-0 bg-black bg-opacity-50 hidden z-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div class="px-6 py-4 border-b flex justify-between items-center bg-gray-50 rounded-t-xl">
                <h3 class="text-xl font-bold text-gray-800" id="modalTitle">새 평가 생성</h3>
                <button onclick="closeModal('createModal')" class="text-gray-400 hover:text-gray-600"><i class="fas fa-times text-xl"></i></button>
            </div>
            <form id="createForm" onsubmit="handleSave(event)" class="p-6 space-y-4">
                <input type="hidden" id="surveyType">
                <div>
                    <label class="block text-sm font-bold text-gray-700 mb-1">제목</label>
                    <input type="text" id="surveyTitle" required class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="예: 훈련과정 만족도 조사, 사전 역량 진단평가">
                </div>
                <div>
                    <label class="block text-sm font-bold text-gray-700 mb-1">설명</label>
                    <textarea id="surveyDesc" rows="3" class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="평가에 대한 안내 문구를 입력하세요."></textarea>
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-bold text-gray-700 mb-1">시작일</label>
                        <input type="date" id="startDate" required class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500">
                    </div>
                    <div>
                        <label class="block text-sm font-bold text-gray-700 mb-1">종료일</label>
                        <input type="date" id="endDate" required class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500">
                    </div>
                </div>
                
                <div class="border-t pt-4 mt-6">
                    <div class="flex justify-between items-center mb-4">
                        <label class="block text-sm font-bold text-gray-700">문항 구성</label>
                        <button type="button" onclick="addQuestion()" class="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded hover:bg-gray-200"><i class="fas fa-plus mr-1"></i> 문항 추가</button>
                    </div>
                    <div id="questionContainer" class="space-y-4">
                        <!-- 문항들이 여기에 추가됨 -->
                    </div>
                </div>

                <div class="pt-6 flex justify-end gap-3">
                    <button type="button" onclick="closeModal('createModal')" class="px-5 py-2.5 text-gray-700 font-medium bg-gray-100 rounded-lg hover:bg-gray-200">취소</button>
                    <button type="submit" class="px-5 py-2.5 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 shadow-lg shadow-blue-200">저장하기</button>
                </div>
            </form>
        </div>
    </div>

    <!-- 결과 분석 모달 (역량 진단용) -->
    <div id="resultModal" class="fixed inset-0 bg-black bg-opacity-50 hidden z-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div class="px-6 py-4 border-b flex justify-between items-center bg-gray-50 rounded-t-xl">
                <h3 class="text-xl font-bold text-gray-800">역량 진단 결과 분석</h3>
                <button onclick="closeModal('resultModal')" class="text-gray-400 hover:text-gray-600"><i class="fas fa-times text-xl"></i></button>
            </div>
            <div class="p-8">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    <div>
                        <h4 class="font-bold text-gray-700 mb-4 text-center">종합 역량 방사형 차트</h4>
                        <div class="relative h-64 w-full">
                            <canvas id="competencyChart"></canvas>
                        </div>
                    </div>
                    <div>
                         <h4 class="font-bold text-gray-700 mb-4">영역별 점수 상세</h4>
                         <div class="space-y-4" id="scoreDetails">
                            <!-- 점수 바 -->
                         </div>
                    </div>
                </div>
                
                <div class="border-t pt-6">
                     <h4 class="font-bold text-gray-700 mb-4">참여자 코멘트 / 서술형 응답</h4>
                     <div class="bg-gray-50 rounded-lg p-4 h-48 overflow-y-auto text-sm text-gray-600 space-y-2" id="commentsList">
                        <!-- 코멘트들 -->
                     </div>
                </div>
            </div>
        </div>
    </div>

    <!-- 템플릿: 문항 아이템 -->
    <template id="questionTemplate">
        <div class="bg-gray-50 p-4 rounded-lg border border-gray-200 relative group question-item">
            <button type="button" onclick="removeQuestion(this)" class="absolute top-2 right-2 text-gray-300 hover:text-red-500"><i class="fas fa-trash"></i></button>
            <div class="grid grid-cols-1 gap-2">
                <input type="text" name="q_text" class="w-full px-3 py-2 border rounded focus:ring-1 focus:ring-blue-500 text-sm font-bold" placeholder="문항 내용을 입력하세요">
                <select name="q_type" class="w-32 px-2 py-1 border rounded text-xs text-gray-600" onchange="toggleOptions(this)">
                    <option value="rating">5점 척도</option>
                    <option value="choice">객관식</option>
                    <option value="text">서술형</option>
                </select>
                <!-- 객관식 옵션 입력 영역 (숨김) -->
                <div class="hidden options-area mt-2 space-y-1">
                    <input type="text" class="w-full px-2 py-1 border rounded text-xs" placeholder="옵션 1 (콤마로 구분하여 입력: 예: 매우그렇다,그렇다,보통)">
                </div>
            </div>
        </div>
    </template>

    <script>
        const courseId = window.location.pathname.split('/')[3];
        let competencyChart = null;

        // Mock Data Storage (API 대체용)
        let surveys = [
            { id: 1, type: 'diagnosis', title: '사전 NC·S 직무 역량 진단', startDate: '2024-01-01', endDate: '2024-01-10', responseCount: 15, totalTarget: 20, status: 'closed' },
            { id: 2, type: 'survey', title: '1개월차 훈련과정 만족도 조사', startDate: '2024-02-01', endDate: '2024-02-05', responseCount: 18, totalTarget: 20, status: 'active' }
        ];

        document.addEventListener('DOMContentLoaded', () => {
             loadSurveys();
             updateStats();
        });

        function loadSurveys() {
            const tbody = document.getElementById('surveyList');
            tbody.innerHTML = surveys.map(s => {
                const typeLabel = s.type === 'diagnosis' 
                    ? '<span class="px-2 py-1 bg-indigo-100 text-indigo-700 rounded text-xs font-bold">역량진단</span>'
                    : '<span class="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-bold">일반설문</span>';
                
                const statusLabel = s.status === 'active'
                    ? '<span class="text-green-600 font-bold text-xs"><i class="fas fa-circle text-[8px] mr-1"></i>진행중</span>'
                    : '<span class="text-gray-400 font-bold text-xs">종료됨</span>';
                
                const rate = Math.round((s.responseCount / s.totalTarget) * 100);

                return \`
                    <tr class="hover:bg-gray-50 transition">
                        <td class="px-6 py-4 whitespace-nowrap">\${typeLabel}</td>
                        <td class="px-6 py-4 font-medium text-gray-800">\${s.title}</td>
                        <td class="px-6 py-4 text-xs text-gray-500">\${s.startDate} ~ \${s.endDate}</td>
                        <td class="px-6 py-4 text-center">
                            <div class="flex items-center justify-center gap-2">
                                <span class="text-sm font-bold text-gray-700">\${s.responseCount}/\${s.totalTarget}</span>
                                <span class="text-xs text-gray-400">(\${rate}%)</span>
                            </div>
                            <div class="w-full bg-gray-100 rounded-full h-1.5 mt-1 max-w-[100px] mx-auto">
                                <div class="bg-blue-500 h-1.5 rounded-full" style="width: \${rate}%"></div>
                            </div>
                        </td>
                        <td class="px-6 py-4 text-center">\${statusLabel}</td>
                        <td class="px-6 py-4 text-right">
                            <button onclick="viewResults(\${s.id}, '\${s.type}')" class="text-blue-600 hover:underline text-xs font-bold mr-3">결과분석</button>
                            <button onclick="alert('준비중')" class="text-gray-400 hover:text-gray-600 text-xs">수정</button>
                        </td>
                    </tr>
                \`;
            }).join('');
        }

        function updateStats() {
            // Mock Stats Calculation
            document.getElementById('stat-active').textContent = surveys.filter(s => s.status === 'active').length;
            document.getElementById('stat-progress').textContent = '78%';
            document.getElementById('stat-progress-bar').style.width = '78%';
            document.getElementById('stat-satisfaction').textContent = '4.2';
            document.getElementById('stat-stars').innerHTML = '<i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star-half-alt"></i>';
        }

        /* Create Modal Functions */
        window.openCreateModal = (type) => {
            document.getElementById('createForm').reset();
            document.getElementById('questionContainer').innerHTML = '';
            document.getElementById('surveyType').value = type;
            document.getElementById('modalTitle').textContent = type === 'diagnosis' ? '역량 진단 생성' : '새 설문 생성';
            
            // Add default question
            addQuestion();
            
            document.getElementById('createModal').classList.remove('hidden');
        };

        window.closeModal = (id) => document.getElementById(id).classList.add('hidden');

        window.addQuestion = () => {
            const tpl = document.getElementById('questionTemplate').content.cloneNode(true);
            document.getElementById('questionContainer').appendChild(tpl);
        };

        window.removeQuestion = (btn) => btn.closest('.question-item').remove();

        window.toggleOptions = (select) => {
            const area = select.parentElement.querySelector('.options-area');
            if (select.value === 'choice') area.classList.remove('hidden');
            else area.classList.add('hidden');
        };

        window.handleSave = (e) => {
            e.preventDefault();
            // Mock Save
            alert('저장되었습니다. (실제 데이터베이스 연동 필요)');
            closeModal('createModal');
            // Reload logic would go here
        };

        /* Result Functions */
        window.viewResults = (id, type) => {
            if (type === 'diagnosis') {
                openResultModal();
            } else {
                alert('일반 설문 결과는 목록형으로 제공됩니다. (구현 예정)');
            }
        };

        function openResultModal() {
            document.getElementById('resultModal').classList.remove('hidden');
            
            // Init Chart
            if (competencyChart) competencyChart.destroy();
            
            const ctx = document.getElementById('competencyChart').getContext('2d');
            competencyChart = new Chart(ctx, {
                type: 'radar',
                data: {
                    labels: ['직무이해', '기술활용', '문제해결', '협업능력', '자기주도'],
                    datasets: [{
                        label: '평균 달성도',
                        data: [85, 72, 90, 88, 75],
                        fill: true,
                        backgroundColor: 'rgba(59, 130, 246, 0.2)',
                        borderColor: 'rgb(59, 130, 246)',
                        pointBackgroundColor: 'rgb(59, 130, 246)',
                        pointBorderColor: '#fff',
                        pointHoverBackgroundColor: '#fff',
                        pointHoverBorderColor: 'rgb(59, 130, 246)'
                    }]
                },
                options: {
                    elements: { line: { borderWidth: 3 } },
                    scales: {
                        r: {
                            angleLines: { display: true },
                            suggestedMin: 0,
                            suggestedMax: 100
                        }
                    }
                }
            });

            // Mock Data for Scores
            document.getElementById('scoreDetails').innerHTML = [
                { label: '직무이해', score: 85 },
                { label: '기술활용', score: 72 },
                { label: '문제해결', score: 90 }
            ].map(d => \`
                <div>
                    <div class="flex justify-between text-sm mb-1">
                        <span class="font-bold text-gray-700">\${d.label}</span>
                        <span class="font-bold text-blue-600">\${d.score}점</span>
                    </div>
                    <div class="w-full bg-gray-100 rounded-full h-2">
                        <div class="bg-blue-500 h-2 rounded-full" style="width: \${d.score}%"></div>
                    </div>
                </div>
            \`).join('');

            document.getElementById('commentsList').innerHTML = '<div class="p-2 border-b">수업이 매우 유익했습니다.</div><div class="p-2 border-b">실습 장비가 조금 더 많았으면 좋겠습니다.</div>';
        }

    </script>
            </div>
        </div>
    </div>
</body>
</html>
`;
