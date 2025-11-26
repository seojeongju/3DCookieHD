export const adminReviewsListHtml = `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>리뷰 관리 - 와우쓰리디홍대센터</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <script>
      tailwind.config = {
        theme: {
          extend: {
            colors: {
              primary: {
                50: '#f0f7ff',
                100: '#e0effe',
                200: '#baddfd',
                300: '#7dbcfb',
                400: '#3a9bf7',
                500: '#5b9bd5',
                600: '#4a90e2',
                700: '#2d5fa3',
                800: '#1e4278',
                900: '#132d54'
              }
            }
          }
        }
      }
    </script>
</head>
<body class="bg-gray-50">
    <!-- 네비게이션 -->
    <nav class="bg-white shadow-md sticky top-0 z-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between items-center h-20">
                <div class="flex items-center space-x-4">
                    <a href="/admin" class="flex items-center space-x-4">
                        <img src="/static/logo.png" alt="WOW 3D" class="h-12">
                        <span class="text-xl font-bold text-gray-800">관리자 대시보드</span>
                    </a>
                </div>
                <div class="flex items-center space-x-4">
                    <a href="/admin" class="text-gray-700 hover:text-primary-600 font-medium">
                        <i class="fas fa-arrow-left mr-2"></i>대시보드로 돌아가기
                    </a>
                </div>
            </div>
        </div>
    </nav>

    <!-- 헤더 -->
    <div class="bg-white border-b border-gray-200">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div class="flex justify-between items-center">
                <div>
                    <h1 class="text-2xl font-bold text-gray-800">리뷰 관리</h1>
                    <p class="text-gray-600 mt-1">작성된 수강후기를 검토하고 승인합니다.</p>
                </div>
            </div>
        </div>
    </div>

    <!-- 메인 컨텐츠 -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <!-- 필터 및 검색 -->
        <div class="bg-white rounded-lg shadow-sm p-4 mb-6 flex flex-wrap gap-4 items-center justify-between">
            <div class="flex gap-4 items-center">
                <select id="statusFilter" onchange="loadReviews()" class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option value="">전체 상태</option>
                    <option value="0">승인 대기</option>
                    <option value="1">승인됨</option>
                </select>
            </div>
            <div class="flex gap-2">
                <button onclick="loadReviews()" class="p-2 text-gray-600 hover:text-blue-600">
                    <i class="fas fa-sync-alt"></i>
                </button>
            </div>
        </div>

        <!-- 목록 테이블 -->
        <div class="bg-white rounded-lg shadow overflow-hidden">
            <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                    <tr>
                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">상태</th>
                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">작성자 / 과정</th>
                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">평점 / 내용</th>
                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">작성일</th>
                        <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">관리</th>
                    </tr>
                </thead>
                <tbody id="reviewsTableBody" class="bg-white divide-y divide-gray-200">
                    <!-- 데이터가 로드되면 여기에 표시됩니다 -->
                    <tr>
                        <td colspan="5" class="px-6 py-12 text-center text-gray-500">
                            <i class="fas fa-spinner fa-spin mr-2"></i> 데이터를 불러오는 중...
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>

    <script>
        // 페이지 로드 시 목록 조회
        document.addEventListener('DOMContentLoaded', loadReviews);

        async function loadReviews() {
            const status = document.getElementById('statusFilter').value;
            
            let url = '/api/reviews?';
            if (status !== '') url += 'approved=' + status;

            try {
                const token = localStorage.getItem('token');
                const response = await fetch(url, {
                    headers: {
                        'Authorization': 'Bearer ' + token
                    }
                });
                const result = await response.json();
                
                const tbody = document.getElementById('reviewsTableBody');
                
                if (!result.success) {
                    tbody.innerHTML = '<tr><td colspan="5" class="px-6 py-4 text-center text-red-500">데이터를 불러오는데 실패했습니다.</td></tr>';
                    return;
                }

                if (result.data.length === 0) {
                    tbody.innerHTML = '<tr><td colspan="5" class="px-6 py-12 text-center text-gray-500">등록된 리뷰가 없습니다.</td></tr>';
                    return;
                }

                tbody.innerHTML = result.data.map(review => \`
                    <tr class="hover:bg-gray-50 transition">
                        <td class="px-6 py-4 whitespace-nowrap">
                            <span class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full \${
                                review.approved === 1 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                            }">
                                \${review.approved === 1 ? '승인됨' : '승인 대기'}
                            </span>
                        </td>
                        <td class="px-6 py-4">
                            <div class="text-sm font-medium text-gray-900">\${review.user_name || '이름 없음'}</div>
                            <div class="text-xs text-gray-500">\${review.course_title || '과정명 없음'}</div>
                        </td>
                        <td class="px-6 py-4">
                            <div class="flex text-yellow-400 text-xs mb-1">
                                \${getStarRating(review.rating)}
                            </div>
                            <div class="text-sm font-bold text-gray-800">\${review.title}</div>
                            <div class="text-sm text-gray-500 truncate max-w-xs">\${review.content}</div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            \${new Date(review.created_at).toLocaleDateString()}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            \${review.approved === 0 ? \`
                                <button onclick="approveReview(\${review.id}, true)" class="text-green-600 hover:text-green-900 mr-3">
                                    <i class="fas fa-check"></i> 승인
                                </button>
                            \` : \`
                                <button onclick="approveReview(\${review.id}, false)" class="text-yellow-600 hover:text-yellow-900 mr-3">
                                    <i class="fas fa-ban"></i> 승인 취소
                                </button>
                            \`}
                            <button onclick="deleteReview(\${review.id})" class="text-red-600 hover:text-red-900">
                                <i class="fas fa-trash"></i> 삭제
                            </button>
                        </td>
                    </tr>
                \`).join('');
                
            } catch (error) {
                console.error('Error:', error);
                document.getElementById('reviewsTableBody').innerHTML = '<tr><td colspan="5" class="px-6 py-4 text-center text-red-500">오류가 발생했습니다.</td></tr>';
            }
        }

        async function approveReview(id, approved) {
            if (!confirm(approved ? '이 리뷰를 승인하시겠습니까?' : '이 리뷰의 승인을 취소하시겠습니까?')) return;

            try {
                const token = localStorage.getItem('token');
                const response = await fetch(\`/api/reviews/\${id}/approve\`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token
                    },
                    body: JSON.stringify({ approved })
                });
                
                const result = await response.json();
                
                if (result.success) {
                    alert('처리되었습니다.');
                    loadReviews(); // 목록 새로고침
                } else {
                    alert('오류: ' + result.error);
                }
            } catch (error) {
                console.error('Error:', error);
                alert('처리 중 오류가 발생했습니다.');
            }
        }

        async function deleteReview(id) {
            if (!confirm('정말 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) return;

            try {
                const token = localStorage.getItem('token');
                const response = await fetch('/api/reviews/' + id, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': 'Bearer ' + token
                    }
                });
                
                const result = await response.json();
                
                if (result.success) {
                    alert('삭제되었습니다.');
                    loadReviews(); // 목록 새로고침
                } else {
                    alert('오류: ' + result.error);
                }
            } catch (error) {
                console.error('Error:', error);
                alert('삭제 중 오류가 발생했습니다.');
            }
        }

        function getStarRating(rating) {
            let stars = '';
            for (let i = 1; i <= 5; i++) {
                if (i <= rating) {
                    stars += '<i class="fas fa-star"></i>';
                } else {
                    stars += '<i class="far fa-star"></i>';
                }
            }
            return stars;
        }
    </script>
</body>
</html>
`;
