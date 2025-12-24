import { hrdSidebar } from './components/hrd_sidebar';

export const adminHrdStudentsHtml = () => `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>훈련생 관리 - HRD 행정시스템</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        primary: { 50: '#f0f7ff', 100: '#e0effe', 500: '#5b9bd5', 600: '#4a90e2', 700: '#2d5fa3' }
                    }
                }
            }
        }
    </script>
    <style>
        ::-webkit-scrollbar { width: 8px; height: 8px; }
        ::-webkit-scrollbar-track { background: #f1f1f1; }
        ::-webkit-scrollbar-thumb { background: #c1c1c1; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: #a8a8a8; }
    </style>
</head>
<body class="bg-gray-50 font-sans">
    <div class="flex h-screen overflow-hidden">
        ${hrdSidebar('students')}
        <div class="flex-1 flex flex-col overflow-hidden bg-gray-50">
            <header class="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 shadow-sm z-10">
                <div class="flex items-center">
                    <h2 class="text-xl font-bold text-gray-800">훈련생 관리</h2>
                    <span class="ml-4 text-sm text-gray-500">훈련생 상담, 등록, 수료 및 이력 관리</span>
                </div>
                <button onclick="openStudentModal()" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center shadow-sm font-medium">
                    <i class="fas fa-user-plus mr-2"></i> 훈련생 등록
                </button>
            </header>

            <main class="flex-1 overflow-y-auto p-8">
                <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
                    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                        <div class="md:col-span-2">
                            <label class="block text-sm font-medium text-gray-700 mb-1">통합 검색</label>
                            <div class="relative">
                                <input type="text" id="searchInput" placeholder="이름, 연락처, 생년월일로 검색" class="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                                <i class="fas fa-search absolute left-3 top-3.5 text-gray-400"></i>
                            </div>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">진행 상태</label>
                            <select id="statusFilter" class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                                <option value="">전체 상태</option>
                                <option value="consulting">상담중</option>
                                <option value="registered">등록완료</option>
                                <option value="learning">수강중</option>
                                <option value="completed">수료</option>
                                <option value="dropout">중도탈락</option>
                            </select>
                        </div>
                        <div>
                            <button onclick="loadStudents()" class="w-full px-6 py-2.5 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors font-medium">검색 적용</button>
                        </div>
                    </div>
                </div>

                <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <table class="w-full text-sm text-left">
                        <thead class="bg-gray-50 text-gray-500 font-medium border-b border-gray-200">
                            <tr>
                                <th class="px-6 py-4 w-16"><input type="checkbox" class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"></th>
                                <th class="px-6 py-4">이름 (성별/나이)</th>
                                <th class="px-6 py-4">연락처</th>
                                <th class="px-6 py-4">과정명</th>
                                <th class="px-6 py-4">진행상태</th>
                                <th class="px-6 py-4">최근 상담일</th>
                                <th class="px-6 py-4">등록일</th>
                                <th class="px-6 py-4 text-right">관리</th>
                            </tr>
                        </thead>
                        <tbody id="studentListBody" class="divide-y divide-gray-100"></tbody>
                    </table>
                    <div class="px-6 py-4 border-t border-gray-200 flex justify-between items-center bg-gray-50">
                        <span class="text-gray-500 text-sm">총 <span id="totalCount" class="font-bold text-gray-800">0</span>명의 훈련생</span>
                    </div>
                </div>
            </main>
        </div>
    </div>

    <!-- 개선된 모달 -->
    <div id="studentModal" class="relative z-50 hidden" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity opacity-0 duration-300 ease-out"></div>

        <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                <div class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-7xl opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95 duration-300 ease-out">
                    
                    <!-- 모달 헤더 -->
                    <div class="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4 border-b border-gray-200 sticky top-0 z-20">
                        <div class="sm:flex sm:items-center sm:justify-between">
                            <div class="flex items-center gap-3">
                                <div class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                                    <i class="fas fa-user-graduate text-blue-600"></i>
                                </div>
                                <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                                    <h3 class="text-xl font-semibold leading-6 text-gray-900" id="modal-title">훈련생 상세 정보</h3>
                                </div>
                            </div>
                            <div class="flex items-center gap-3 mt-4 sm:mt-0">
                                <span id="modalStatusBadge" class="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">신규 등록</span>
                                <button type="button" onclick="closeStudentModal()" class="text-gray-400 hover:text-gray-500 transition-colors">
                                    <span class="sr-only">Close</span>
                                    <i class="fas fa-times text-xl"></i>
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- 모달 바디 -->
                    <form id="studentForm" onsubmit="handleSaveStudent(event)">
                        <input type="hidden" name="id" id="studentId">
                        <div class="px-4 py-5 sm:p-6 bg-gray-50 max-h-[80vh] overflow-y-auto">
                            <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
                                
                                <!-- 좌측: 개인정보 및 수강정보 (8칸) -->
                                <div class="lg:col-span-8 space-y-6">
                                    
                                    <!-- 1. 기본 인적사항 -->
                                    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                        <h4 class="text-base font-semibold leading-7 text-gray-900 border-b border-gray-200 pb-3 mb-5 flex items-center text-blue-800">
                                            <i class="fas fa-address-card mr-2"></i> 기본 인적사항
                                        </h4>
                                        <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                                            <div>
                                                <label class="block text-sm font-medium text-gray-700">이름 <span class="text-red-500">*</span></label>
                                                <input type="text" name="name" id="stdName" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2">
                                            </div>
                                            <div>
                                                <label class="block text-sm font-medium text-gray-700">생년월일 <span class="text-red-500">*</span></label>
                                                <input type="date" name="birthdate" id="stdBirthdate" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2">
                                            </div>
                                            <div>
                                                <label class="block text-sm font-medium text-gray-700">성별 <span class="text-red-500">*</span></label>
                                                <div class="mt-2 flex gap-4">
                                                    <label class="inline-flex items-center"><input type="radio" name="gender" value="M" class="text-blue-600 focus:ring-blue-500 border-gray-300"> <span class="ml-2 text-sm text-gray-700">남성</span></label>
                                                    <label class="inline-flex items-center"><input type="radio" name="gender" value="F" class="text-blue-600 focus:ring-blue-500 border-gray-300"> <span class="ml-2 text-sm text-gray-700">여성</span></label>
                                                </div>
                                            </div>
                                            <div>
                                                <label class="block text-sm font-medium text-gray-700">연락처 <span class="text-red-500">*</span></label>
                                                <div class="mt-1 flex gap-2">
                                                    <input type="text" id="stdPhone1" value="010" class="block w-16 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2 text-center" maxlength="3">
                                                    <input type="text" id="stdPhone2" class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2 text-center" maxlength="4">
                                                    <input type="text" id="stdPhone3" class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2 text-center" maxlength="4">
                                                </div>
                                            </div>
                                            <div class="md:col-span-2">
                                                <label class="block text-sm font-medium text-gray-700">이메일</label>
                                                <input type="email" name="email" id="stdEmail" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2">
                                            </div>
                                            <div class="md:col-span-2">
                                                <label class="block text-sm font-medium text-gray-700">주소</label>
                                                <input type="text" name="address" id="stdAddress" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2" placeholder="주소를 입력하세요">
                                            </div>
                                            <div>
                                                <label class="block text-sm font-medium text-gray-700">최종 학력</label>
                                                <select name="education" id="stdEducation" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2">
                                                    <option value="">선택하세요</option>
                                                    <option value="high_school">고등학교 졸업</option>
                                                    <option value="college">대학(2,3년제) 졸업</option>
                                                    <option value="university">대학교(4년제) 졸업</option>
                                                    <option value="graduate">대학원 졸업</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label class="block text-sm font-medium text-gray-700">자격증 취득</label>
                                                <input type="text" name="certifications" id="stdCertifications" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2" placeholder="보유 자격증 입력">
                                            </div>
                                        </div>
                                    </div>

                                    <!-- 2. 수강 및 결제 정보 -->
                                    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                        <h4 class="text-base font-semibold leading-7 text-gray-900 border-b border-gray-200 pb-3 mb-5 flex items-center text-green-800">
                                            <i class="fas fa-book-open mr-2"></i> 수강 및 결제 정보
                                        </h4>
                                        <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                                            <div class="md:col-span-2">
                                                <label class="block text-sm font-medium text-gray-700">과정 선택 <span class="text-red-500">*</span></label>
                                                <select name="course_id" id="stdCourseId" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2">
                                                    <option value="">과정을 선택하세요</option>
                                                    <!-- 과정 목록 동적 로드 -->
                                                </select>
                                            </div>
                                            <div>
                                                <label class="block text-sm font-medium text-gray-700">대상 구분 <span class="text-red-500">*</span></label>
                                                <select name="type" id="stdType" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2">
                                                    <option value="">선택하세요</option>
                                                    <option value="jobseeker">구직자</option>
                                                    <option value="worker">재직자</option>
                                                    <option value="general">일반</option>
                                                    <option value="student">학생</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label class="block text-sm font-medium text-gray-700">취업성공패키지 유형</label>
                                                <select name="package_type" id="stdPackageType" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2">
                                                    <option value="">해당 없음</option>
                                                    <option value="type1">1유형</option>
                                                    <option value="type2">2유형</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label class="block text-sm font-medium text-gray-700">결재 방법</label>
                                                <select name="payment_method" id="stdPaymentMethod" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2">
                                                    <option value="">선택하세요</option>
                                                    <option value="card">카드</option>
                                                    <option value="transfer">계좌이체</option>
                                                    <option value="cash">현금</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label class="block text-sm font-medium text-gray-700">결재 일자</label>
                                                <input type="date" name="payment_date" id="stdPaymentDate" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2">
                                            </div>
                                            <div>
                                                <label class="block text-sm font-medium text-gray-700">총 자비 부담금</label>
                                                <div class="relative mt-1 rounded-md shadow-sm">
                                                    <input type="text" name="self_pay_amount" id="stdSelfPayAmount" class="block w-full rounded-md border-gray-300 pl-3 pr-12 focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2 text-right" placeholder="0">
                                                    <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                                        <span class="text-gray-500 sm:text-sm">원</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- 3. 행정 처리 상태 -->
                                    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                        <h4 class="text-base font-semibold leading-7 text-gray-900 border-b border-gray-200 pb-3 mb-5 flex items-center text-purple-800">
                                            <i class="fas fa-clipboard-check mr-2"></i> 행정 처리 상태
                                        </h4>
                                        <div class="flex gap-8">
                                            <label class="inline-flex items-center cursor-pointer">
                                                <input type="checkbox" id="stdHasApplication" class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 h-5 w-5">
                                                <span class="ml-2 text-gray-700 font-medium">신청서 접수</span>
                                            </label>
                                            <label class="inline-flex items-center cursor-pointer">
                                                <input type="checkbox" id="stdHasCard" class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 h-5 w-5">
                                                <span class="ml-2 text-gray-700 font-medium">내일배움카드 발급</span>
                                            </label>
                                            <label class="inline-flex items-center cursor-pointer">
                                                <input type="checkbox" id="stdIsHrdNetRegistered" class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 h-5 w-5">
                                                <span class="ml-2 text-gray-700 font-medium">고용24 입력 완료</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <!-- 우측: 상담 및 이력 (4칸) -->
                                <div class="lg:col-span-4 space-y-6">
                                    
                                    <!-- 진행 상태 -->
                                    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                        <h4 class="text-base font-semibold leading-7 text-gray-900 border-b border-gray-200 pb-3 mb-5 flex items-center text-orange-800">
                                            <i class="fas fa-tasks mr-2"></i> 진행 상태
                                        </h4>
                                        <div class="space-y-4">
                                            <div>
                                                <label class="block text-sm font-medium text-gray-700">현재 상태 <span class="text-red-500">*</span></label>
                                                <select name="status" id="stdStatus" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2">
                                                    <option value="consulting">상담중</option>
                                                    <option value="registered">등록완료</option>
                                                    <option value="learning">수강중</option>
                                                    <option value="completed">수료</option>
                                                    <option value="dropout">중도탈락</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label class="block text-sm font-medium text-gray-700">상태 메모</label>
                                                <textarea name="status_memo" id="stdStatusMemo" rows="4" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2 resize-none"></textarea>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- 상담 이력 -->
                                    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col h-[600px]">
                                        <h4 class="text-base font-semibold leading-7 text-gray-900 border-b border-gray-200 pb-3 mb-4 flex items-center text-blue-800">
                                            <i class="fas fa-comments mr-2"></i> 상담 이력
                                        </h4>
                                        
                                        <!-- 인라인 입력 폼 -->
                                        <div class="mb-4 bg-gray-50 p-3 rounded-lg border border-gray-200">
                                            <div class="flex gap-2 mb-2">
                                                <input type="date" id="consultDate" class="block w-1/2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-xs border p-1.5">
                                                <input type="text" id="consultManager" value="관리자" class="block w-1/2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-xs border p-1.5" placeholder="담당자">
                                            </div>
                                            <textarea id="consultContent" rows="3" class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm border p-2 resize-none mb-2" placeholder="상담 내용을 입력하세요..."></textarea>
                                            <button type="button" onclick="addConsultationLog()" class="w-full rounded bg-blue-600 px-2 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-500 transition-colors">
                                                <i class="fas fa-plus mr-1"></i> 상담 기록 추가
                                            </button>
                                        </div>

                                        <div id="consultationList" class="flex-1 overflow-y-auto pr-1 space-y-4">
                                            <!-- 동적 로드 -->
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- 모달 푸터 -->
                        <div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 border-t border-gray-200 sticky bottom-0 z-20">
                            <button type="submit" class="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto transition-colors">저장하기</button>
                            <button type="button" onclick="closeStudentModal()" class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto transition-colors">취소</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>

    <script>
        let studentsData = [];
        let coursesData = [];

        document.addEventListener('DOMContentLoaded', () => { 
            loadStudents(); 
            loadCourses();
        });

        async function loadCourses() {
            try {
                const response = await fetch('/api/courses');
                const result = await response.json();
                if (result.success) {
                    coursesData = result.data;
                    loadCoursesIntoSelect();
                    // 학생 목록 다시 로드하여 과정명 표시 업데이트
                    loadStudents();
                }
            } catch (e) {
                console.error('Failed to load courses:', e);
            }
        }

        function loadCoursesIntoSelect() {
            const select = document.getElementById('stdCourseId');
            const options = coursesData.map(c => {
                const statusLabel = c.status === 'active' ? '[개설중]' : '[개설예정]';
                return '<option value="' + c.id + '">' + statusLabel + ' ' + c.title + '</option>';
            }).join('');
            select.innerHTML = '<option value="">과정을 선택하세요</option>' + options;
        }

        function getCourseName(id) {
            if (!id) return '-';
            const course = coursesData.find(c => c.id == id);
            return course ? course.title : '-';
        }

        async function loadStudents() {
            const tbody = document.getElementById('studentListBody');
            const totalCount = document.getElementById('totalCount');
            const search = document.getElementById('searchInput').value;
            const status = document.getElementById('statusFilter').value;

            try {
                let url = '/api/hrd/students?';
                if (search) url += 'search=' + encodeURIComponent(search) + '&';
                if (status) url += 'status=' + status;

                const response = await fetch(url);
                const result = await response.json();

                if (result.success) {
                    studentsData = result.data;
                    totalCount.textContent = studentsData.length;

                    if (studentsData.length === 0) {
                        tbody.innerHTML = '<tr><td colspan="8" class="px-6 py-16 text-center text-gray-500">검색 결과가 없습니다.</td></tr>';
                        return;
                    }
                    tbody.innerHTML = studentsData.map(s => getStudentRowHtml(s)).join('');
                } else {
                    tbody.innerHTML = '<tr><td colspan="8" class="px-6 py-16 text-center text-red-500">데이터 로드 실패</td></tr>';
                }
            } catch (e) {
                console.error(e);
                tbody.innerHTML = '<tr><td colspan="8" class="px-6 py-16 text-center text-red-500">오류 발생</td></tr>';
            }
        }

        function getStudentRowHtml(s) {
            return '<tr class="hover:bg-blue-50/50 transition-colors group border-b border-gray-50 last:border-0">' +
                '<td class="px-6 py-4"><input type="checkbox" class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"></td>' +
                '<td class="px-6 py-4">' +
                    '<div class="flex items-center">' +
                        '<div class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 mr-3 font-bold text-xs">' + s.name.charAt(0) + '</div>' +
                        '<div>' +
                            '<div class="font-bold text-gray-800">' + s.name + '</div>' +
                            '<div class="text-xs text-gray-500">' + (s.birthdate || '-') + ' (' + (s.gender === "M" ? "남" : "여") + ')</div>' +
                        '</div>' +
                    '</div>' +
                '</td>' +
                '<td class="px-6 py-4">' +
                    '<div class="text-gray-700 font-medium">' + s.phone + '</div>' +
                    '<div class="text-xs text-gray-400">' + (s.email || "-") + '</div>' +
                '</td>' +
                '<td class="px-6 py-4 text-sm text-gray-600">' + getCourseName(s.course_id) + '</td>' +
                '<td class="px-6 py-4">' + getStatusBadge(s.status) + '</td>' +
                '<td class="px-6 py-4 text-sm text-gray-600">' + (s.last_consult ? s.last_consult.split(' ')[0] : "-") + '</td>' +
                '<td class="px-6 py-4 text-sm text-gray-500">' + (s.created_at ? s.created_at.split(' ')[0] : '-') + '</td>' +
                '<td class="px-6 py-4 text-right">' +
                    '<button onclick="editStudent(' + s.id + ')" class="text-gray-400 hover:text-blue-600 transition-colors p-2 rounded-full hover:bg-blue-50"><i class="fas fa-edit"></i></button>' +
                '</td>' +
            '</tr>';
        }

        function getStatusBadge(status) {
            const styles = {
                'consulting': 'bg-yellow-50 text-yellow-700 border-yellow-200',
                'registered': 'bg-blue-50 text-blue-700 border-blue-200',
                'learning': 'bg-green-50 text-green-700 border-green-200',
                'completed': 'bg-purple-50 text-purple-700 border-purple-200',
                'dropout': 'bg-red-50 text-red-700 border-red-200'
            };
            const labels = { 'consulting': '상담중', 'registered': '등록완료', 'learning': '수강중', 'completed': '수료', 'dropout': '중도탈락' };
            return '<span class="px-2.5 py-1 text-xs font-semibold rounded-full border ' + (styles[status] || 'bg-gray-100 text-gray-600 border-gray-200') + '">' + (labels[status] || status) + '</span>';
        }

        function openStudentModal() {
            const modal = document.getElementById('studentModal');
            const backdrop = modal.querySelector('.bg-gray-500');
            const panel = modal.querySelector('.transform');
            
            modal.classList.remove('hidden');
            
            setTimeout(() => {
                backdrop.classList.add('opacity-100');
                backdrop.classList.remove('opacity-0');
                panel.classList.add('opacity-100', 'translate-y-0', 'sm:scale-100');
                panel.classList.remove('opacity-0', 'translate-y-4', 'sm:translate-y-0', 'sm:scale-95');
            }, 10);

            document.body.style.overflow = 'hidden';
            document.getElementById('studentForm').reset();
            document.getElementById('studentId').value = '';
            document.getElementById('modalStatusBadge').textContent = '신규 등록';
            document.getElementById('consultationList').innerHTML = '<div class="text-center text-gray-400 py-8 text-sm">기존 정보를 수정하거나 등록 후 상담이 가능합니다.</div>';
            
            document.getElementById('consultDate').value = new Date().toISOString().split('T')[0];
            document.getElementById('consultManager').value = '관리자';
            document.getElementById('consultContent').value = '';
        }

        function closeStudentModal() {
            const modal = document.getElementById('studentModal');
            const backdrop = modal.querySelector('.bg-gray-500');
            const panel = modal.querySelector('.transform');

            backdrop.classList.remove('opacity-100');
            backdrop.classList.add('opacity-0');
            panel.classList.remove('opacity-100', 'translate-y-0', 'sm:scale-100');
            panel.classList.add('opacity-0', 'translate-y-4', 'sm:translate-y-0', 'sm:scale-95');

            setTimeout(() => {
                modal.classList.add('hidden');
                document.body.style.overflow = '';
            }, 300);
        }

        function editStudent(id) {
            const student = studentsData.find(s => s.id === id);
            if (!student) return;
            openStudentModal();
            document.getElementById('modalStatusBadge').textContent = '정보 수정';
            document.getElementById('studentId').value = student.id;
            
            // 기본 인적사항
            document.getElementById('stdName').value = student.name;
            document.getElementById('stdBirthdate').value = student.birthdate || '';
            const phones = (student.phone || '').split('-');
            if (phones.length === 3) {
                document.getElementById('stdPhone1').value = phones[0];
                document.getElementById('stdPhone2').value = phones[1];
                document.getElementById('stdPhone3').value = phones[2];
            }
            document.getElementById('stdEmail').value = student.email || '';
            document.getElementById('stdAddress').value = student.address || '';
            document.getElementById('stdEducation').value = student.education || '';
            document.getElementById('stdCertifications').value = student.certifications || '';
            const genderRadio = document.querySelector('input[name="gender"][value="' + student.gender + '"]');
            if (genderRadio) genderRadio.checked = true;

            // 수강 및 결제 정보
            document.getElementById('stdCourseId').value = student.course_id || '';
            document.getElementById('stdType').value = student.type || '';
            document.getElementById('stdPackageType').value = student.package_type || '';
            document.getElementById('stdPaymentMethod').value = student.payment_method || '';
            document.getElementById('stdPaymentDate').value = student.payment_date ? student.payment_date.split(' ')[0] : '';
            document.getElementById('stdSelfPayAmount').value = student.self_pay_amount || '';

            // 행정 처리 상태
            document.getElementById('stdHasApplication').checked = !!student.has_application;
            document.getElementById('stdHasCard').checked = !!student.has_card;
            document.getElementById('stdIsHrdNetRegistered').checked = !!student.is_hrd_net_registered;

            // 진행 상태
            document.getElementById('stdStatus').value = student.status || 'consulting';
            document.getElementById('stdStatusMemo').value = student.status_memo || '';

            loadConsultations(student.id);
        }

        async function handleSaveStudent(e) {
            e.preventDefault();
            const id = document.getElementById('studentId').value;
            
            // 데이터 수집
            const name = document.getElementById('stdName').value;
            const birthdate = document.getElementById('stdBirthdate').value;
            const phone = document.getElementById('stdPhone1').value + '-' + document.getElementById('stdPhone2').value + '-' + document.getElementById('stdPhone3').value;
            const type = document.getElementById('stdType').value;
            const gender = document.querySelector('input[name="gender"]:checked')?.value;
            const status = document.getElementById('stdStatus').value;

            if (!name || !birthdate || !phone || !type || !gender || !status) { alert('필수 항목을 입력해주세요.'); return; }

            const formData = {
                id,
                name, birthdate, phone, type, gender, status,
                email: document.getElementById('stdEmail').value,
                address: document.getElementById('stdAddress').value,
                education: document.getElementById('stdEducation').value,
                certifications: document.getElementById('stdCertifications').value,
                course_id: document.getElementById('stdCourseId').value,
                package_type: document.getElementById('stdPackageType').value,
                payment_method: document.getElementById('stdPaymentMethod').value,
                payment_date: document.getElementById('stdPaymentDate').value,
                self_pay_amount: document.getElementById('stdSelfPayAmount').value,
                has_application: document.getElementById('stdHasApplication').checked,
                has_card: document.getElementById('stdHasCard').checked,
                is_hrd_net_registered: document.getElementById('stdIsHrdNetRegistered').checked,
                status_memo: document.getElementById('stdStatusMemo').value
            };

            try {
                const response = await fetch('/api/hrd/students', {
                    method: id ? 'PUT' : 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });
                const result = await response.json();
                if (result.success) {
                    alert('성공적으로 저장되었습니다.');
                    closeStudentModal();
                    loadStudents();
                } else {
                    alert('저장 실패: ' + result.error);
                }
            } catch (e) {
                console.error(e);
                alert('오류가 발생했습니다.');
            }
        }

        async function loadConsultations(studentId) {
            const list = document.getElementById('consultationList');
            try {
                const response = await fetch('/api/hrd/students/' + studentId + '/consultations');
                const result = await response.json();

                if (result.success) {
                    const logs = result.data;
                    if (logs.length === 0) { list.innerHTML = '<div class="text-center text-gray-400 py-8 text-sm">등록된 상담 이력이 없습니다.</div>'; return; }
                    list.innerHTML = logs.map(log => 
                        '<div class="relative pl-4 border-l-2 border-gray-200 pb-4 last:pb-0">' +
                            '<div class="absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full bg-gray-300 ring-4 ring-white"></div>' +
                            '<div class="flex justify-between items-center mb-1">' +
                                '<span class="text-xs font-bold text-gray-700">' + (log.created_at ? log.created_at.split(\' \')[0] : \'-\') + '</span>' +
                                '<span class="text-xs text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">' + (log.memo || \'관리자\') + '</span>' +
                            '</div>' +
                            '<p class="text-sm text-gray-600 leading-relaxed bg-gray-50 p-3 rounded-lg">' + log.message + '</p>' +
                        '</div>'
                    ).join('');
                }
            } catch (e) {
                console.error(e);
            }
        }

        async function addConsultationLog() {
            const studentId = document.getElementById('studentId').value;
            if (!studentId) { alert('먼저 훈련생을 저장해주세요.'); return; }
            
            const date = document.getElementById('consultDate').value;
            const manager = document.getElementById('consultManager').value;
            const content = document.getElementById('consultContent').value;

            if (!content) { alert('상담 내용을 입력해주세요.'); return; }
            if (!date) { alert('날짜를 선택해주세요.'); return; }

            try {
                const response = await fetch('/api/hrd/students/' + studentId + '/consultations', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ content, manager, date })
                });
                const result = await response.json();
                if (result.success) {
                    document.getElementById('consultContent').value = '';
                    loadConsultations(studentId);
                    loadStudents();
                } else {
                    alert('상담 기록 추가 실패: ' + result.error);
                }
            } catch (e) {
                console.error(e);
                alert('오류가 발생했습니다.');
            }
        }
    
    </script>
</body>
</html>
`;
