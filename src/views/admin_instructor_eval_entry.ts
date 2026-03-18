import { hrdSidebar } from './components/hrd_sidebar';

/** 교강사직무능력평가 진입 페이지: 과정 선택 안내 */
export const adminInstructorEvalEntryHtml = () => `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>교강사직무능력평가 - 와우쓰리디</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
</head>
<body class="bg-slate-50">
    <div class="flex min-h-screen">
        ${hrdSidebar('instructor-eval')}
        <div class="flex-1 p-8">
            <div class="max-w-2xl mx-auto bg-white rounded-[2.5rem] border border-slate-200/60 shadow-sm p-10">
                <h1 class="text-2xl font-black text-slate-900 mb-2">교강사직무능력평가</h1>
                <p class="text-slate-600 mb-6">해당 과정·교과목별로 원장(관리자) 평가와 담당강사 본인 평가를 작성할 수 있습니다.</p>
                <p class="text-slate-700 mb-4">평가를 진행할 <strong>과정(회차)</strong>을 선택해 주세요.</p>
                <a href="/admin/courses" class="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition">
                    <i class="fas fa-graduation-cap"></i> 교육운영 관리에서 과정 선택
                </a>
                <p class="mt-6 text-sm text-slate-500">과정을 선택한 후 해당 과정의 LMS 메뉴에서 <strong>교강사직무능력평가</strong> 탭을 클릭하면 교과목별 평가 현황을 볼 수 있습니다.</p>
            </div>
        </div>
    </div>
</body>
</html>
`;
